export { getHeaders, request }

// request: send requests to the main server
async function request(url: str, data: any) {
	const headers = getHeaders(data)

	return await fetch(url, { headers })
}

// getHeaders: generate & parse request headers
function getHeaders(data: any) {
	const strObj = {}

	// stringify all objects inside 'data'
	for (const [key, value] of Object.entries(data)) {
		//@ts-ignore 'obj' does not have a type yet
		strObj[key] = typeof value === 'object' ? JSON.stringify(value) : value
	}

	// create THE HEADERS OMG
	return new Headers({
		'Content-Type': 'application/json',
		...strObj,
	})
}
