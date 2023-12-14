import prisma from 'util/prisma.ts'
import Cmd from 'classes/cmd.ts'

new Cmd({
	name: 'ping',
	aliases: ['p'],
	permissions: {
		sendTxt: 1,
		react: 2,
	},
	params: ['user', 'msg'],
}).run = async function ({ msg, user }) {
	// Calculate the WhatsApp API delay by reacting on tha user msg
	let apiDelay = Date.now()
	await this.react(msg, 'hourglass')
	apiDelay = Date.now() - apiDelay

	// Calculate the db delay by searching the user id in it
	let dbDelay = Date.now()
	await prisma.users.findUnique({
		where: {
			id: user.id,
		},
	})
	dbDelay = Date.now() - dbDelay

	this.send(msg, `*Ping!* :penguin:/nWA API: ${apiDelay}ms/nPostgreSQL: ${dbDelay}`)

	return new Response(null, { status: 200 })
}
