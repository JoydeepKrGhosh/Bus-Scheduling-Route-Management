const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const toRadians = (degree) => (degree * Math.PI) / 180;
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in kilometers
  };
  
  const calculateTravelTime = (route) => {  
    let totalTime = 0;  
    let totalDistance = 0; // Variable to accumulate total distance  

    for (let i = 0; i < route.length - 1; i++) {  
      const stopA = route[i];  
      const stopB = route[i + 1];  
      const distance = haversineDistance(stopA.lat, stopA.lon, stopB.lat, stopB.lon);  
      
      const avgBusSpeed = 40; // Assuming average bus speed in km/h  
      totalTime += distance / avgBusSpeed;  
      
      // Accumulate total distance  
      totalDistance += distance;  
    }  

    return { totalTravelTime: totalTime, totalDistance: totalDistance }; // Return both values as an object  
};  

export default calculateTravelTime;
 