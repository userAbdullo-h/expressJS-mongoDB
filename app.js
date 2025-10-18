require('dotenv').config()

//Libraries
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const session = require('express-session')
const moongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const contactModel = require('./models/contact.model')
const authMiddleware = require('./middlewares/auth.middleware')

const PORT = process.env.PORT

//View Engine config
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 90000 },
	})
)
app.use((req, res, next) => {
	res.locals.message = req.session.message
	res.locals.user = req.session.user
	delete req.session.message
	next()
})

//Routes
app.get('/', authMiddleware, async (req, res) => {
	try {
		const user = req.session.user
		const contacts = await contactModel.find({ user: user._id }).lean()
		// console.log(req.session)

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
app.use('/auth', require('./routes/auth.route'))

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
