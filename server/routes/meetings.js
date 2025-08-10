const express = require('express');
const router = express.Router();

// Import models
const MeetingSlot = require('../models/MeetingSlot');
const Application = require('../models/Application');
const User = require('../models/User');
const Candidate = require('../models/Candidate');

// Import middleware
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// @route   POST /api/meetings/slots
// @desc    Create meeting slots for a recruiter
// @access  Private (Recruiter)
router.post('/slots', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { slots } = req.body;
    const recruiterId = req.user.id;

    const createdSlots = [];

    for (const slotData of slots) {
      const { title, description, startTime, endTime, type = 'technical_interview' } = slotData;

      const slot = new MeetingSlot({
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60)),
        type,
        recruiterId
      });

      await slot.save();
      createdSlots.push(slot);
    }

    res.status(201).json({
      message: `${createdSlots.length} meeting slots created successfully`,
      slots: createdSlots
    });
  } catch (error) {
    console.error('Create meeting slots error:', error);
    res.status(500).json({ error: 'Failed to create meeting slots' });
  }
});

// @route   GET /api/meetings/slots/available
// @desc    Get available meeting slots for a recruiter
// @access  Private (Recruiter)
router.get('/slots/available', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const recruiterId = req.user.id;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const slots = await MeetingSlot.findAvailable(recruiterId, start, end);

    res.json(slots);
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// @route   GET /api/meetings/slots/my-slots
// @desc    Get user's booked meeting slots
// @access  Private (Candidate)
router.get('/slots/my-slots', auth, checkRole(['candidate']), async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ email: req.user.email });
    if (!candidate) {
      return res.json([]);
    }

    const slots = await MeetingSlot.findByCandidate(candidate._id)
      .populate('recruiterId', 'name email')
      .populate('applicationId', 'jobId')
      .populate('applicationId.jobId', 'title company');

    res.json(slots);
  } catch (error) {
    console.error('Get my slots error:', error);
    res.status(500).json({ error: 'Failed to fetch your meeting slots' });
  }
});

// @route   GET /api/meetings/slots/upcoming
// @desc    Get upcoming meetings for a recruiter
// @access  Private (Recruiter)
router.get('/slots/upcoming', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const recruiterId = req.user.id;

    const meetings = await MeetingSlot.findUpcomingForRecruiter(recruiterId, parseInt(limit));

    res.json(meetings);
  } catch (error) {
    console.error('Get upcoming meetings error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming meetings' });
  }
});

// @route   POST /api/meetings/schedule
// @desc    Schedule a meeting for an application
// @access  Private (Recruiter)
router.post('/schedule', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { applicationId, slotId, notes } = req.body;
    const recruiterId = req.user.id;

    // Check if application exists
    const application = await Application.findById(applicationId)
      .populate('candidateId')
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if slot exists and is available
    const slot = await MeetingSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Meeting slot not found' });
    }

    if (slot.status !== 'available') {
      return res.status(400).json({ error: 'Meeting slot is not available' });
    }

    if (slot.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ error: 'You can only schedule meetings in your own slots' });
    }

    // Book the slot
    await slot.book(application.candidateId._id, applicationId, recruiterId);

    // Update application status
    await application.scheduleInterview(slotId, recruiterId, notes);

    res.json({
      message: 'Meeting scheduled successfully',
      meeting: {
        id: slot._id,
        title: slot.title,
        startTime: slot.startTime,
        endTime: slot.endTime,
        candidate: application.candidateId.name,
        job: application.jobId.title
      }
    });
  } catch (error) {
    console.error('Schedule meeting error:', error);
    res.status(500).json({ error: 'Failed to schedule meeting' });
  }
});

// @route   PUT /api/meetings/slots/:slotId/cancel
// @desc    Cancel a meeting slot
// @access  Private (Recruiter)
router.put('/slots/:slotId/cancel', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { slotId } = req.params;
    const recruiterId = req.user.id;

    const slot = await MeetingSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Meeting slot not found' });
    }

    if (slot.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ error: 'You can only cancel your own meeting slots' });
    }

    if (slot.status === 'booked') {
      // Update application status if there's an associated application
      if (slot.applicationId) {
        const application = await Application.findById(slot.applicationId);
        if (application) {
          await application.updateStatus('challenge_completed', 'Interview Cancelled', recruiterId, 'Meeting cancelled by recruiter');
        }
      }
    }

    await slot.cancel();

    res.json({
      message: 'Meeting slot cancelled successfully',
      slot: {
        id: slot._id,
        status: slot.status
      }
    });
  } catch (error) {
    console.error('Cancel meeting slot error:', error);
    res.status(500).json({ error: 'Failed to cancel meeting slot' });
  }
});

// @route   PUT /api/meetings/slots/:slotId/complete
// @desc    Mark a meeting as completed
// @access  Private (Recruiter)
router.put('/slots/:slotId/complete', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { slotId } = req.params;
    const { feedback } = req.body;
    const recruiterId = req.user.id;

    const slot = await MeetingSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Meeting slot not found' });
    }

    if (slot.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ error: 'You can only complete your own meetings' });
    }

    if (slot.status !== 'booked') {
      return res.status(400).json({ error: 'Meeting is not in booked status' });
    }

    await slot.complete(feedback);

    // Update application status if there's an associated application
    if (slot.applicationId) {
      const application = await Application.findById(slot.applicationId);
      if (application) {
        const newStatus = feedback && feedback.toLowerCase().includes('hire') ? 'hired' : 'reviewing';
        await application.updateStatus(newStatus, 'Interview Completed', recruiterId, feedback);
      }
    }

    res.json({
      message: 'Meeting marked as completed',
      slot: {
        id: slot._id,
        status: slot.status,
        feedback: slot.feedback
      }
    });
  } catch (error) {
    console.error('Complete meeting error:', error);
    res.status(500).json({ error: 'Failed to complete meeting' });
  }
});

// @route   PUT /api/meetings/slots/:slotId/reschedule
// @desc    Reschedule a meeting
// @access  Private (Recruiter)
router.put('/slots/:slotId/reschedule', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { slotId } = req.params;
    const { newStartTime, newEndTime } = req.body;
    const recruiterId = req.user.id;

    const slot = await MeetingSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Meeting slot not found' });
    }

    if (slot.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ error: 'You can only reschedule your own meetings' });
    }

    if (slot.status !== 'booked') {
      return res.status(400).json({ error: 'Only booked meetings can be rescheduled' });
    }

    await slot.reschedule(new Date(newStartTime), new Date(newEndTime));

    res.json({
      message: 'Meeting rescheduled successfully',
      slot: {
        id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status
      }
    });
  } catch (error) {
    console.error('Reschedule meeting error:', error);
    res.status(500).json({ error: 'Failed to reschedule meeting' });
  }
});

// @route   GET /api/meetings/slots/:slotId
// @desc    Get specific meeting slot details
// @access  Private
router.get('/slots/:slotId', auth, async (req, res) => {
  try {
    const { slotId } = req.params;

    const slot = await MeetingSlot.findById(slotId)
      .populate('recruiterId', 'name email')
      .populate('candidateId', 'name email')
      .populate('applicationId', 'jobId')
      .populate('applicationId.jobId', 'title company');

    if (!slot) {
      return res.status(404).json({ error: 'Meeting slot not found' });
    }

    // Check permissions
    if (req.user.role === 'candidate') {
      const candidate = await Candidate.findOne({ email: req.user.email });
      if (!candidate || slot.candidateId?.toString() !== candidate._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (req.user.role === 'recruiter') {
      if (slot.recruiterId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(slot);
  } catch (error) {
    console.error('Get meeting slot error:', error);
    res.status(500).json({ error: 'Failed to fetch meeting slot' });
  }
});

// @route   GET /api/meetings/stats
// @desc    Get meeting statistics for a recruiter
// @access  Private (Recruiter)
router.get('/stats', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const totalSlots = await MeetingSlot.countDocuments({ recruiterId });
    const bookedSlots = await MeetingSlot.countDocuments({ recruiterId, status: 'booked' });
    const completedMeetings = await MeetingSlot.countDocuments({ recruiterId, status: 'completed' });
    const cancelledMeetings = await MeetingSlot.countDocuments({ recruiterId, status: 'cancelled' });

    const upcomingMeetings = await MeetingSlot.countDocuments({
      recruiterId,
      status: 'booked',
      startTime: { $gte: new Date() }
    });

    res.json({
      totalSlots,
      bookedSlots,
      completedMeetings,
      cancelledMeetings,
      upcomingMeetings,
      bookingRate: totalSlots > 0 ? (bookedSlots / totalSlots * 100).toFixed(1) : 0,
      completionRate: bookedSlots > 0 ? (completedMeetings / bookedSlots * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Get meeting stats error:', error);
    res.status(500).json({ error: 'Failed to fetch meeting statistics' });
  }
});

module.exports = router;
