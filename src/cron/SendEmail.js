const { Op } = require('sequelize')
const { Admins, Attendance, Employee ,Salary} = require('../models')
const nodemailer = require('nodemailer')
const nodemail = async (req, res) => {
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

                // Sending email with nodemailer
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                })

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: employee.email,
                    subject: `Salary Credit Confirmation for ${month}/${year}`,
                    html: `
                <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="background-color: #ffffff; padding: 20px; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                  <div style="text-align: center; margin-bottom: 20px;">
                      <h1 style="color: #333333;">Salary Credit Confirmation ${month}/${year}</h1>
                  </div>
                  <div style="color: #555555;">
                      <p>Dear <strong>${employee.email}</strong>,</p>
                      <p>We are pleased to inform you that your salary for the month of <strong>${month}/${year}</strong> has been successfully credited to your account.</p>
                      <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
                          <p><strong>Employee Name:</strong> ${employee.name}</p>
                          <p><strong>Employee ID:</strong> ${employee.id}</p>
                          <p><strong>Working days:</strong> ${attendedDays}</p>
                          <p><strong>Salary Amount:</strong> ${totalsalary}</p>
                          <p><strong>Date of Credit:</strong>${month}/${year}</p>
                      </div>
                      <p>If you have any questions or need further clarification regarding the salary breakdown, deductions, or any other aspect, please feel free to contact the HR or Payroll department.</p>
                      <p>Thank you for your continued dedication and hard work.</p>
                  </div>
                  <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888888;">
                      <p>Best regards,</p>
                      <p><strong>[Your Name]</strong><br>
                      [Your Job Title] | [Company Name]<br>
                      [Contact Information]</p>
                  </div>
                </div>
                </body>`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error' + error)
                    } else {
                        console.log('Email sent:' + info.response)
                    }
                })

                const dates = `${month}/${year}`
                const storeSalary = await Salary.create({
                    employeeId: employee.id,
                    totalSalaryMade: totalsalary,
                    month: dates,
                    totalWorkingDays: totalDaysInMonth,
                    attendedDays: attendedDays
                })

                return {
                    totalsalary,
                    employee,
                    totalDaysInMonth,
                    attendedDays,
                    attendancePercentage: attendancePercentage.toFixed(2)
                }
            })
        )
    } catch (error) {
        console.log('Error' + error)
        res.json({ status: 401, error })
    }
}

module.exports = nodemail
