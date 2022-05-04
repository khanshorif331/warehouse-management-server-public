const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntwoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})

async function run() {
	try {
		await client.connect()
		console.log('Database Connencted')
		const productCollection = client.db('warehouse').collection('bike')
		console.log(productCollection)

		app.get('/items', async (req, res) => {
			const query = {}
			const cursor = productCollection.find()
			const products = await cursor.toArray()
			res.send(products)
		})
	} finally {
	}
}
run().catch(console.dir)

app.get('/', (req, res) => {
	res.send('Server is running')
})

app.listen(port, () => {
	console.log('Listening to port', port)
})
