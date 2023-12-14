import db from 'settings/db.json' assert { type: 'json' }
import { parseHeaders } from 'util/request.ts'
import Collection from 'util/collection.ts'
import Group from 'classes/group.ts'
import User from 'classes/user.ts'
import Cmd from 'classes/cmd.ts'
import { cmdPorts } from 'ports'

export const users = new Collection<str, User>(db.userDefaults.cacheLimit)
export const groups = new Collection<str, Group>(db.groupDefaults.msgsCacheLimit)
export const cmds = new Collection<str, Cmd>(0)

export async function cacheCmds() {
	for (const port of Object.values(cmdPorts)) {
		const res = await fetch(`http://localhost:${port}`, {
			headers: {
				setup: '',
			},
		})

		const cmd = parseHeaders(res.headers) as Cmd

		cmds.add(cmd.name, cmd)
	}
}