const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'abdullokhan3@gmail.com',
		pass: process.env.EMAIL_PASSWORD,
	},
})

module.exports = transporter
