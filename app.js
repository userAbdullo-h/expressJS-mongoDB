require('dotenv').config()

//Libraries
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const session = require('express-session')
const moongoose = require('mongoose')
const userModel = require('./models/user.model')

const PORT = process.env.PORT

//View Engine config
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: true,
	})
)
app.use((req, res, next) => {
	res.locals.message = req.session.message
	delete req.session.message
	next()
})

//Routes

app.get('/', async (req, res) => {
	try {
		const contacts = await userModel.find().lean()
		console.log(contacts)

		// const users = await User.findAll({ raw: true, include: Post })
		res.render('home', {
			title: 'Main page',
			contacts,
			views: req.session.views,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.use('/contact', require('./routes/contact.route'))

async function startApp(params) {
	try {
		moongoose.connect(process.env.MONGO_URI)
		console.log('DB connected')

		app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
	} catch (error) {
		console.log(`Error: ${error}`)
	}
}

startApp()
