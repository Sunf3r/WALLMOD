import Cmd from 'classes/cmd.ts'

new Cmd({
	name: 'ping',
	aliases: ['p'],
	permissions: {
		sendTxt: 1,
		react: 2,
	},
	params: ['user', 'msg'],
}).run = async function (ctx) {
	// let msgDelay = Date.now()
	// await this.send()

	return new Response(null, { status: 200 })
}
