const fs = require('fs')
const path = require('path')

const CONTACT_FILE = path.join(__dirname, '..', 'data', 'contacts.json')

function getContacts() {
	if (!fs.existsSync(CONTACT_FILE)) return []
	const data = fs.readFileSync(CONTACT_FILE, 'utf-8')
	return JSON.parse(data || '[]')
}

function saveContacts(contacts) {
	fs.writeFileSync(CONTACT_FILE, JSON.stringify(contacts, null, 2))
}

module.exports = { CONTACT_FILE, getContacts, saveContacts }
