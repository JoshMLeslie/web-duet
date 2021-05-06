const UUID = require('uuid');

// don't export directly so that it can be self-referenced
const UserUtil = {
	getId: (users, userUUID) => {
		userUUID = userUUID || UUID.v4();
		users.set(userUUID, new Date().toISOString());
		console.log('added new user:', userUUID);
		return userUUID;
	},
	logout: (users, userUUID) => {
		users.delete(userUUID);
		console.log('logged out user:', userUUID);
		return true;
	}
}

exports.UserUtil = UserUtil;