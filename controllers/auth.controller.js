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
		res.redirect('/auth/login-back')
	}

	loginBack(req, res) {
		const user = req.session.user.email

		req.session.message = {
			type: 'success',
			message: `Welcome back ${user}`,
		}
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
				<body style="display: flex; justify-content: center; align-items: center;font-family: Helvetica,Arial,sans-serif;">

			<div style="width: 500px; height: 500px;">
				<h2 style="letter-spacing: 1px;"">E-commerce</h2>
				<hr>

				<h1 style="letter-spacing: 1px;line-height: 40px;">Verification link</h1>

				<p style="font-size: 23px; letter-spacing: 0.5px; margin-bottom: 30px">Hello ${email}</p>
		

				<p style="font-size: 17px; letter-spacing: 0.5px;">Please click the link below for verification:</p>

					<a style="font-size: 17px; letter-spacing: 0.5px;text-decoration: none;margin-top:20px;margin-bottom:20px;
					" href="${verifyLink}">Verify</a>
				<p style="font-size: 17px; letter-spacing: 0.5px;">If you didn't request this, please ignore this email for now.</p>
			</div>
	</body>
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
			res.redirect('/auth/logged-out')
		})
	}
	loggedOut(req, res) {
		req.session.message = {
			type: 'success',
			message: 'Logged out successfully',
		}
		res.redirect('/auth/login')
	}

	async verifyToken(req, res) {
		const user = await userModel.findOne({
			verifyToken: req.params.verifyToken,
		})
		if (!user) {
			return res.render('auth/verify', {
				success: false,
				message: 'Invalid or expired link. Please try again',
			})
		}

		user.isVerified = true
		user.verifyToken = undefined

		await user.save()
		return res.render('auth/verify', {
			success: true,
			message:
				'Your account has been successfully verified. Now you can login!',
		})
	}
}

module.exports = new AuthController()
