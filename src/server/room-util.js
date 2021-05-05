const self = module.exports;
/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 */
module.exports.close = (rooms, roomUUID) => {
	rooms.delete(roomUUID);
};

/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 * @param {string} userUUID 
 */
module.exports.create = (rooms, roomUUID, userUUID) => {
	if (!rooms.has(roomUUID)) {
		rooms.set(roomUUID, new Set([userUUID]));
		console.log('created new room with ID', roomUUID, 'and added user', userUUID);
	}
};

/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 */
module.exports.status = (rooms, roomUUID) => {
	return rooms.has(roomUUID);
};

/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 * @returns boolean
 */
module.exports.ensure = (rooms, roomUUID, userUUID) => {
	if (rooms.has(roomUUID)) {
		if (!module.exports.hasUser(rooms, roomUUID, userUUID)) {
			module.exports.join(rooms, roomUUID, userUUID)
		}
		return true;
	}

	module.exports.create(rooms, roomUUID, userUUID);
};

/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 * @param {string} userUUID 
 */
module.exports.join = (rooms, roomUUID, userUUID) => {
	console.log('user ' + userUUID + ' is attempting to join ' + roomUUID);
	if (rooms.has(roomUUID) && room.size < 2) {
		console.log('room exists, adding user.')
		rooms.get(roomUUID).add(userUUID);
	}
};

/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 * @param {string} userUUID 
 */
module.exports.leave = (rooms, roomUUID, userUUID) => {
	const room = rooms.get(roomUUID);
	if (room.size === 1) {
		rooms.delete(roomUUID);
	} else {
		room.delete(uuidText);
	}
};

/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 * @param {string} userUUID
 * @returns boolean
 */
module.exports.hasUser = (rooms, roomUUID, userUUID) => {
	try {
		return !!rooms.get(roomUUID).has(userUUID);
	} catch (e) {
		console.error(e);
		return false;
	}
}
