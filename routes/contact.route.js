const express = require('express')
const { contactValidationRules } = require('../helpers/validator')
const contactController = require('../controllers/contact.controller')
const router = express.Router()
const postModel = require('../models/post.schema')
const userModel = require('../models/user.model')

// Add Contact
router.get('/add', contactController.renderAddContact)
router.post('/add', contactValidationRules, contactController.createContact)

// Edit Contact
router.get('/edit/:id', contactController.editRenderContact)
router.post('/edit/:id', contactValidationRules, contactController.editContact)

// Delete Contact
router.get('/delete/:id', contactController.deleteContact)

router.post('/create-post', async (req, res) => {
	const { content, userId } = req.body
	const createdPost = await postModel.create({ content, user: userId })
	await userModel.findByIdAndUpdate(userId, {
		$push: { posts: createdPost._id },
	})
	res.status(201).json(createdPost)
})

router.get('/posts', async (req, res) => {
	const posts = await postModel.find().select('_id content user').populate({
		path: 'user',
		select: '_id name email',
	})
	res.json(posts)
})

router.get('/users', async (req, res) => {
	const posts = await userModel.find().select('name email posts').populate({
		path: 'posts',
		select: 'content',
	})
	res.json(posts)
})

module.exports = router
