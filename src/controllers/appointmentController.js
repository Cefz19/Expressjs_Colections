const appointmentService = require("../services/appointmentService");

exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.id;
    const appointmets = appointmentsService.getUserAppointments(userId);
    res.json(appointmets);
  } catch (error) {
    res.json(500).json({ error: "Error fetching the appointment history" });
  }
};
