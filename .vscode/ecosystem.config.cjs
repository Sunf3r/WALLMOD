// const DENO_PATH = '~/.deno/bin/deno'
const node_args = [
	'--expose-gc',
	'--no-warnings',
]
// const cmd = './commands/'

// const cmdsInfo = {
// 	ping: {
// 		name: 'ping',
// 		script: cmd + 'dev/ping.js',
// 		log_file: 'log/ping.log',
// 	},
// }

module.exports = {
	apps: [
		{
			name: 'wa_main',
			script: 'main.js',
			node_args,
			// exec_mode: 'cluster',
			// instances: 2,
			log_file: 'log/wa_main.log',
		},
		// {
		// 	name: 'ping',
		// },
	],
}
