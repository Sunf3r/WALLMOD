import { GroupMetadata, type GroupParticipant, type proto } from 'baileys'
import db from 'json/db.json' assert { type: 'json' }
import Collection from 'util/collection.ts'
import type { Msg } from 'types/types.d.ts'
import prisma from 'prisma'

// I commented out some properties in this class bc
// I don't need them, so there's no reason for them to be cached

export default class Group {
	id: str
	name: str
	owner?: str
	// nameTimestamp?: num // group name modification date
	// creation?: num
	// desc?: str
	// restrict?: bool // true when only admins can change group settings
	// announce?: bool // true when only admins can write msgs
	members: GroupParticipant[]
	size: num // number of group members/participants
	// ephemeral?: num
	// invite?: str
	// author?: str // the person who added you

	cachedMsgs: Collection<str, proto.IMessageKey>
	// a Collection of msg keys

	constructor(g: GroupMetadata) {
		this.id = g.id
		this.name = g.subject
		this.owner = g.owner
		// this.nameTimestamp = g.subjectTime
		// this.creation = g.creation
		// this.desc = g.desc
		// this.restrict = g.restrict
		// this.announce = g.announce
		this.members = g.participants
		this.size = g.size || this.members.length
		// this.ephemeral = g.ephemeralDuration
		// this.invite = g.inviteCode
		// this.author = g.author
		this.cachedMsgs = new Collection(db.groupDefaults.msgsCacheLimit)
	}

	// countMsg: add +1 to a user sent msgs count in this group
	async countMsg(author: str) {
		await prisma.msgs.upsert({
			where: {
				author_group: {
					author,
					group: this.id,
				},
			},
			create: {
				author,
				group: this.id,
				count: 1,
			},
			update: {
				count: { increment: 1 },
			},
		})
		return
	}

	// getCountedMsgs: get all counted msgs in this group
	async getCountedMsgs(author?: str) {
		if (author) {
			// return msgs count from a specific user
			return await prisma.msgs.findUnique({
				where: {
					author_group: {
						author,
						group: this.id,
					},
				},
			})
		}

		// return msgs count from all users
		return await prisma.msgs.findMany({
			where: { group: this.id },
		})
	}

	getCachedMsgs(limit?: number): proto.IMessageKey[] {
		return this.cachedMsgs
			.filter((m: proto.IMessageKey) => m.id) // Checks if the key really exists
			.reverse() // latest msgs first
			.slice(0, limit || db.groupDefaults.msgsCacheLimit) // limits the number of msgs
	}

	cacheMsg(msg: Msg) {
		return this.cachedMsgs.add(msg.key.id!, msg.key)
	}

	// deno-lint-ignore require-await
	async checkData() {
		// I don't save any data of groups, but I let this func here bc
		// if some day I store groups data on db,
		// the code will be prepared to check these data

		return this
	}
}
