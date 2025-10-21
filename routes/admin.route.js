const express = require('express')
const { postValidationRules } = require('../helpers/validator')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const adminController = require('../controllers/admin.controller')

// Add Contact
router.get('/add', adminController.renderAddPost)
router.post('/add', postValidationRules, adminController.createPost)

// Edit Contact
router.get('/edit/:id', authMiddleware, adminController.editRenderPost)
router.post('/edit/:id', postValidationRules, adminController.editPost)

// Delete Contact
router.get('/delete/:id', adminController.deletePost)

module.exports = router
