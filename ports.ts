// deno-lint-ignore-file prefer-const
let port = 1616
let url = `http://localhost:${port}`

export { port, url }

export const cmds = {
	ping: port + 1,
}
