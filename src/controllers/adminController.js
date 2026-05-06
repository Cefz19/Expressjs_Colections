const {
  createTimeBlockService,
  listReservationService,
} = require("../services/adminService");

const createTimeBlock = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }

  const { startTime, endTime } = req.body;

  try {
    const newTimeBlock = await createTimeBlockService(startTime, endTime);
    res.status(201).json(newTimeBlock);
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(500).json({ error: "Error creating time block" });
  }
};

const listReservations = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const reservations = await listReservationService();
    res.json(reservations);
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(500).json({ error: "Error fetching reservation" });
  }
};

module.exports = { createTimeBlock, listReservations };
