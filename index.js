const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb')
const port = process.env.PORT || 5000

// Replace the uri string with your MongoDB deployment's connection string.
// const uri =
// 	'mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority'

// const client = new MongoClient(uri)

// khanshorif
// FSGi0uKIHeqJUQBA

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
		// const movies = collection('movies');

		// // Query for a movie that has the title 'Back to the Future'
		// const query = { title: 'Back to the Future' };
		// const movie = await movies.findOne(query);

		// console.log(movie);
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
