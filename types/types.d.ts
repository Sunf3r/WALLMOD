import { proto } from 'baileys'
import User from 'classes/user.ts'
import Cmd from 'classes/cmd.ts'

type MsgTypes =
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

interface Msg {
	key: proto.IMessageKey
	chat: str
	edited: bool
	text: str
	type: MsgTypes
	isMedia: bool
	isBot: bool
	quoted: Msg
	raw: proto.IWebMessageInfo
}

interface CmdCtx {
	msg: Msg
	user: User
	// group: Group | undefined
	args: str[]
	cmd: Cmd
	sendUsage(): Promise<void>
}
