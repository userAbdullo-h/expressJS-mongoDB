const hbsHelper = {
	truncateLine: text => {
		if (text.length >= 100) {
			return text.slice(0, 100) + '...'
		} else {
			return text
		}
	},
	formatDate: date => {
		const d = new Date(date)
		return d.toISOString().split('T')[0]
	},
}

module.exports = hbsHelper
