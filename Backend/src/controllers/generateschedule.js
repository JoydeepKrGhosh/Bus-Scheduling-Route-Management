const { generateSchedule } = require('../services/schedule.js');


exports.createSchedule = async (req, res) => {
  const { routeId, scheduleDate } = req.body;
  try {
    const newSchedule = await generateSchedule(routeId, scheduleDate);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
