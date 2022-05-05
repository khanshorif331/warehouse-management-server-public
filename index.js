const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
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

		// get req to find all items
		app.get('/items', async (req, res) => {
			const query = {}
			const cursor = productCollection.find()
			const products = await cursor.toArray()
			res.send(products)
		})
		// get req to find a single product detail with id
		app.get('/itemDetail/:id', async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const item = await productCollection.findOne(query)
			res.send(item)
		})
		// delete method to delete single item
		app.delete('/item/:id', async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const result = await productCollection.deleteOne(query)
			res.send(result)
		})
		// post method to create new items
		app.post('/items', async (req, res) => {
			const item = req.body
			console.log(item)
			if (Number(item.price) < 0 || Number(item.quantity) < 0) {
				console.log(item.quantity, item.price)
				return res.send({
					success: false,
					error: 'Please provide a positive number!',
				})
			} else {
				console.log('from else')
				const result = await productCollection.insertOne(item)
				return res.send({
					success: true,
				})
			}
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
