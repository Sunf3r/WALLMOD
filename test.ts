import { request } from 'util/request.ts'

const req = await request('http://localhost:1617', {
	setup: '',
})

console.log(req.headers)
