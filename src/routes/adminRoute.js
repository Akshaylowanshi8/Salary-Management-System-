const express = require("express");
const router = express.Router();
const adminController=require('../controllers/adminController')

router.post('/login',adminController.login)
router.get('/dashboard',adminController.dashboard)
router.get('/addMember',adminController.addMember)
router.post('/saveEmployee',adminController.saveEmployee)
router.post('/saveAdmin',adminController.saveAdmin)
router.get('/employees',adminController.employees)
router.get('/admins',adminController.admins)
router.get('/leave',adminController.leave)
router.get('/logout',adminController.logout)
router.get('/salarys',adminController.salarys)
router.get('/attendanceSummary',adminController.attendanceSummary)
router.get('/rejected/:id',adminController.leaveRejected)
router.get('/approved/:id',adminController.leaveApproved)

module.exports = router;