const { validationResult } = require('express-validator')
const contactModel = require('../models/contact.model')
const postModel = require('../models/post.model')

class AdminController {
	renderAddPost(req, res) {
		res.render('post/add-post', { title: 'Add post' })
	}
	async createPost(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const messages = errors.array().map(err => err.msg)
			req.session.message = { type: 'danger', message: messages.join(' | ') }
			return res.redirect('/post/add')
		}
		try {
			await postModel.create({ ...req.body })
			req.session.message = { type: 'success', message: 'Post was created successfully' }
			res.redirect('/')
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

	async editRenderPost(req, res) {
		try {
			const post = await postModel.findById(req.params.id).lean()
			if (!post) return res.status(404).json('Post Not Found')
			res.render('post/edit', { title: 'Edit post', post })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

	async editPost(req, res) {
		const errors = validationResult(req)
		const id = req.params.id
		if (!errors.isEmpty()) {
			const messages = errors.array().map(err => err.msg)
			console.log(messages)

			req.session.message = { type: 'danger', message: messages.join(' | ') }
			return res.redirect(`/contact/edit/${id}`)
		}

		try {
			await contactModel.findByIdAndUpdate(req.params.id, req.body)
			req.session.message = { type: 'success', message: 'Contact was edited successfully' }
			res.redirect('/')
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}

	async deletePost(req, res) {
		try {
			const deletedContact = await contactModel.findOneAndDelete(req.params.id)
			// const deletedContact = await db
			// 	.collection('users')
			// 	.deleteOne({ _id: new ObjectId(req.params.id) })
			if (deletedContact) {
				req.session.message = { type: 'success', message: 'Contact was successfully' }
				return res.redirect('/')
			}
			res.status(404).json({ message: 'User Not Found' })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}
}

module.exports = new AdminController()
