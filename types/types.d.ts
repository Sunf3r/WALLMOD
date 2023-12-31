import type Group from 'classes/group.ts'
import type User from 'classes/user.ts'
import type Cmd from 'classes/cmd.ts'
import type { proto } from 'baileys'

type MsgTypes = // refined msg types
	| 'text'
	| 'image'
	| 'sticker'
	| 'video'
	| 'contact'
	| 'document'
	| 'audio'
	| 'protocol'
	| 'reaction'
	| 'location'

interface Msg { // abstract msg obj type
	key: proto.IMessageKey
	chat: str
	edited: bool
	text: str
	type: MsgTypes
	isMedia: bool
	fromBaileys: bool
	quoted: Msg
	raw: proto.IWebMessageInfo
}

interface CmdCtx {
	msg: Msg
	user: User
	group: Group | undefined
	args: str[]
	cmd: Cmd
	sendUsage(): void
}
