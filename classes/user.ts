import db from 'settings/db.json' assert { type: 'json' }
import prisma from 'util/prisma.ts'

export default class User {
	_username: str
	_cmdsCount: num
	_userPrefix: str
	_userLanguage: str
	lastCmd: {
		time: num // last cmd timestamp
		botResponse: str // bot's response ID
	}

	constructor(public id: str, username: str) {
		// Format ID to phone number
		this.id = id.split('@')[0].split(':')[0]
		this.lastCmd = {
			time: 0,
			botResponse: '',
		}

		this._cmdsCount = 0
		this._username = username
		this._userPrefix = db.userDefaults.prefix
		this._userLanguage = db.userDefaults.language
	}

	// Each property has a getter/setter, but how does it works?
	// when you call user.name, will receive this._username
	public get name() {
		return this._username
	}

	// when you set user.name = 'random user name', will update cache & DB
	public set name(value: str) {
		this._username = value

		prisma.users.update({
			where: { id: this.id },
			data: { name: value }, // update user name
		})
	}

	public get lang() {
		return this._userLanguage
	}

	public set lang(value: str) {
		this._userLanguage = value

		prisma.users.update({
			where: { id: this.id },
			data: { lang: value }, // update user language
		})
	}

	get prefix() {
		return this._userPrefix
	}

	set prefix(value: str) {
		this._userPrefix = value

		prisma.users.update({
			where: { id: this.id },
			data: { prefix: value }, // update user prefix
		})
	}

	get cmds() {
		return this._cmdsCount
	}

	async addCmd() {
		this.lastCmd = { // set last cmd data
			time: Date.now(),
			botResponse: this.lastCmd.botResponse || '',
		}
		this._cmdsCount++ // Count +1 cmd

		await prisma.users.update({
			where: { id: this.id },
			data: {
				cmds: { increment: 1 }, // update user cmds count
			},
		})
	}

	async checkData() {
		let data = await prisma.users.findUnique({
			where: { id: this.id }, // find user data
		})

		if (!data) {
			data = await prisma.users.create({
				data: {
					cmds: 0,
					id: this.id,
					name: this._username,
					lang: this._userLanguage,
					prefix: this._userPrefix,
				},
			})
		}

		if (this._username && data.name !== this._username) {
			data = await prisma.users.update({ // 'sync' usernames
				where: { id: this.id },
				data: { name: this._username },
			})
		}

		this._username = data.name
		this._cmdsCount = data.cmds
		this._userLanguage = data.lang
		this._userPrefix = data.prefix

		return this
	}
}
