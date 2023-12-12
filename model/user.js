const mongoose = require('mongoose');

//membuat schema
const User = mongoose.model('user', {
	username: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	password: {
    type: String,
    require: true,
	},
	tinggibadan: {
    type: String,
    require: true,
	},
	beratbadan: {
    type: String,
    require: true,
	},
	umur: {
    type: String,
    require: true,
	},
});

module.exports = User;
