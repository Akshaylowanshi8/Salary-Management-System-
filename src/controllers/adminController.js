const { Op } = require('sequelize')
const { Admins, Attendance, Leave, Salary, Employee } = require('../models')
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await Admins.findOne({ where: { email } })
    if (!user) {
      return res.status(401).send('Invalid email or password')
    }
    if (user.password === password) {
      res.redirect('/admin/employees')
    } else {
      res.status(401).send('Invalid email or password')
    }
  } catch (error) {
    console.error('Error during login:', error)
    // res.status(500).send('Internal server error')
  }
}

const dashboard = async (req, res) => {
  res.render('admin/adminDashboard')
}

const addMember = async (req, res) => {
  res.render('admin/addMember', { message: req.flash('info') })
}

const saveEmployee = async (req, res) => {
  try {
    console.log(req.body)
    const newEmployee = await Employee.create(req.body)

    if (newEmployee) {
      res.redirect('/admin/employees')
    }
  } catch (error) {
    console.log(error)
  }
}
const saveAdmin = async (req, res) => {
  try {
    const newadmin = Admins.create(req.body)
    if (newadmin) {
      res.redirect('/admin/employees')
    }
  } catch (error) {
    console.log(error)
  }
}

const employees = async (req, res) => {
  let data = await Employee.findAll()
  // console.log(data)
  res.render('admin/employees', { data: data })
}

const admins = async (req, res) => {
  const admin = await Admins.findAll()
  res.render('admin/admins', { data: admin })
}

const attendanceSummary = async (req, res) => {
  try {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const employees = await Employee.findAll()
    const summaries = await Promise.all(
      employees.map(async employee => {
        const totalDaysInMonth = new Date(year, month, 0).getDate()
        const attendedDays = await Attendance.count({
          where: {
            employeeId: employee.id,
            date: {
              [Op.between]: [
                new Date(year, month - 1, 1),
                new Date(year, month, 0)
              ]
            }
          }
        })

        const attendancePercentage = (attendedDays / totalDaysInMonth) * 100
        const totalsalary =
          (employee.baseSalary / totalDaysInMonth) * attendedDays
        return {
          totalsalary,
          employee,
          totalDaysInMonth,
          attendedDays,
          attendancePercentage: attendancePercentage.toFixed(2)
        }
      })
    )
    // res.send(summaries)
    res.render('admin/attendanceSummary', { summaries })
  } catch (error) {
    console.log('Error' + error)
    res.status(401).json({ status: 401, error })
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

const salarys = async (req, res) => {
  try {
    const salary = await Employee.findAll({
      include: [
        {
          model: Salary,
          as: 'salaries'
        }
      ]
    })
    // console.log(salary)
    // res.send(salary)
    res.render('admin/allSalarys', { employees: salary })
  } catch (error) {
    console.log(error)
  }
}
const leave = async (req, res) => {
  try {
    const data = await Leave.findAll({
      include: [
        {
          model: Employee,
          as: 'Leaves'
        }
      ]
    })

    // res.send(data);
    res.render('admin/leves', { leaveRequests: data })
  } catch (error) {
    console.log(error)
  }
}
const leaveRejected = async (req, res) => {
  try {
    const id = req.params.id
    await Leave.update(
      { leaveStatus: 'Rejected' },
      {
        where: { id: id }
      }
    )
    return res.status(200).redirect('/admin/leave')
  } catch (error) {
    console.log(error)
  }
}
const leaveApproved = async (req, res) => {
  try {
    const id = req.params.id
    await Leave.update(
      { leaveStatus: 'Approved' },
      {
        where: { id: id }
      }
    )
    return res.status(200).redirect('/admin/leave')
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  login,
  dashboard,
  addMember,
  saveEmployee,
  saveAdmin,
  employees,
  admins,
  attendanceSummary,
  logout,
  salarys,
  leave,
  leaveApproved,
  leaveRejected
}
