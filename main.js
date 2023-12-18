import {
	Browsers,
	fetchLatestBaileysVersion,
	makeCacheableSignalKeyStore,
	makeWASocket,
	useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import express from 'express'
import P from 'pino'

const logger = P.default().child({})
logger.level = 'silent' // Baileys logger
const app = express()

connectToWA('settings/auth')
async function connectToWA(auth) {
	// Fetch latest WA version
	const { version } = await fetchLatestBaileysVersion()
	console.log('WEBSOCKET', `Connecting to WA v${version.join('.')}`, 'green')

	// Use saved session
	const { state, saveCreds } = await useMultiFileAuthState(auth)

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			// cache makes the store send/receive msgs faster
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		browser: Browsers.macOS('Desktop'),
		logger,
		markOnlineOnConnect: false,
		// mobile: true,
		printQRInTerminal: true,
		syncFullHistory: false,
		// ignore status updates
		shouldIgnoreJid: (jid) => jid?.includes('broadcast'),
		version,
	})

	// save login creds
	sock.ev.on('creds.update', saveCreds)
}

process // "anti-crash" to handle lib instabilities
	.on('unhandledRejection', (e) => console.error(`Unhandled Rej: ${e.stack}`))
	.on('uncaughtException', (e) => console.error(`Uncaught Excep.: ${e?.stack}`))
	.on('uncaughtExceptionMonitor', (e) => console.error(`Uncaught Excep.M.: ${e?.stack}`))
