import db from 'json/db.json' assert { type: 'json' }
import prisma from 'prisma'

export default class User {
	_username: str
	_cmdsCount: num
	_userPrefix: str
	_userLanguage: str
	lastCmd: {
		time: num
		botResponse: str
	}

	constructor(public id: str, username: str) {
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

	public get name() {
		return this._username
	}

	public set name(value: str) {
		this._username = value

		prisma.users.update({
			where: { id: this.id },
			data: { name: value },
		})
	}

	public get lang() {
		return this._userLanguage
	}

	public set lang(value: str) {
		this._userLanguage = value

		prisma.users.update({
			where: { id: this.id },
			data: { lang: value },
		})
	}

	get prefix() {
		return this._userPrefix
	}

	set prefix(value: str) {
		this._userPrefix = value

		prisma.users.update({
			where: { id: this.id },
			data: { prefix: value },
		})
	}

	get cmds() {
		return this._cmdsCount
	}

	async addCmd() {
		this.lastCmd = {
			time: Date.now(),
			botResponse: this.lastCmd.botResponse || '',
		}
		this._cmdsCount++

		await prisma.users.update({
			where: { id: this.id },
			data: {
				cmds: { increment: 1 },
			},
		})
	}

	async checkData() {
		let data = await prisma.users.findUnique({
			where: { id: this.id },
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
			data = await prisma.users.update({
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
