import type { AnyMessageContent, proto } from 'baileys'
import type { Msg } from 'types/types.d.ts'
import { request } from 'util/request.ts'
import { url } from 'ports'

export { deleteMsg, downloadMedia, editMsg, react, send }

// Send a message to a chat
async function send(id: str | Msg, body: str | AnyMessageContent) {
	return await request(url + '/send', {
		id,
		body,
	})
}

// React on a msg
async function react(msg: Msg, emoji: str) {
	return await request(url + '/react', {
		msg,
		emoji,
	})
}

// Edit a msg send by the bot
async function editMsg(msg: Msg, newText: str) {
	return await request(url + '/edit', {
		msg,
		newText,
	})
}

// Delete a msg *for everyone*
async function deleteMsg(msgOrKey: Msg | proto.IMessageKey) {
	return await request(url + '/delete', {
		msgOrKey,
	})
}

// Download the media from a msg
async function downloadMedia(msg: Msg) {
	return await request(url + '/downloadMedia', {
		msg,
	})
}
