const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		mobile: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, required: true },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('contact', contactSchema)
