const express = require("express");
const router = express.Router();
const { requestOTP, verifyOTP, resendOTP, checkOTPStatus } = require("../controllers/otpController");

// Request OTP (kirim ke email)
router.post("/request", requestOTP);

// Verify OTP
router.post("/verify", verifyOTP);

// Resend OTP
router.post("/resend", resendOTP);

// Check OTP status
router.get("/status/:email/:purpose", checkOTPStatus);

module.exports = router;
