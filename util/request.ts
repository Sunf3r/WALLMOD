export { getHeaders, parseHeaders, request }

// request: send requests to the main server
async function request(url: str, data: any) {
	const headers = getHeaders(data)

	return await fetch(url, { headers })
}

// getHeaders: generate & parse request headers
function getHeaders(data: any) {
	const headers = {}

	// stringify all objects inside 'data'
	for (const [key, value] of Object.entries(data)) {
		//@ts-ignore 'headers' does not have a type yet
		headers[key] = typeof value === 'object' ? JSON.stringify(value) : value
	}

	// create THE HEADERS OMG
	return new Headers({
		'Content-Type': 'application/json',
		...headers,
	})
}

function parseHeaders(headers: Headers) {
	const newObj = {}

	for (const [key, value] of headers.entries()) {
		try {
			//@ts-ignore 'newObj' does not have a type yet
			newObj[key] = value.includes('{') ? JSON.parse(value) : value
		} catch (_e) {
			//@ts-ignore 'newObj' does not have a type yet
			newObj[key] = value
		}
	}

	return newObj
}
