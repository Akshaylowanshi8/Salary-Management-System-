const express = require("express");
const router = express.Router();

const employeeController= require('../controllers/employeeController')


router.post('/login',employeeController.login)
router.post("/submitHours",employeeController.submitHours);
router.post('/leave',employeeController.leave)
router.get('/applayLeave',employeeController.opneLeavePage)
router.get('/leaveSummary',employeeController.leaveSummary)
router.get('/dashboard',employeeController.dashboard)
router.get('/loghours',employeeController.loghours)
router.get('/logout',employeeController.logout)
router.get('/attendanceSummary',employeeController.attendanceSummary)

module.exports = router;