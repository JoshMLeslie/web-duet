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
 * @param {string} uuid 
 */
module.exports.create = (rooms, roomUUID, uuid) => {
	if (!rooms.has(roomUUID)) {
		rooms.set(roomUUID, new Set([uuid]));
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
 * @param {string} uuid 
 */
module.exports.join = (rooms, roomUUID, uuid) => {
	if (rooms.has(roomUUID) && room.size === 1) {
		rooms.get(roomUUID).add(uuid);
	}
};

/**
 * @param {Map<string, Set<string>>} rooms
 * @param {string} roomUUID 
 * @param {string} uuid 
 */
module.exports.leave = (rooms, roomUUID, uuid) => {
	const room = rooms.get(roomUUID);
	if (room.size === 1) {
		rooms.delete(roomUUID);
	} else {
		room.delete(uuidText);
	}
};
