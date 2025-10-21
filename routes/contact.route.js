const express = require('express')
const { contactValidationRules } = require('../helpers/validator')
const contactController = require('../controllers/contact.controller')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, contactController.renderContact)

// Add Contact
router.get('/add', contactController.renderAddContact)
router.post('/add', contactValidationRules, contactController.createContact)

// Edit Contact
router.get('/edit/:id', authMiddleware, contactController.editRenderContact)
router.post('/edit/:id', contactValidationRules, contactController.editContact)

// Delete Contact
router.get('/delete/:id', contactController.deleteContact)

module.exports = router
