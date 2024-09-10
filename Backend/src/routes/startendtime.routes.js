const WorkHistory = require('../models/workhistory.model.js');
const Stop = require('../models/Stop');

// Start Work Timer and Track Location
router.post('/start-work', authMiddleware, async (req, res) => {
  const { routeId } = req.body;
  const { user } = req; // Assuming user is populated by authMiddleware

  try {
    // Start timer by creating a work history record
    const workHistory = new WorkHistory({
      driver_id: user.role === 'driver' ? user._id : null,
      conductor_id: user.role === 'conductor' ? user._id : null,
      route_id: routeId,
      start_time: new Date(),
    });

    const savedWorkHistory = await workHistory.save();

    res.status(200).json({
      message: 'Work started successfully',
      workHistory: savedWorkHistory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error starting work', error });
  }
});

// End Work and Stop Timer
router.post('/end-work', authMiddleware, async (req, res) => {
  const { workHistoryId } = req.body;

  try {
    // Find the work history record
    const workHistory = await WorkHistory.findById(workHistoryId);

    if (!workHistory) {
      return res.status(404).json({ message: 'Work history not found' });
    }

    // Set the end time and calculate the duration
    workHistory.end_time = new Date();
    const duration = (workHistory.end_time - workHistory.start_time) / (1000 * 60); // duration in minutes
    workHistory.work_duration = duration;
    workHistory.completed = true;

    const savedWorkHistory = await workHistory.save();

    res.status(200).json({
      message: 'Work ended successfully',
      workHistory: savedWorkHistory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error ending work', error });
  }
});
