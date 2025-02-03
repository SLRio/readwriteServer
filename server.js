const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define a schema and model
const dataSchema = new mongoose.Schema({
    date: Date,       // Store the date
    value: Number,    // Store the value
});

const Data = mongoose.model('Data', dataSchema); // **FIX: Define Model**

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/read', (req, res) => {
    res.sendFile(__dirname + '/public/read.html');
});

// Write data to MongoDB
app.post('/write', async (req, res) => {
    try {
        const newData = new Data({
            date: new Date(req.body.date),  // Convert to Date object
            value: parseFloat(req.body.value),  // Convert to Number
        });
        await newData.save();
        res.redirect('/read');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
});

// Read data from MongoDB
app.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});



// Fetch last 30 days of data
app.get('/graph-data', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const data = await Data.find({ date: { $gte: thirtyDaysAgo } }).sort({ date: 1 });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching graph data');
    }
});

// Create Database (methane)
app.post('/create-db', async (req, res) => {
    try {
        // Creating a 'methane' database by making sure the schema exists
        const dbName = 'methane';
        mongoose.connection.db.createCollection('data', (err, res) => {
            if (err) {
                return res.status(500).send({ message: 'Error creating database' });
            }
            res.send({ message: 'Database "methane" created successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creating database' });
    }
});

// Delete Database (methane)
app.post('/delete-db', async (req, res) => {
    try {
        // Drop the 'methane' database
        mongoose.connection.db.dropDatabase((err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error deleting database' });
            }
            res.send({ message: 'Database "methane" deleted successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting database' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
