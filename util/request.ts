export { getHeaders, request }

async function request(url: str, data: any) {
	const headers = getHeaders(data)

	const req = await fetch(url, { headers })

	return req
}

function getHeaders(data: any) {
	const strObj = {}

	for (const [key, value] of Object.entries(data)) {
		//@ts-ignore 'obj' does not have a type yet
		strObj[key] = typeof value === 'object' ? JSON.stringify(value) : value
	}

	return new Headers({
		'Content-Type': 'application/json',
		...strObj,
	})
}
