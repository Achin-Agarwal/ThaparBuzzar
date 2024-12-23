import { safeHandler } from "../middleware/safeHandler";
import express from "express";
import sendEmail from "../utils/email";
const router = express.Router();

router.post("/send-email", safeHandler(async (req, res) => {
  const { recipient, subject, message } = req.body;

  if (!recipient || !subject || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const messageId = await sendEmail(recipient, subject, message);
    res.status(200).json({ success: true, messageId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}));

module.exports = router;
