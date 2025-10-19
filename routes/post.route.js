const express = require('express')
const { postValidationRules } = require('../helpers/validator')
const contactController = require('../controllers/contact.controller')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const postController = require('../controllers/post.controller')

// Add Contact
router.get('/add', postController.renderAddPost)
router.post('/add', postValidationRules, postController.createPost)

// Edit Contact
router.get('/edit/:id', authMiddleware, postController.editRenderPost)
router.post('/edit/:id', postValidationRules, postController.editPost)

// Delete Contact
router.get('/delete/:id', postController.deletePost)

module.exports = router
