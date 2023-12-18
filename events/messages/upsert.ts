import settings from 'settings/settings.json' assert { type: 'json' }
import { react, send, updatePresence } from 'util/interaction.ts'
import { cacheCmds, cmds } from 'core/cache.ts'
import { coolMsgValues } from 'types/msgs.ts'
import { request } from 'util/request.ts'
import Event from 'classes/event.ts'
import { getCtx } from 'util/bot.ts'
import { type proto } from 'baileys'
import { Duration } from 'luxon'
import { cmdPorts } from 'ports'

// cache all running cmds when the event get up
cacheCmds()

new Event('messages.upsert')
	.on = async function (raw: { messages: proto.IWebMessageInfo[] }) {
		if (!raw.messages[0]) return new Response(null, { status: 400 })
		// sometimes you can get a new msg but without THE NEW MSG
		// so, protect yourself with this check (and use condom)

		// read all received msgs
		for (const m of raw.messages) {
			// protect yourself again
			if (!m.message) continue

			// get abstract msg obj
			const { msg, group, user } = await getCtx(m)

			if (group?.id && coolMsgValues.includes(msg.type)) {
				group.cacheMsg(msg)
				// only msg keys are cached (used for 'clean' cmd)

				if (!msg.fromBaileys) group.countMsg(user.id)
				// add +1 msg to user's counter
			}

			if (!msg.text.startsWith(user.prefix)) continue

			// args = array with all after-prefix words splitted by spaces
			let args: str[] = msg.text.replace(user.prefix, '').trim().split(' ')

			// supposedCmd: It's the first word between prefix and args
			const supposedCmd = args.shift()!.toLowerCase()!

			// search cmd by name or by alias
			const cmd = cmds.find((c) => c.name === supposedCmd || c.aliases.includes(supposedCmd))

			if (!cmd) continue // Skip this msg and go to the next

			if (cmd.access.onlyDevs && !settings.botOwners.includes(user.id)) {
				// don't allow random guys run onlyDevs cmds
				react(msg, 'block')
				continue
			}

			// Remember, son. You DO the multiplication FIRST
			const cdTime = user.lastCmd.time + cmd.cooldown * 1_000 - Date.now()
			if (cdTime > 699) {
				const time = Duration // Format timestamp
					.fromMillis(cdTime)
					.rescale()
					.shiftTo('seconds')
					.toHuman({ unitDisplay: 'long' })

				send(msg, `t:cooldown|time:${time}`)
				continue
			}

			user.addCmd() // Count 1+ cmd
			// if you didn't understand, there are two counter types:
			// user sent msgs (scope: group) = How many msgs this user sent to a group
			// user cmds (scope: user) = How many cmds did this user use

			try {
				// start typing in this chat (expires after about 10 seconds.)
				updatePresence(msg.chat, 'composing')

				request(`http://localhost:${cmdPorts[cmd.name as 'ping']}`, {
					sendUsage,
					group,
					args,
					user,
					cmd,
					msg,
				})
			} catch (e: any) {
				send(msg, `[:alert:] ${e?.message || e}`)

				// GAY PANICCCCCC
				react(msg, 'x')
			}

			// deno-lint-ignore no-inner-declarations
			function sendUsage() {
				// this func is called when the user provides wrong args for a cmd
				args = [cmd!.name]

				request(`http://localhost:${cmdPorts['help']}`, {
					args,
					msg,
				})
				// Then, send their the help menu
				react(msg, 'think')
				return
			}
		}

		return new Response(null, { status: 200 })
	}
