const { body } = require('express-validator')

const contactValidationRules = [
	body('name').notEmpty().withMessage('Name is required'),
	body('email').isEmail().withMessage('Email should be valid'),
	body('mobile').notEmpty().withMessage('mobile is required'),
]

module.exports = { contactValidationRules }
