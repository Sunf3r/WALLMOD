import { getHeaders, parseHeaders } from 'util/request.ts'
import type { CmdCtx } from 'types/types.d.ts'
import { cmds } from 'ports'

export default class Cmd {
	name: str
	aliases: str[]
	cooldown: num // in secs
	access: {
		dm?: bool // Can this cmd run on DMs?
		groups?: bool // Can this cmd run on groups?
		onlyDevs?: bool // Can only devs run this cmd?
	}
	permissions: {
		react?: num // How many times can this cmd react on msgs?
		sendTxt?: num // How many txt msgs can this cmd send?
		sendMedia?: num // How many media msgs can this cmd send?
	}
	params: cmdParams[] // Cmd will only receive params with these names from the main

	run?(ctx: CmdCtx): Promise<Response> // Pretend this is an abstract function

	constructor({ access, aliases, cooldown, permissions, params, name }: Partial<Cmd>) {
		this.name = name as 'ping'
		// 'as ping' bc i won't create a type with all cmd names
		// and i'll need it later

		this.aliases = aliases || []
		this.cooldown = cooldown === 0 ? 0 : cooldown || 3
		// if the cmd does not specifies it, it's 3
		// but if it specifies to 0, the cmd won't have a cd delay

		this.access = Object.assign({
			dm: true, // by default, all cmds can run on DMs
			groups: true, // and on groups
			onlyDevs: false, // and are accessible for everyone
		}, access)
		// It compares the cmd access options to the default options

		this.permissions = Object.assign({
			react: 0, // by default, a cmd can't react on msgs
			sendTxt: 0, // and can't send text msgs
			sendMedia: 0, // and can't send media msgs
		}, permissions)
		// It compares the cmd permissions to the default permissions

		this.params = params!

		if (cmds[name as 'ping']) {
			Deno.serve({ port: cmds[name as 'ping'] }, this.handler)
		}
	}

	public handler(req: Request) {
		if (req.headers.has('setup')) return this.setup()

		const ctx = parseHeaders(req.headers) as CmdCtx

		try {
			return this.run!(ctx)
		} catch (e: any) {
			return new Response(e.stack, { status: 500 })
		}
	}

	public setup() {
		const headers = getHeaders({
			name: this.name,
			access: this.access,
			params: this.params,
			aliases: this.aliases,
			cooldown: this.cooldown,
			permissions: this.permissions,
		})

		return new Response(null, { headers, status: 200 })
	}
}
