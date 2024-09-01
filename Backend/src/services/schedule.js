// Need to correct the imports
const { pool } = require('../config/db');
const { WorkHistory } = require('../models/mongoModels');

// Service to generate a bus schedule and assign driver and conductor
const generateSchedule = async (routeId, scheduleDate) => {
  try {
    // Get an available bus for the given route and time
    const bus = await getAvailableBus(routeId, scheduleDate);
    if (!bus) {
      throw new Error('No available buses for the given route and time');
    }

    // Get an available driver for the given time
    const driver = await getAvailableDriver(scheduleDate);
    if (!driver) {
      throw new Error('No available drivers for the given time');
    }

    // Get an available conductor for the given time
    const conductor = await getAvailableConductor(scheduleDate);
    if (!conductor) {
      throw new Error('No available conductors for the given time');
    }

    // Assign the driver, conductor, and bus to the route on the specified schedule date
    const schedule = {
      bus_id: bus.bus_id,
      driver_id: driver.driver_id,
      conductor_id: conductor.conductor_id,
      route_id: routeId,
      schedule_date: scheduleDate,
    };

    // Save the schedule to PostgreSQL
    const result = await pool.query(
      `INSERT INTO bus_schedules (bus_id, driver_id, conductor_id, route_id, schedule_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [schedule.bus_id, schedule.driver_id, schedule.conductor_id, schedule.route_id, schedule.schedule_date]
    );

    // Log work history for both driver and conductor in MongoDB
    const workHistoryEntry = new WorkHistory({
      driver_id: schedule.driver_id,
      conductor_id: schedule.conductor_id,
      route_id: schedule.route_id,
      assignment_date: schedule.schedule_date,
      work_duration_hours: calculateWorkDuration(routeId), // This function can calculate based on route distance
    });
    await workHistoryEntry.save();

    return result.rows[0]; // Return the newly created schedule
  } catch (error) {
    throw new Error(`Error generating schedule: ${error.message}`);
  }
};

// Helper function to get an available bus
const getAvailableBus = async (routeId, scheduleDate) => {
  try {
    const result = await pool.query(
      `SELECT * FROM buses WHERE bus_id NOT IN (
         SELECT bus_id FROM bus_schedules WHERE schedule_date = $1
       ) AND route_id = $2 LIMIT 1`,
      [scheduleDate, routeId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error fetching available bus');
  }
};

// Helper function to get an available driver
const getAvailableDriver = async (scheduleDate) => {
  try {
    const result = await pool.query(
      `SELECT * FROM drivers WHERE driver_id NOT IN (
         SELECT driver_id FROM bus_schedules WHERE schedule_date = $1
       ) LIMIT 1`,
      [scheduleDate]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error fetching available driver');
  }
};

// Helper function to get an available conductor
const getAvailableConductor = async (scheduleDate) => {
  try {
    const result = await pool.query(
      `SELECT * FROM conductors WHERE conductor_id NOT IN (
         SELECT conductor_id FROM bus_schedules WHERE schedule_date = $1
       ) LIMIT 1`,
      [scheduleDate]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error fetching available conductor');
  }
};

// Helper function to calculate work duration for the route
const calculateWorkDuration = (routeId) => {
  // Assuming work duration is calculated based on route distance or pre-defined data
  // Placeholder logic:
  return 8; // 8 hours work duration as a placeholder
};

module.exports = { generateSchedule };
