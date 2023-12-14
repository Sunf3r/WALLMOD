import type { AnyMessageContent, proto } from 'baileys'
import type { Msg } from 'types/types.d.ts'
import { request } from 'util/request.ts'
import Group from 'classes/group.ts'
import { url } from 'ports'

export { deleteMsg, downloadMedia, editMsg, getGroup, react, send, updatePresence }

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

// get a group cache or fetch it
async function getGroup(id: str): Promise<Group> {
	const req = await request(url + '/group', { id })

	return await req.json()
}

async function updatePresence(chat: str, status: str) {
	return await request(url + '/presence', {
		chat,
		status,
	})
}
