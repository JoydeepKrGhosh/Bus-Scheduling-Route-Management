import mongoose from 'mongoose';
const User = require('../models/user.model.js');
const Driver = require('../models/driver.model.js')

const createDriverAndUser = async (driverData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Step 1: Create Driver
      const driver = new Driver({
        name: driverData.name,
        driver_id: driverData.driver_id,
        license_number : driverData.license_number,
        phone_number : driverData.phone_number,
        dob: driverData.dob,
        employment_date : driverData.employment_date,
        status : driverData.status
        
      });
      await driver.save({ session });
  
      // Step 2: Create User for the Driver
      const user = new User({
        username: driver.driver_id, // Use driver_id as the username
        password: driver.dob.toISOString().split('T')[0], // DOB as the initial password
        dob: driver.dob,
        role: 'driver',
        driver: driver._id, // Reference to the driver document
      });
      await user.save({ session });
  
      await session.commitTransaction();
      session.endSession();
      
      return { driver, user };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Error creating driver and user: ${error.message}`);
    }
  };
  
  export default createDriverAndUser;