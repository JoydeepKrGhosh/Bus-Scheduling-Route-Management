const fs = require('fs');
const csv = require('csv-parser');
const calculateTravelTime = require('../utils/calculateTravelTime.js');
const calculateDemandCoverage = require('../utils/calculatedemandcoverage.js');
const Route = require('../models/route.model.js'); // Your MongoDB route model

class GeneticAlgorithm {
  constructor(stops, populationSize, generations, mutationRate) {
    this.stops = stops; // Array of stop objects
    this.populationSize = populationSize;
    this.generations = generations;
    this.mutationRate = mutationRate;
    this.population = [];
  }

  initializePopulation(startStop, endStop) {
    for (let i = 0; i < this.populationSize; i++) {
      const randomRoute = this.stops.slice().sort(() => Math.random() - 0.5);
      // Ensure that the start and end stop are at the beginning and end of the route
      const fullRoute = [startStop, ...randomRoute, endStop];
      this.population.push(fullRoute);
    }
  }

  calculateFitness(route) {  
    const { totalTravelTime, totalDistance } = calculateTravelTime(route); // Calculate travel time and distance  
    const demandCoverage = calculateDemandCoverage(route); // Calculate demand coverage  
    return (1 / totalTravelTime) + (0.5 * demandCoverage); // Adjust fitness formula as needed  
  }  

  selectParents() {
    this.population.sort((a, b) => this.calculateFitness(b) - this.calculateFitness(a));
    const elite = this.population.slice(0, Math.floor(this.populationSize / 2));
    return elite;
  }

  crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const child1 = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
    const child2 = [...parent2.slice(0, crossoverPoint), ...parent1.slice(crossoverPoint)];
    return [child1, child2];
  }

  mutate(route) {
    for (let i = 0; i < route.length; i++) {
      if (Math.random() < this.mutationRate) {
        const swapIndex = Math.floor(Math.random() * route.length);
        [route[i], route[swapIndex]] = [route[swapIndex], route[i]];
      }
    }
    return route;
  }
   generateRouteName = (route) => {  
    if (route.length === 0) {  
        return 'Unnamed Route';  
    }  

    const startStop = route[0].name;  
    const endStop = route[route.length - 1].name;  
    const intermediateStops = route.slice(1, -1).map(stop => stop.name).join(', ');  

    if (intermediateStops) {  
        return `Route from ${startStop} to ${endStop} via ${intermediateStops}`;  
    } else {  
        return `Route from ${startStop} to ${endStop}`;  
    }  
};

  evolve(startStop, endStop) {
    this.initializePopulation(startStop, endStop);

    for (let gen = 0; gen < this.generations; gen++) {
      const parents = this.selectParents();
      const newPopulation = [];

      while (newPopulation.length < this.populationSize) {
        const parent1 = parents[Math.floor(Math.random() * parents.length)];
        const parent2 = parents[Math.floor(Math.random() * parents.length)];

        const [child1, child2] = this.crossover(parent1, parent2);
        newPopulation.push(this.mutate(child1));
        newPopulation.push(this.mutate(child2));
      }

      this.population = newPopulation;
      console.log(`Generation ${gen + 1}, Best Route Fitness: ${this.calculateFitness(this.population[0])}`);
    }

    return this.population[0];
  }
}

// Read CSV file and load stops
const loadStops = async (csvFilePath) => {
  const stops = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        stops.push({
          id: row.stop_id,
          name: row.stop_name,
          lat: parseFloat(row.stop_lat),
          lon: parseFloat(row.stop_lon),
        });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(stops);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// Store generated routes in MongoDB
const storeRoute = async (route) => {
  const newRoute = new Route({
    stops: route.map((stop) => ({
      stop_id: stop.id,
      stop_name: stop.name,
      lat: stop.lat,
      lon: stop.lon,
    })),
    totalDistance: totalDistance,  
    totalTravelTime: totalTravelTime,  
    routeName: routeName, 
  });

  await newRoute.save();
  console.log('Route saved to the database');
};

// Example usage
const runGA = async (startStopName, endStopName) => {
  try {
    const stops = await loadStops('stops.csv'); // Path to your CSV file

    // Find start and end stops
    const startStop = stops.find((stop) => stop.name === startStopName);
    const endStop = stops.find((stop) => stop.name === endStopName);

    if (!startStop || !endStop) {
      console.error('Start or end stop not found');
      return;
    }

    // Initialize and evolve using Genetic Algorithm
    const ga = new GeneticAlgorithm(stops, 50, 100, 0.05);
    const optimalRoute = ga.evolve(startStop, endStop);

    // Store the optimal route in the database
    await storeRoute(optimalRoute);

    console.log('Optimal Route:', optimalRoute);
  } catch (error) {
    console.error('Error running the Genetic Algorithm:', error);
  }
};

// Sample frontend input
runGA('Start Stop Name', 'End Stop Name');
