import Cmd from '../classes/cmd.ts'

class Ping extends Cmd {
	constructor() {
		super({
			name: 'ping',
			aliases: ['p'],
			permissions: {
				sendTxt: 1,
				react: 2,
			},
			params: ['user', 'msg'],
		})
	}

	async run() {
		await JSON
		return new Response(null, { status: 200 })
	}
}
