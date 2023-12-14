import type { MsgTypes } from './types.d.ts'

const textMsgs = {
	'conversation': 'text',
	'extendedTextMessage': 'text',
	'editedMessage': 'text',
}

const visualMsgs = {
	'imageMessage': 'image',
	'stickerMessage': 'sticker',
	'videoMessage': 'video',
}

const mediaMsgs = {
	...visualMsgs,
	'contactMessage': 'contact',
	'documentMessage': 'document',
	'audioMessage': 'audio',
}

const coolMsgTypes = {
	...textMsgs,
	...mediaMsgs,
	'locationMessage': 'location',
}

const msgTypes = {
	...coolMsgTypes,
	'protocolMessage': 'protocol',
	'reactionMessage': 'reaction',
}

const visualValues = Object.values(visualMsgs)
const coolMsgValues = Object.values(coolMsgTypes)

const isMedia = (type: MsgTypes) => visualValues.includes(type)

export { coolMsgTypes, coolMsgValues, isMedia, mediaMsgs, msgTypes, textMsgs, visualMsgs }
