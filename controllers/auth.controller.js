const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')

class AuthController {
	renderLogin(req, res) {
		if (req.session.user) {
			res.redirect('/')
		}
		res.render('auth/login', { title: 'Login' })
	}

	async login(req, res) {
		const { username, password } = req.body
		const user = await userModel.findOne({ username })
		if (!user) {
			req.session.message = {
				type: 'danger',
				message: 'User not found',
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
		const { username, password } = req.body

		const exist = await userModel.findOne({ username })
		if (exist) {
			req.session.message = {
				type: 'danger',
				message: 'Username already exist',
			}
			res.redirect('/auth/register')
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		await userModel.create({ username, password: hashedPassword })
		res.redirect('/auth/login')
	}

	logout(req, res) {
		req.session.destroy(() => {
			res.redirect('/')
		})
	}
}

module.exports = new AuthController()
