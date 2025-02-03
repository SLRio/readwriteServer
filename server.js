const express = require('express');
const mongodb = require('mongodb');
const app = express();
const port = 3000;

// MongoDB connection URI
const uri = 'mongodb+srv://Rio:RioAstal1234@rio.kh2t4sq.mongodb.net/?retryWrites=true&w=majority';

// MongoDB client
const MongoClient = mongodb.MongoClient;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
let db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('test');
        console.log('Connected to Database');
    })
    .catch(error => console.error(error));

// Route to fetch the last 30 days of data from the database
app.get('/data', async (req, res) => {
    try {
        const collection = db.collection('datas');
        const data = await collection.find().sort({ "payload.Time": -1 }).limit(30).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// Route to write data to the database
app.post('/write', async (req, res) => {
    try {
        const { value } = req.body;
        const collection = db.collection('datas');
        
        const newData = {
            operation: 'update',
            query: {},
            payload: {
                GAmount: {
                    averageGAmount: parseInt(value)
                },
                Time: new Date().toLocaleString(),
            },
            _msgid: new Date().toISOString(),
        };

        await collection.insertOne(newData);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
});

// Serve static files (for the frontend)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
