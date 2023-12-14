import { parseHeaders } from 'util/request.ts'
import { eventPorts } from 'ports'

export default class Event {
	name: str

	on?(...args: any): Promise<Response> // Pretend this is an abstract function

	constructor(name: 'messages.upsert') {
		this.name = name

		if (eventPorts[name]) {
			Deno.serve({ port: eventPorts[name] }, this.handler)
		}
	}

	public handler(req: Request) {
		const ctx: any = parseHeaders(req.headers)

		try {
			return this.on!(ctx)
		} catch (e: any) {
			return new Response(e.stack, { status: 500 })
		}
	}
}
