import settings from 'settings/settings.json' with { type: 'json' }
import { CmdCtx, Msg, MsgTypes } from 'types/types.d.ts'
import { isMedia, msgTypes } from 'types/msgs.ts'
import { getGroup } from 'util/interaction.ts'
import type { proto } from 'baileys'
import Group from 'classes/group.ts'
import User from 'classes/user.ts'
import { users } from 'core/cache.ts'

export { findKey, getCtx, getMsgType }

// message abstraction layer/command context
async function getCtx(raw: proto.IWebMessageInfo) {
	const { message, key, pushName } = raw

	// msg type
	const type = getMsgType(message!)

	let userID = key.fromMe ? settings.botNumber : key.remoteJid

	let group: Group

	if (key.participant) {
		userID = key.participant

		if (key.remoteJid) {
			group = await getGroup(key.remoteJid)
		}
	}

	const user: User = users.add(userID!, {}, [pushName!])
	await user.checkData()

	return {
		msg: {
			key,
			chat: key?.remoteJid!,
			// msg chat id
			type,
			text: getMsgText(message!),
			edited: Object.keys(message!)[0] === 'editedMessage',
			// if the msg is edited
			fromBaileys: key.fromMe && !key.participant,
			// if the msg was sent by Baileys
			isMedia: isMedia(type),
			quoted: getQuoted(raw), // quoted msg
			raw, // raw msg obj
		},
		user,
		group: group!,
	} as CmdCtx // the only one context you need.
}

// getMsgType: Get the type of a raw message
function getMsgType(m: proto.IMessage): MsgTypes {
	for (const [rawType, newType] of Object.entries(msgTypes)) {
		const res = findKey(m, rawType)

		if (res) return String(newType).trim() as MsgTypes
	}

	console.log(Object.keys(m!)[0])
	return Object.keys(m!)[0] as MsgTypes
}

// findKey: Search for a key inside an object
function findKey(obj: any, key: str): any {
	// if the obj has this key, return it
	if (obj?.hasOwnProperty(key)) return obj[key]

	// search the key on all objs inside the main obj
	for (const property of Object.getOwnPropertyNames(obj)) {
		// without this, the msg type could be the quoted msg type.
		if (property === 'quotedMessage' && key !== 'quotedMessage') continue

		// if the property is a obj, call findKey() recursively
		if (typeof obj[property] === 'object') {
			const result = findKey(obj[property], key)

			if (result !== undefined) return result
		}

		// If it's a method, check if it is the searched value
		if (typeof obj[property] === 'function' && property === key) {
			return obj[property]
		}
	}

	return
}

// getMsgText: "get msg text"
function getMsgText(m: proto.IMessage) {
	for (const key of ['conversation', 'text', 'caption']) {
		const res = findKey(m, key)
		if (res) return String(res).trim()
	}

	return ''
}

// getQuoted: get the quoted msg of a raw msg
function getQuoted(raw: proto.IWebMessageInfo) {
	//@ts-ignore 'quotedMessage' is missing on Baileys types
	const quotedRaw = findKey(raw.message!, 'quotedMessage')

	if (!quotedRaw) return

	const type = getMsgType(quotedRaw) // quoted message type

	return {
		type, // msg type
		isMedia: isMedia(type),
		text: getMsgText(quotedRaw),
		raw: { message: quotedRaw }, // raw quote obj
	} as Partial<Msg>
}
