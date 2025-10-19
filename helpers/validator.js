const { body } = require('express-validator')

const contactValidationRules = [
	body('name').notEmpty().withMessage('Name is required'),
	body('email').isEmail().withMessage('Email should be valid'),
	body('mobile').notEmpty().withMessage('mobile number is required'),
]

const postValidationRules = [
	body('title').notEmpty().withMessage('Title is required'),
	body('description').notEmpty().withMessage('Description is required'),
	body('image').notEmpty().withMessage('Image URL is required'),
]

module.exports = { contactValidationRules, postValidationRules }
