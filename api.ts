import express from 'npm:express'
const app = express()

app.get('/', (req, res) => {
	// console.log(req.headers)

	if (req.headers.permissions) {
		const permissions = JSON.parse(req.headers.permissions)

		console.log(Object.assign({
			react: 0,
			sendTxt: 0,
			sendMedia: 0,
		}, permissions))
	}
	res.send('Hello World!')
})

app.listen(3000, () => {
	console.log('Listening on port 3000')
})
