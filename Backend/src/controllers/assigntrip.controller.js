
const TripAssignment = require('../models/tripassignment.model.js');
const Driver = require('../models/driver.model.js');
const Bus = require('../models/bus.model.js'); 
const Conductor = require('../models/conductor.model.js');
const Route = require('../models/route.model.js');const scheduleDailyTrips = async (req, res) => {
  try {
    const buses = await Bus.find();
    const drivers = await Driver.find();
    const conductors = await Conductor.find();
    const routes = await Route.find();

    const startHour = 6; // Start time 6 AM
    const endHour = 22; // End time 10 PM
    const maxWorkHours = 8 * 60; // 8 hours in minutes (480 minutes)
    const maxContinuousDrivingMinutes = 240; // Max 4 hours of continuous driving

    const trips = [];

    // Ensure there are enough drivers, conductors, and buses
    if (buses.length === 0 || drivers.length === 0 || conductors.length === 0 || routes.length === 0) {
      return res.status(400).json({ message: 'Not enough buses, drivers, conductors, or routes available.' });
    }

    const driverWorkTime = {};
    const conductorWorkTime = {};
    const continuousDrivingTime = {};

    drivers.forEach(driver => {
      driverWorkTime[driver._id] = 0; // Initialize with 0 minutes
      continuousDrivingTime[driver._id] = 0; // Track continuous driving time
    });

    conductors.forEach(conductor => {
      conductorWorkTime[conductor._id] = 0; // Initialize with 0 minutes
    });

    const busSchedules = {};
    buses.forEach(bus => {
      busSchedules[bus._id] = [];
    });

    let routeIndex = 0;
    let driverIndex = 0;
    let conductorIndex = 0;
    let busIndex = 0;

    // Get the current date and time
    const currentDateTime = new Date();

    // If the current time is after 10 PM, no trips should be scheduled
    if (currentDateTime.getHours() >= endHour) {
      return res.status(400).json({ message: 'It is too late to schedule trips for today.' });
    }

    // Set the `startTime` to 6 AM of the current day (or current time if function triggered after 6 AM)
    let startTime = new Date();
    startTime.setHours(Math.max(startHour, currentDateTime.getHours()), 0, 0, 0); // Use the current hour if it’s after 6 AM

    let lastEndLocation = null;

    // Schedule trips for the day
    while (startTime.getHours() < endHour) {
      let route;

      // Select a route where the start point matches the last trip's end point
      if (lastEndLocation) {
        route = routes.find(r => r.startPoint.coordinates[0] === lastEndLocation.coordinates[0] &&
                                  r.startPoint.coordinates[1] === lastEndLocation.coordinates[1]) ||
                routes[routeIndex % routes.length]; // Default to the next route if no match
      } else {
        route = routes[routeIndex % routes.length]; // Select a route (rotate through available routes)
      }

      routeIndex++; // Move to the next route for the next trip

      const tripDurationMinutes = route.time / 60; // Convert trip time from seconds to minutes
      const scheduledEndTime = addMinutes(startTime, tripDurationMinutes);

      // Check if the scheduled trip would exceed the 10 PM limit
      if (scheduledEndTime.getHours() >= endHour) {
        break; // Stop scheduling trips if they would exceed 10 PM
      }

      const bus = findAvailableBus(startTime, scheduledEndTime, busSchedules, buses);
      if (!bus) {
        break; // No available bus, exit loop
      }

      const driver = drivers[driverIndex % drivers.length]; // Cycle through drivers
      const conductor = conductors[conductorIndex % conductors.length]; // Cycle through conductors

      // Check if the driver or conductor exceeds 8 hours of total work time
      if (driverWorkTime[driver._id] + tripDurationMinutes > maxWorkHours) {
        driverIndex++; // Move to the next driver
        continue; // Skip to the next iteration if the driver exceeds work time
      }
      if (conductorWorkTime[conductor._id] + tripDurationMinutes > maxWorkHours) {
        conductorIndex++; // Move to the next conductor
        continue; // Skip to the next iteration if the conductor exceeds work time
      }

      // Enforce max continuous driving limit (4 hours)
      if (continuousDrivingTime[driver._id] + tripDurationMinutes > maxContinuousDrivingMinutes) {
        const mandatoryBreak = 30; // 30-minute mandatory break
        startTime = addMinutes(scheduledEndTime, mandatoryBreak);
        continuousDrivingTime[driver._id] = 0; // Reset continuous driving time after break
        continue; // Skip to the next trip after the break
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
        tripSequence: trips.filter(
          trip => trip.driver_id.toString() === driver._id.toString()
        ).length + 1,
      });

      // Update bus schedule
      busSchedules[bus._id].push({
        startTime: new Date(startTime),
        endTime: new Date(scheduledEndTime),
      });

      // Update last end location for prioritizing the next trip's start
      lastEndLocation = route.endPoint;

      // Update work time for driver and conductor
      driverWorkTime[driver._id] += tripDurationMinutes;
      conductorWorkTime[conductor._id] += tripDurationMinutes;
      continuousDrivingTime[driver._id] += tripDurationMinutes;

      // Add rest time based on trip duration (15 minutes per hour of driving, minimum 5 minutes)
      const restTime = Math.max(5, Math.floor(tripDurationMinutes / 60) * 15);
      startTime = addMinutes(scheduledEndTime, restTime); // Rest period after the trip

      // Cycle through the next driver, conductor, and bus
      driverIndex++;
      conductorIndex++;
      busIndex++;
    }

    if (trips.length > 0) {
      await TripAssignment.insertMany(trips);
      console.log('Trips inserted successfully');
    } else {
      console.log('No trips to insert');
    }

    res.status(201).json({ message: 'Trips scheduled for the day', trips });
  } catch (error) {
    console.error('Error scheduling trips:', error);
    res.status(500).json({ message: 'Error scheduling trips', error: error.message });
  }
};

// Utility function to add minutes to a date
const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000); // Add minutes to the current date/time
};

// Function to find an available bus
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
module.exports = {
  scheduleDailyTrips,
};   