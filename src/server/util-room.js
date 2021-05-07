// don't export directly so that it can be self-referenced
const RoomUtil = {
	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 */
	close: (rooms, roomUUID) => {
		rooms.delete(roomUUID);
	},

	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 * @param {string} userUUID
	 */
	create: (rooms, roomUUID, userUUID) => {
		if (!!roomUUID && !rooms.has(roomUUID)) {
			rooms.set(roomUUID, new Set([userUUID]));
			console.log(
				'created new room with ID',
				roomUUID,
				'and added user',
				userUUID
			);
			return true;
		}
		return false;
	},

	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 */
	status: (rooms, roomUUID) => {
		return rooms.has(roomUUID);
	},

	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 * @returns boolean
	 */
	ensure: (rooms, roomUUID, userUUID) => {
		if (rooms.has(roomUUID)) {
			if (!RoomUtil.hasUser(rooms, roomUUID, userUUID)) {
				RoomUtil.join(rooms, roomUUID, userUUID);
			}
			return true;
		}

		return RoomUtil.create(rooms, roomUUID, userUUID);
	},

	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 * @param {string} userUUID
	 */
	join: (rooms, roomUUID, userUUID) => {
		console.log('user ' + userUUID + ' is attempting to join ' + roomUUID);
		if (rooms.has(roomUUID) && rooms.get(roomUUID).size < 2) {
			console.log('room exists, adding user.');
			rooms.get(roomUUID).add(userUUID);
		}
	},

	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 * @param {string} userUUID
	 */
	leave: (rooms, roomUUID, userUUID) => {
		const room = rooms.get(roomUUID);
		if (!room) {
			console.error('tried to leave non-existent room:', roomUUID)
			return false;
		}

		if (room.size === 1) {
			rooms.delete(roomUUID);
			console.log('User:', userUUID, 'turned off the lights for:', roomUUID);
		} else {
			room.delete(userUUID);
			console.log('user:', userUUID, 'has left room:', roomUUID);
		}
		return true;
	},

	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 * @param {string} userUUID
	 * @returns boolean
	 */
	hasUser: (rooms, roomUUID, userUUID) => {
		try {
			return !!rooms.get(roomUUID).has(userUUID);
		} catch (e) {
			console.error(e);
			return false;
		}
	},

	/**
	 * @param {Map<string, Set<string>>} rooms
	 * @param {string} roomUUID
	 * @param {string} userUUID
	 * @returns {string[]} users
	 */
	getUsers: (rooms, roomUUID, userUUID) => {
		try {
			const room = rooms.get(roomUUID);
			if (room && room.has(userUUID)) {
				return Array.from(room.values());
			}
			return false;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
}

exports.RoomUtil = RoomUtil;