import mongoose from 'mongoose';
const User = require('../models/user.model.js');
const Conductor = require('../models/conductor.model.js')

const createConductorAndUser = async (conductorData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Step 1: Create Conductor
      const conductor = new Conductor({
        name: conductorData.name,
        conductor_id: conductorData.conductor_id,
        phone_number : conductorData.phone_number,
        dob: conductorData.dob,
        employment_date : conductorData.employment_date,
        status : conductorData.status
        
      });
      await driver.save({ session });
  
      // Step 2: Create User for the conductor
      const user = new User({
        username: conductor.conductor_id, // Use driver_id as the username
        password: conductor.dob.toISOString().split('T')[0], // DOB as the initial password
        dob: conductor.dob,
        role: 'conductor',
        conductor: conductor.conductor_id, // Reference to the conductor document
      });
      await user.save({ session });
  
      await session.commitTransaction();
      session.endSession();
      
      return { conductor, user };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Error creating driver and user: ${error.message}`);
    }
  };
  
  export default createConductorAndUser;