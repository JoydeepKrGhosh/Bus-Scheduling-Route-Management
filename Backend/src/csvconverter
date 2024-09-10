const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Stop = require('./models/stop'); // Your Stop model

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const results = [];

fs.createReadStream('stops.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Assuming CSV columns are 'stopId', 'name', 'latitude', 'longitude'
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
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      mongoose.connection.close();
    }
  });
