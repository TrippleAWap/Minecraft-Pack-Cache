const timeToStart = 0.25


const tournaments = {
	pot: { mainTP: {x:-31,y:77,z:23}, startPos1: {x:-17,y: 77,z: 23}, startPos2: {x:-43,y:77,z:22}, players: [], currentFight: [], started: false, eventID: 0, creationTime: 0 },
	sumo: { mainTP: {x:-31,y:77,z:23}, startPos1: {x:-17,y: 77,z: 23}, startPos2: {x:-43,y:77,z:22}, players: [], currentFight: [], started: false, eventID: 0, creationTime: 0 },
	classic: { mainTP: {x:-31,y:77,z:23}, startPos1: {x:-17,y: 77,z: 23}, startPos2: {x:-43,y:77,z:22}, players: [], currentFight: [], started: false, eventID: 0, creationTime: 0 }
}

export const form = async (player) => {
	const form = new ActionForm()
		.title(`tournaments`)
		.body(`tournaments are a fun way to play with other players in a competitive way. You can win prizes and have fun!`)
		.button(`Current tournaments`, `tournaments`)
		.button(`Create tournament`)
		.button(`cancel`)
	const { selection, canceled } = await form.show(player)
	if (canceled || selection === 2) return;
	switch (selection) {
		case 0:
			forms.viewTournys(player);
			break;
		case 1:
			forms.createTourny(player);
			break;
		default:
			break;
	}
}

export const {createEvent, onEmit, addPlayerToEvent, events, matchmake, emit} = {
	events: {
		/**
		 * @type {function(type)[]}
		 */
		onCreate: [],

		/**
		 * @type {function(type)[]}
		 */
		onStart: [],

		/**
		 * @type {function(type)[]}
		 */
		onEnd: []
	},
	createEvent: (type) => {
		const tourney = tournaments[type];
		if (tourney.players.length > 0 || tourney.eventID !== 0) return false;
		tournaments[type].eventID = Math.random().toString(36).substring(7);
		tournaments[type].creationTime = Date.now()
		for (const callback of events.onCreate) {
			callback(tourney);
		}
		return true;
	},
	addPlayerToEvent: (type, player) => {
		const tourney = tournaments[type];
		if (tourney.started) return false;
		tourney.players.push(player);
		player.teleport(tourney.mainTP);
		return true;
	},
	matchmake: (type) => {
		const tourney = tournaments[type];
		tourney.started = true;
		const players = tourney.players.sort((a, b) => (a.roundsPlayed ??= 0) > (b.roundsPlayed ??= 0)) // sort by rounds played ( lowest first )
		const player1 = players[0];
		const player2 = players[1];
		player1.roundsPlayed++;
		player2.roundsPlayed++;
		player1.teleport(tourney.startPos1);
		player2.teleport(tourney.startPos2);
		// return players
		return players
	},
	/**
	 * @param {"onCreate"|"onEnd"|"onStart"} type
	 * @param {function(tournamentType)} callback
	 */
	onEmit(type, callback) {
		switch (type) {
			case "create":
				events.onCreate.push(callback);
				break;
			case "end":
				events.onEnd.push(callback);
				break;
			case "start":
				events.onStart.push(callback)
				break
		}
	},
	emit(type, tournamentType) {
		switch (type) {
			case "create":
				for (const callback of events.onCreate) {
					callback(tournamentType)
				}
				break
			case "end":
				for (const callback of events.onEnd) {
					callback(tournamentType)
				}
				break
			case "start":
				for (const callback of events.onStart) {
					callback(tournamentType)
				}
				break
			default:
				world.sendMessage(`Unknown Emit Type`)
				break
		}
	}
}
let lastEvent = 0
export const forms = {
	createTourny: async (player) => {
		const timeleft = (60 * 5 - Math.round((Date.now() - lastEvent) / 1000 ))
		if (lastEvent > Date.now() - 1000 * 60 * 5) return player.sendMessage(`A tournament can only be created every 5 minutes! ( ${Math.round(timeleft / 60)}:${timeleft % 60} seconds left )`);
		lastEvent = Date.now();
		const types = Object.keys(tournaments)
		const form = new ActionForm()
			.title(`Create a tournament`)
			.body(`Select a tournament type`)
		for (const type of types) {
			form.button(type)
		}
		form.button(`Cancel`)
		const { selection, canceled } = await form.show(player);
		if (canceled || selection === types.length) return;
		const type = types[selection];
		if (!createEvent(type)) return player.sendMessage(`There is already a tournament of this type running!`);
		player.sendMessage(`You have created a ${type} tournament!`);
		addPlayerToEvent(type, player);
	},
	viewTournys: async (player) => {
		const currentTournys = Object.entries(tournaments).filter(([, tourney]) => tourney.eventID !== 0);
		// check if players already in a tournament
		const joinedTournament = currentTournys.find(([type, data]) => data.players.includes(player))
		if (joinedTournament) {
			const [joinedName, joinedData] = joinedTournament
			// show current form with options to leave ect.\
			const timeleft =( Date.now() - joinedData.creationTime + timeToStart * 60)
			const form = new ActionForm()
				.title(joinedName[0].toUpperCase() + joinedName.substring(1) + " Tournament")
				.body(`Starts in:  Current Players:\n ${joinedData.players.map((p) => p.name).join("\n")}`)
				.button(`Leave`)
				.button(`Cancel`)
			const { selection, canceled } = await form.show(player)
			if (selection === 1 || canceled) return;
			joinedTournament[1].players.splice(joinedData.players.findIndex(p => p === player))
			player.sendMessage(`Left ${joinedName[0].toUpperCase() + joinedName.substring(1)} Tournament`)
			return;
		}
		const form = new ActionForm()
			.title(`Current tournaments`)
			.body(`Select a tournament to join`)
		for (const [type, data] of currentTournys) {
			form.button(`${type}\n(${data.players.length} players)`)
		}
		form.button(`Cancel`)
		const { selection, canceled } = await form.show(player);
		if (canceled || selection === currentTournys.length) return;
		const [type, data] = currentTournys[selection]
		if (data.players.includes(player)) return player.sendMessage(`Already in this tournament`)
		if (!addPlayerToEvent(type, player)) return player.sendMessage(`Tournament is already active!`);
		player.sendMessage(`You have joined a ${type} tournament!`);
	},
	mainUI: async (player) => {
		const form = new ActionForm()
			.title(`Main`)
			.button(`Create`)
			.button(`View`)
			.button(`Cancel`)
		const { selection, canceled } = await form.show(player)
		if (canceled || selection === 2) return;
		if (selection === 1) return forms.viewTournys(player)
		forms.createTourny(player)
	}
}

world.afterEvents.itemUse.subscribe(({source: player, itemStack: item}) => {
	if (item.typeId !== "minecraft:diamond_sword") return;
	forms.mainUI(player)
})
const tickEvents = []
system.runInterval(async () => {
	const players = world.getAllPlayers();
	for (const [name, data] of Object.entries(tournaments)) {
		data.players = data.players.filter(p => players.includes(p))
		if (data.eventID === 0 || data.started === true || data.creationTime + timeToStart * 1000 * 60 > Date.now()) continue; // returns if it isn't time to start, its already started or there's no current tournament
		data.started = true;
		world.sendMessage(`${name} has started!`)
		emit("start", name)
	}
})

onEmit("start", (tournamentType) => {
	const data = tournaments[tournamentType]
	for (const player of data.players) {
		player.sendMessage(`Teleported To Tournament`)
		player.teleport(data.mainTP)
	}

	const runTime = system.runInterval(() => {
		if (data.players.length < 2) {
			system.clearRun(runTime)
			emit("end", tournamentType)
				data.eventID = 0
				data.players = []
				data.currentFight = []
				data.started = false
				data.creationTime = 0
		}
		const worldPlayers = world.getAllPlayers()
		data.currentFight = data.currentFight.filter(p => worldPlayers.includes(p))
		if (data.currentFight.length < 2) {
			for (const player of data.currentFight) {
				player.sendMessage(`You have won the tournament!`)
				player.teleport(data.mainTP)
			}
			data.currentFight = matchmake(tournamentType)
		}
	})
})

onEmit("end", (tournamentType) => {
	const data = tournaments[tournamentType]
	world.sendMessage(`${tournamentType} has ended!`)
	for (const player of data.players) {
		player.sendMessage(`Teleported To Main`)
		player.teleport({x: -31, y: 77, z: 23})
	}
})


world.afterEvents.entityDie.subscribe(async ({deadEntity: entity, damageSource: {damagingEntity: source}}) => {
	if (entity.typeId !== "minecraft:player" || source?.typeId !== "minecraft:player") return;
	const player = entity
	const tournament = Object.entries(tournaments).find(([, data]) => data.currentFight.includes(player))
	if (!tournament) return;
	const [type, data] = tournament
	const otherPlayer = data.currentFight.find(p => p !== player)
	player.sendMessage(`You have lost the tournament!`)
	otherPlayer.sendMessage(`You have won the tournament!`)
	await wait(5)
	player.teleport(data.mainTP)
	otherPlayer.teleport(data.mainTP)
	data.currentFight = matchmake(type)
	data.players.splice(data.players.findIndex(p => p === player), 1)
})

const wait = async (ticks) => {
	return new Promise((resolve) => {
		return system.runTimeout(resolve, ticks)
	})
}
