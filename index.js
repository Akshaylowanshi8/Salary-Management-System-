require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT 
const bodyparser = require('body-parser');
const employeeRoute=require('./src/routes/employeeRoute')
const adminRouter=require('./src/routes/adminRoute')
const flash = require('connect-flash');
app.use(express.static("public"));
const session = require('express-session');
// this is a body pata convert data in json 
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
const cron = require('node-cron');
const mail = require('./src/cron/SendEmail')

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(session({ 
  secret:'asadfe', 
  saveUninitialized: true, 
  resave: true
})); 

app.use(flash()); 


cron.schedule('0 0 10 * *', () => {
  console.log('running a task every minute');
  mail()
});

app.set("view engine", "ejs");
app.get("/", (req, res)=> {
res.redirect('/employee/logout')
})

app.use('/employee',employeeRoute)
app.use('/admin',adminRouter)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
