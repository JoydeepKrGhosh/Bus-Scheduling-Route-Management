
const Bus = require('../models/bus.model.js');
const Driver = require('../models/driver.model.js')
const Conductor = require('../models/conductor.model.js')
const Route = require('../models/route.model.js')
const WorkHistory = require('../models/workhistory.model.js');
const BusSchedule = require('../models/schedule.model.js');

// Service to generate a bus schedule and assign driver and conductor

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
    const schedule = new BusSchedule({
      bus_id: bus._id,
      driver_id: driver._id,
      conductor_id: conductor._id,
      route_id: routeId,
      schedule_date: scheduleDate,
    });

    // Save the schedule to MongoDB
    const savedSchedule = await schedule.save();

    // Log work history for both driver and conductor in MongoDB
    const workHistoryEntry = new WorkHistory({
      driver_id: schedule.driver_id,
      conductor_id: schedule.conductor_id,
      route_id: schedule.route_id,
      assignment_date: schedule.schedule_date,
      work_duration_hours: await calculateWorkDuration(routeId),
    });
    await workHistoryEntry.save();

    return savedSchedule; // Return the newly created schedule
  } catch (error) {
    throw new Error(`Error generating schedule: ${error.message}`);
  }
};

// Helper function to get an available bus
const getAvailableBus = async (routeId, scheduleDate) => {
  try {
    const assignedBuses = await getAssignedBuses(scheduleDate);
    const bus = await Bus.findOne({
      route_id: routeId,
      _id: { $nin: assignedBuses }
    }).exec();
    return bus;
  } catch (error) {
    throw new Error('Error fetching available bus');
  }
};

// Helper function to get an available driver
const getAvailableDriver = async (scheduleDate) => {
  try {
    const assignedDrivers = await getAssignedDrivers(scheduleDate);
    const driver = await Driver.findOne({
      _id: { $nin: assignedDrivers }
    }).exec();
    return driver;
  } catch (error) {
    throw new Error('Error fetching available driver');
  }
};

// Helper function to get an available conductor
const getAvailableConductor = async (scheduleDate) => {
  try {
    const assignedConductors = await getAssignedConductors(scheduleDate);
    const conductor = await Conductor.findOne({
      _id: { $nin: assignedConductors }
    }).exec();
    return conductor;
  } catch (error) {
    throw new Error('Error fetching available conductor');
  }
};

// Helper function to get assigned buses for a specific schedule date
const getAssignedBuses = async (scheduleDate) => {
  const schedules = await BusSchedule.find({ schedule_date: scheduleDate }).select('bus_id').exec();
  return schedules.map(schedule => schedule.bus_id);
};

// Helper function to get assigned drivers for a specific schedule date
const getAssignedDrivers = async (scheduleDate) => {
  const schedules = await BusSchedule.find({ schedule_date: scheduleDate }).select('driver_id').exec();
  return schedules.map(schedule => schedule.driver_id);
};

// Helper function to get assigned conductors for a specific schedule date
const getAssignedConductors = async (scheduleDate) => {
  const schedules = await BusSchedule.find({ schedule_date: scheduleDate }).select('conductor_id').exec();
  return schedules.map(schedule => schedule.conductor_id);
};

// Helper function to calculate work duration for the route
const calculateWorkDuration = async (routeId) => {
  try {
    const route = await Route.findById(routeId).exec();
    // Assuming work duration is calculated based on route distance or pre-defined data
    // Placeholder logic:
    return route.estimated_duration_minutes / 60; // Converts minutes to hours
  } catch (error) {
    throw new Error('Error calculating work duration');
  }
};

module.exports = { generateSchedule };
