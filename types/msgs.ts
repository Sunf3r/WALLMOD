import type { MsgTypes } from './types.d.ts'

const textMsgs = { // text msg types
	// rawMsgType: 'refined msg type'
	'conversation': 'text',
	'extendedTextMessage': 'text',
	'editedMessage': 'text',
}

const visualMsgs = {
	// msgs that can make stickers or image editing
	'imageMessage': 'image',
	'stickerMessage': 'sticker',
	'videoMessage': 'video',
	'ptvMessage': 'video',
}

const mediaMsgs = {
	// all media msgs
	...visualMsgs,
	'contactMessage': 'contact',
	'documentMessage': 'document',
	'audioMessage': 'audio',
}

// For the user sent msgs counter (scope: groups):
const coolMsgTypes = {
	// the bot does not count all msg types, bc it can open several breaches

	// e.g. For each msg you 'delete for everyone',
	// WA sends a protocol msg to its chat
	// So, if we count all msgs, users can farm counter by deleting their msgs
	...textMsgs, // only text msgs
	...mediaMsgs, // and media msgs
	'locationMessage': 'location', // and location msgs will be counted
}

const msgTypes = { // all msg types
	...coolMsgTypes,
	'reactionMessage': 'reaction',
	'pinInChatMessage': 'pin',
	'protocolMessage': 'protocol', // Delete msgs

	// API Bots
	'buttonsMessage': 'button',
	'templateMessage': 'template',
	'buttonsResponseMessage': 'buttonReply',
	'templateButtonReplyMessage': 'buttonReply',

	// Polls
	'pollCreationMessageV3': 'poll',
	'pollUpdateMessage': 'pollUpdate',
}

// Array containing all visual msg refined types
const visualValues = Object.values(visualMsgs)
// Array containing all cool msg refined types
const coolMsgValues = Object.values(coolMsgTypes)

const isMedia = (type: MsgTypes) => visualValues.includes(type)

export { coolMsgTypes, coolMsgValues, isMedia, mediaMsgs, msgTypes, textMsgs, visualMsgs }
