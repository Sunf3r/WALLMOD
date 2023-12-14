import { getHeaders, request } from '../util/request.ts'
import type { Msg } from '../types/types.d.ts'
import { AnyMessageContent } from 'baileys'
import { cmds, url } from 'ports'

export default abstract class Cmd {
	name: str
	aliases: str[]
	cooldown: num // in secs
	access: Partial<{
		dm: bool // Can this cmd run on DMs?
		groups: bool // Can this cmd run on groups?
		onlyDevs: bool // Can only devs run this cmd?
	}>
	permissions: {
		react?: num // How many times can this cmd react on msgs?
		sendTxt?: num // How many txt msgs can this cmd send?
		sendMedia?: num // How many media msgs can this cmd send?
	}
	params: cmdParams[]

	constructor({ access, aliases, cooldown, permissions, params, name }: Partial<Cmd>) {
		this.name = name as 'ping'
		this.aliases = aliases || []
		this.cooldown = cooldown === 0 ? 0 : cooldown || 3
		// Some cmds does not have cooldown
		this.access = Object.assign({
			dm: true,
			groups: true,
			onlyDevs: false,
		}, access) // Compare cmd access
		this.permissions = Object.assign({
			react: 0,
			sendTxt: 0,
			sendMedia: 0,
		}, permissions) // Compare cmd permissions
		this.params = params!

		if (cmds[name as 'ping']) {
			const handler = (req: Request) =>
				req.headers.has('setup') ? this.setup() : this.run(req.headers)

			Deno.serve({ port: cmds[name as 'ping'] }, handler)
		}
	}

	public abstract run(ctx: Headers): Promise<Response>
	
	public setup() {
		const headers = getHeaders({
			name: this.name,
			aliases: this.aliases,
			cooldown: this.cooldown,
			access: this.access,
		})

		return new Response(null, { headers, status: 200 })
	}
	// Send a message to a chat
	public async send(id: str | Msg, body: str | AnyMessageContent) {
		return await request(url + '/send', {
			id,
			body,
		})
	}
}
