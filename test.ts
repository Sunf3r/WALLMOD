import { request } from 'util/request.ts'

const req = await request('http://localhost:3000', {
	id: 'jsdjkfsd',
	sexo: '!0-_.,[]{~^}/nsaf',
	permissions: null,
})

console.log(req)
