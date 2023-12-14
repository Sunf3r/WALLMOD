import { proto } from 'baileys';

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
	| 'location';
    
interface Msg {
	key: proto.IMessageKey;
	chat: str;
	edited: bool;
	text: str;
	type: MsgTypes;
	isMedia: bool;
	isBot: bool;
	quoted: Msg;
	raw: proto.IWebMessageInfo;
}