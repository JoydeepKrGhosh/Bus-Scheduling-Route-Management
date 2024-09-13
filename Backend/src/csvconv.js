const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const Stop = require('./models/stop');  

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const results = [];

// Function to insert CSV data into MongoDB
const insertCSVData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream('stops.csv')  
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          stopId: data.stopId, 
          name: data.stopName, 
          location: {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
          },
        });
      })
      .on('end', async () => {
        try {
          // Insert data into MongoDB
          await Stop.insertMany(results);
          console.log('Data successfully inserted!');
          resolve();
        } catch (error) {
          console.error('Error inserting data:', error);
          reject(error);
        }
      });
  });
};

// Route to fetch all bus stops
app.get('/bus-stops', async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json(stops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bus stops' });
  }
});

// Start Express server after inserting CSV data
insertCSVData().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch((error) => {
  console.error('Failed to insert CSV data:', error);
});
