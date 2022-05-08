const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const res = require('express/lib/response')
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

// run

async function run() {
	try {
		await client.connect()
		console.log('Database Connencted')
		const productCollection = client.db('warehouse').collection('bike')

		app.get('/', (req, res) => {
			res.send('Server is running')
		})

		// get req to find all items
		app.get('/items', async (req, res) => {
			const limit = Number(req.query.limit)
			const pageNumber = Number(req.query.pageNumber)
			const query = {}
			const cursor = productCollection.find()
			const products = await cursor
				.skip(pageNumber * limit)
				.limit(limit)
				.toArray()
			const count = await productCollection.estimatedDocumentCount()
			res.send({ success: true, data: products, count })
		})
		// get req to find a single product detail with id
		app.get('/itemDetail/:id', async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const item = await productCollection.findOne(query)
			res.send(item)
		})

		// get method to load myitem data
		app.get('/myitem', async (req, res) => {
			const email = req.query.email
			const query = { email }
			const cursor = productCollection.find(query)
			const myItems = await cursor.toArray()
			res.send(myItems)
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
			console.log(req.body)
			const item = req.body
			if (Number(item.price) < 0 || Number(item.quantity) < 0) {
				console.log(item.quantity, item.price)
				return res.send({
					success: false,
					error: 'Please provide a positive number!',
				})
			} else {
				const result = await productCollection.insertOne(item)
				return res.send({
					success: true,
				})
			}
		})

		// put method to update items quantity
		app.put('/itemDetail/:id', async (req, res) => {
			console.log(req.body)
			const id = req.params.id
			const quantity = req.body
			// console.log(quantity)
			const filter = { _id: ObjectId(id) }
			const options = { upsert: true }
			const updatedDoc = {
				$set: quantity,
				// quantity :
			}
			const result = await productCollection.updateOne(
				filter,
				updatedDoc,
				options
			)
			res.send(result)
		})
	} finally {
	}
}
run().catch(console.dir)

app.listen(port, () => {
	console.log('Listening to port', port)
})
