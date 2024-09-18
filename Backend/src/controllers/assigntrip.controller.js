
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
    const routes = await Route.find(); // Fetch all routes

    console.log('Buses:', buses);
    console.log('Drivers:', drivers);
    console.log('Conductors:', conductors);
    console.log('Routes:', routes);

    const startHour = 5; // Start time 5 AM
    const endHour = 22; // End time 10 PM
    const maxWorkHours = 8 * 60; // 8 hours in minutes (480 minutes)

    const trips = [];

    // Ensure there are enough drivers, conductors, and buses
    if (buses.length === 0 || drivers.length === 0 || conductors.length === 0 || routes.length === 0) {
      return res.status(400).json({ message: 'Not enough buses, drivers, conductors, or routes available.' });
    }

    // Loop through buses
    buses.forEach((bus, index) => {
      let driver = drivers[index % drivers.length];
      let conductor = conductors[index % conductors.length];
      let route = routes[index % routes.length]; // Rotate through routes

      console.log(`Assigning bus ${bus._id} to driver ${driver._id} and conductor ${conductor._id} on route ${route._id}`);

      let tripSequence = 0;
      let startTime = new Date();
      startTime.setHours(startHour, 0, 0, 0); // Set start time to 5 AM

      let lastEndPoint = route.startPoint; // Set initial start location
      let totalWorkTime = 0; // Track total work time (minutes)

      while (startTime.getHours() < endHour) {
        const tripDurationSeconds = route.time; // Get trip duration in seconds
        const tripDurationMinutes = tripDurationSeconds / 60; // Convert to minutes
        const expectedEndTime = addMinutes(startTime, tripDurationMinutes);

        console.log(`Trip duration: ${tripDurationMinutes} minutes`);
        console.log(`Expected end time: ${expectedEndTime}`);

        // Check if this trip would exceed 8 hours
        if (totalWorkTime + tripDurationMinutes > maxWorkHours) {
          if (tripSequence === 0) {
            // Allow the first trip even if it exceeds the 8-hour work limit
            console.log('First trip exceeds max work hours, but scheduling it anyway');
          } else {
            console.log('Max work hours reached for this driver and conductor');
            break; // Stop scheduling more trips for this driver/conductor
          }
        }

        // Create a new trip assignment
        trips.push({
          routeId: route._id,
          driverId: driver._id,
          conductorId: conductor._id,
          busId: bus._id,
          startTime,
          expectedEndTime,
          status: 'ongoing',
          tripSequence: ++tripSequence,
          startLocation: {
            type: 'Point',
            coordinates: lastEndPoint.coordinates, // From previous trip end or route start
          },
          endLocation: {
            type: 'Point',
            coordinates: route.endPoint.coordinates, // Route's end point
          }
        });

        console.log(`Trip sequence ${tripSequence} added:`, trips[trips.length - 1]);

        // Update total work time for driver/conductor
        totalWorkTime += tripDurationMinutes;

        // Add break time: 15 minutes for each 1 hour of trip
        const breakTime = Math.floor(tripDurationMinutes / 60) * 15;

        // Prepare for the next trip
        lastEndPoint = route.endPoint; // Next trip starts at this trip's end point
        startTime = addMinutes(expectedEndTime, breakTime); // Add break before next trip
      }
    });

    if (trips.length > 0) {
      // Insert all trips into the database
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


module.exports = {
  scheduleDailyTrips,
};