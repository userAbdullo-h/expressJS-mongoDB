const transporter = require('../helpers/nodemailer')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

class AuthController {
	renderLogin(req, res) {
		if (req.session.user) {
			res.redirect('/')
		}
		res.render('auth/login', { title: 'Login' })
	}

	async login(req, res) {
		const { email, password } = req.body
		const user = await userModel.findOne({ email })
		if (!user) {
			req.session.message = {
				type: 'danger',
				message: 'User not found',
			}
			res.redirect('/auth/login')
		}

		if (!user.isVerified) {
			req.session.message = {
				type: 'danger',
				message: 'Email is not verified',
			}
			res.redirect('/auth/login')
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			req.session.message = {
				type: 'danger',
				message: 'Password is incorrect',
			}
			res.redirect('/auth/login')
		}

		req.session.user = user
		res.redirect('/')
	}

	renderRegister(req, res) {
		if (req.session.user) {
			res.redirect('/')
		}
		res.render('auth/register', { title: 'Register' })
	}

	async register(req, res) {
		const { email, password } = req.body

		const exist = await userModel.findOne({ email })
		if (exist) {
			req.session.message = {
				type: 'danger',
				message: 'User already exist',
			}
			res.redirect('/auth/register')
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const verifyToken = crypto.randomUUID().toString('hex')

		await userModel.create({ email, password: hashedPassword, verifyToken })

		const verifyLink = `${process.env.DOMAIN}/auth/verify/${verifyToken}`
		await transporter.sendMail({
			from: 'UserA',
			to: email,
			subject: 'Email verification! ',
			html: ` 
				<p>Hello ${email}</p>
				<p>Please click the link below for verification:</p>
				<a href='${verifyLink}'>${verifyLink}</a>
			`,
		})

		req.session.message = {
			type: 'success',
			message: 'Verification link was send',
		}
		res.redirect('/auth/login')
	}

	logout(req, res) {
		req.session.destroy(() => {
			res.redirect('/')
		})
	}

	async verifyToken(req, res) {
		const user = await userModel.findOne({
			verifyToken: req.params.verifyToken,
		})
		if (!user) {
			res.send('User not found')
		}

		user.isVerified = true
		user.verifyToken = undefined

		await user.save()
		res.send('Your accaunt successfully verified!')
	}
}

module.exports = new AuthController()
