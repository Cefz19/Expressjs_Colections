const { listReservationsService } = require("../services/adminService");

exports.createReservation = async (req, res) => {
  try {
    const reservation = await listReservationsService.createReservation(
      req.body,
    );
    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReservation = async (req, res) => {
  try {
    const reservation = await reservationService.getReservation(req.params.id);
    if (!reservation) {
      return res.status(400).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await reservationService.updateReservation(
      req.params.id,
      req.body,
    );
    if (!reservation) {
      return res.status(400).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const result = await reservationService.deleteReservation(req.params.id);
    if (!result) {
      return res.status(400).json({ error: "Reservation not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
