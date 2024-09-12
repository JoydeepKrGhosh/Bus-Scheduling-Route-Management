const calculateDemandCoverage = (route) => {
    let totalDemand = 0;
    route.forEach((stop) => {
      totalDemand += 1; // Assuming each stop has equal demand of 1
    });
    return totalDemand;
  };
export default calculateDemandCoverage;  