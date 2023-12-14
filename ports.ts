// deno-lint-ignore-file prefer-const
let port = 1616
let url = `http://localhost:${port}`

export { port, url }

export const eventPorts = {
	'messages.upsert': port++,
}

export const cmdPorts = {
	'ping': port++,
	'help': port++,
}
