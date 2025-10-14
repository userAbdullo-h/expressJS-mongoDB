const { validationResult } = require('express-validator')
const contactModel = require('../models/contact.model')

class ContactController {
	renderAddContact(req, res) {
		res.render('add', { title: 'Add contact' })
	}
	async createContact(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const messages = errors.array().map(err => err.msg)
			req.session.message = {
				type: 'danger',
				message: messages.join(' | '),
			}
			return res.redirect('/contact/add')
		}
		try {
			const user = req.session.user
			await contactModel.create({ ...req.body, user: user._id })
			// await User.create({ name, email, mobile })
			req.session.message = {
				type: 'success',
				message: 'Contact was created successfully',
			}
			res.redirect('/')
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

	async editRenderContact(req, res) {
		try {
			const user = await contactModel.findById(req.params.id).lean()
			if (!user) return res.status(404).json('Contact Not Found')
			res.render('edit', { title: 'Edit contact', contact: user })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

	async editContact(req, res) {
		const errors = validationResult(req)
		const id = req.params.id
		if (!errors.isEmpty()) {
			const messages = errors.array().map(err => err.msg)
			console.log(messages)

			req.session.message = {
				type: 'danger',
				message: messages.join(' | '),
			}
			return res.redirect(`/contact/edit/${id}`)
		}

		try {
			await contactModel.findByIdAndUpdate(req.params.id, req.body)
			req.session.message = {
				type: 'success',
				message: 'Contact was edited successfully',
			}
			res.redirect('/')
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

	async deleteContact(req, res) {
		try {
			const deletedContact = await contactModel.findOneAndDelete(req.params.id)
			// const deletedContact = await db
			// 	.collection('users')
			// 	.deleteOne({ _id: new ObjectId(req.params.id) })
			if (deletedContact) {
				req.session.message = {
					type: 'success',
					message: 'Contact was successfully',
				}
				return res.redirect('/')
			}
			res.status(404).json({ message: 'User Not Found' })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}
}

module.exports = new ContactController()
