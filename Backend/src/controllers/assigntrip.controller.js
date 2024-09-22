const TripAssignment = require('../models/tripassignment.model.js');
const Driver = require('../models/driver.model.js');
const Bus = require('../models/bus.model.js');
const Conductor = require('../models/conductor.model.js');
const Route = require('../models/route.model.js');

const scheduleDailyTrips = async (req, res) => {
  try {
    const buses = await Bus.find();
    const drivers = await Driver.find();
    const conductors = await Conductor.find();
    const routes = await Route.find(); // We will limit to the two available routes

    const startHour = 6; // Start scheduling from 6 AM
    const endHour = 22; // Schedule until 10 PM
    const maxWorkHours = 8 * 60; // 8 hours in minutes
    const maxContinuousDrivingMinutes = 240; // 4 hours of continuous driving
    const restTimePerHour = 15; // 15-minute rest after each hour of driving

    // Ensure there are enough resources (drivers, conductors, buses, and at least two routes)
    if (buses.length === 0 || drivers.length === 0 || conductors.length === 0 || routes.length < 2) {
      return res.status(400).json({
        message: 'Not enough buses, drivers, conductors, or routes available.',
      });
    }

    const trips = [];

    // Initialize work time and availability tracking for drivers and conductors
    const driverWorkTime = {};
    const conductorWorkTime = {};
    const continuousDrivingTime = {};

    drivers.forEach((driver) => {
      driverWorkTime[driver._id] = 0;
      continuousDrivingTime[driver._id] = 0;
    });

    conductors.forEach((conductor) => {
      conductorWorkTime[conductor._id] = 0;
    });

    const busSchedules = {};
    buses.forEach((bus) => {
      busSchedules[bus._id] = [];
    });

    // Create pools of available drivers and conductors
    let availableDrivers = drivers.slice();
    let availableConductors = conductors.slice();
    let busIndex = 0;

    // Start scheduling from 6 AM
    const today = new Date();
    let startTime = new Date(today);
    startTime.setHours(startHour, 0, 0, 0);

    // Schedule trips continuously until endHour or all drivers/conductors have completed their work
    while (startTime.getHours() < endHour) {
      // Break if no available drivers or conductors
      if (availableDrivers.length === 0 || availableConductors.length === 0) {
        break;
      }

      // Assign drivers and conductors who haven't completed 8 hours
      availableDrivers = drivers.filter(driver => driverWorkTime[driver._id] < maxWorkHours);
      availableConductors = conductors.filter(conductor => conductorWorkTime[conductor._id] < maxWorkHours);

      // If no drivers or conductors left to assign, break
      if (availableDrivers.length === 0 || availableConductors.length === 0) {
        break;
      }

      // Get the next available driver and conductor
      let driver = availableDrivers[0];
      let conductor = availableConductors[0];

      // Find the next route starting from the last trip's end location, or any route if it's their first trip
      let route = findNextRoute(driver._id, trips, routes);

      // If no suitable route, continue
      if (!route) {
        availableDrivers.shift();
        availableConductors.shift();
        continue;
      }

      const tripDurationMinutes = route.time / 60; // Convert route time from seconds to minutes
      const scheduledEndTime = addMinutes(startTime, tripDurationMinutes);

      // Stop scheduling if the trip would exceed the 10 PM limit
      if (scheduledEndTime.getHours() >= endHour) {
        break;
      }

      const bus = findAvailableBus(startTime, scheduledEndTime, busSchedules, buses);
      if (!bus) {
        // No available bus, try scheduling again after 15 minutes
        startTime = addMinutes(startTime, 15);
        continue;
      }

      // Enforce max continuous driving time limit
      if (continuousDrivingTime[driver._id] + tripDurationMinutes > maxContinuousDrivingMinutes) {
        const mandatoryBreak = 30; // 30-minute break
        startTime = addMinutes(startTime, mandatoryBreak);
        continuousDrivingTime[driver._id] = 0; // Reset continuous driving time after break
        continue;
      }

      // Schedule the trip
      trips.push({
        routeId: route._id,
        driver_id: driver._id,
        conductor_id: conductor._id,
        busId: bus._id,
        scheduledStartTime: new Date(startTime),
        scheduledEndTime: new Date(scheduledEndTime),
        status: 'scheduled',
        startLocation: {
          type: 'Point',
          coordinates: route.startPoint.coordinates,
        },
        endLocation: {
          type: 'Point',
          coordinates: route.endPoint.coordinates,
        },
        tripSequence:
          trips.filter(
            (trip) => trip.driver_id.toString() === driver._id.toString()
          ).length + 1,
      });

      // Update bus schedule
      busSchedules[bus._id].push({
        startTime: new Date(startTime),
        endTime: new Date(scheduledEndTime),
      });

      // Update work time tracking for drivers and conductors
      driverWorkTime[driver._id] += tripDurationMinutes;
      conductorWorkTime[conductor._id] += tripDurationMinutes;
      continuousDrivingTime[driver._id] += tripDurationMinutes;

      // Add rest time
      const restTime = Math.max(5, Math.floor(tripDurationMinutes / 60) * restTimePerHour);
      startTime = addMinutes(scheduledEndTime, restTime);

      // Remove drivers/conductors if they have reached 8 hours
      if (driverWorkTime[driver._id] >= maxWorkHours) {
        availableDrivers.shift();
        continuousDrivingTime[driver._id] = 0; // Reset continuous driving time
      }

      if (conductorWorkTime[conductor._id] >= maxWorkHours) {
        availableConductors.shift();
      }
    }

    // Logging drivers/conductors who haven't completed 8 hours
    drivers.forEach((driver) => {
      if (driverWorkTime[driver._id] < maxWorkHours) {
        console.log(`Driver ${driver._id} hasn't completed 8 hours of work.`);
      }
    });

    conductors.forEach((conductor) => {
      if (conductorWorkTime[conductor._id] < maxWorkHours) {
        console.log(
          `Conductor ${conductor._id} hasn't completed 8 hours of work.`
        );
      }
    });

    if (trips.length > 0) {
      await TripAssignment.insertMany(trips);
      console.log('Trips inserted successfully');
    } else {
      console.log('No trips to insert');
    }

    res.status(201).json({ message: 'Trips scheduled for the day', trips });
  } catch (error) {
    console.error('Error scheduling trips:', error);
    res.status(500).json({
      message: 'Error scheduling trips',
      error: error.message,
    });
  }
};

// Utility function to add minutes to a date
const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

// Find the next available bus that fits in the schedule
const findAvailableBus = (startTime, endTime, busSchedules, buses) => {
  for (let bus of buses) {
    const schedules = busSchedules[bus._id];
    let isAvailable = true;

    for (let schedule of schedules) {
      if (
        (startTime >= schedule.startTime && startTime < schedule.endTime) ||
        (endTime > schedule.startTime && endTime <= schedule.endTime) ||
        (startTime <= schedule.startTime && endTime >= schedule.endTime)
      ) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      return bus;
    }
  }

  return null;
};

// Find the next route for a driver starting from their last end location
const findNextRoute = (driverId, trips, routes) => {
  const driverTrips = trips
    .filter((trip) => trip.driver_id.toString() === driverId.toString())
    .sort((a, b) => b.scheduledEndTime - a.scheduledEndTime);

  if (driverTrips.length > 0) {
    const lastTrip = driverTrips[0];
    return routes.find(
      (route) =>
        route.startPoint.coordinates[0] === lastTrip.endLocation.coordinates[0] &&
        route.startPoint.coordinates[1] === lastTrip.endLocation.coordinates[1]
    );
  }

  // If it's the driver's first trip, assign any route
  return routes[0];
};

module.exports = { scheduleDailyTrips };
