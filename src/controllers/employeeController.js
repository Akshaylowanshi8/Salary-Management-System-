var jwt = require('jsonwebtoken')
const { Admins, Leave, Attendance, Employee } = require('../models')
const { Op, where } = require('sequelize')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    // console.log(req.body)
    const employee = await Employee.findOne({
      where: { email: email }
    })
    if (!employee) {
      res.send('Invalid user name.')
    }
    if (employee.password === password) {
      let token = jwt.sign(
        { id: employee.id, email: employee.email },
        process.env.SECRET,
        { expiresIn: '365d' }
      )
      //   console.log('token', token)
      await Employee.update({ token: token }, { where: { id: employee.id } })
      res.cookie('Emptoken', token, { maxAge: 1000 * 60 * 60 * 24 * 365 })
      return res.redirect('/employee/attendanceSummary')
    } else {
      res.send('Invalid password.')
    }
  } catch (err) {
    console.log(err)
  }
}
const logout = async (req, res, next) => {
  try {
    res.clearCookie('Emptoken')
    req.success = 'Successfully Logout'
    res.render('login')
  } catch (err) {
    next(err)
  }
}
const dashboard = async (req, res) => {
  res.render('employee/dashboard')
}
const loghours = async (req, res) => {
  res.render('employee/logHours')
}
const submitHours = async (req, res) => {
  try {
    const token = req.cookies.Emptoken
    const decoded = jwt.decode(token)
    // console.log(decoded)
    const employeeId = decoded.id
    const { date, hoursWorked } = req.body
    // console.log(req.body)
    const data = await Attendance.findOne({
      where: { date: date, employeeId: employeeId }
    })
    if (data) {
      return res.send('alrady submit working hours')
    }
    await Attendance.create({ employeeId, date, hoursWorked })
    return res.redirect('/employee/attendanceSummary')
  } catch (error) {
    console.log(error)
  }
}
const attendanceSummary = async (req, res) => {
  try {
    const token = req.cookies.Emptoken
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }
    const decoded = jwt.decode(token)
    const employeeId = decoded.id
    const employee = await Employee.findOne({
      where: { id: employeeId }
    })
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const totalDaysInMonth = new Date(year, month, 0).getDate()
    const attendedDays = await Attendance.count({
      where: {
        employeeId: employee.id,
        date: {
          [Op.between]: [new Date(year, month - 1, 1), new Date(year, month, 0)]
        }
      }
    })
    const attendancePercentage = (attendedDays / totalDaysInMonth) * 100
    const totalSalary = (employee.baseSalary / totalDaysInMonth) * attendedDays
    const summary = {
      totalSalary,
      employee,
      totalDaysInMonth,
      attendedDays,
      attendancePercentage: attendancePercentage.toFixed(2)
    }
    res.render('employee/attendance', { summary })
  } catch (error) {
    console.error('Error fetching attendance summary:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching attendance summary' })
  }
}
const leave = async (req, res) => {
  try {
    const token = req.cookies.Emptoken
    const decoded = jwt.decode(token)
    const employeeId = decoded.id
    if (!employeeId) {
      return res.status(404).json({ error: 'Employee not found' })
    } else {
      const leave = await Leave.create({ ...req.body, employeeId: employeeId })
      res.redirect('/employee/leaveSummary')
    }
  } catch (error) {
    console.log(error)
  }
}
const leaveSummary = async (req, res) => {
  try {
    const token = req.cookies.Emptoken
    const decoded = jwt.decode(token)
    const employeeId = decoded.id
    const data = await Leave.findAll({
      where: { id: employeeId }
    })
    // res.send(data);
    res.render('employee/leaveSummary', { leaves: data })
  } catch (error) {
    console.log(error)
  }
}

const opneLeavePage = async (req, res) => {
  res.render('employee/applyLeave')
}

module.exports = {
  submitHours,
  login,
  logout,
  dashboard,
  loghours,
  attendanceSummary,
  leave,
  leaveSummary,
  opneLeavePage
}
