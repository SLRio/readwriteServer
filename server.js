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
    operation: String,
    query: Object,
    payload: {
        GAmount: {
            averageGAmount: Number
        },
        Time: String
    },
    _msgid: String
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
            operation: 'update',  // Assuming you always want to mark it as an "update" operation
            query: {},            // Use an empty query, you can modify this if needed
            payload: {
                GAmount: {
                    averageGAmount: parseInt(req.body.value), // Store the value as an integer
                },
                Time: new Date().toLocaleString() // Current timestamp as "Time"
            },
            _msgid: 'uniqueMsgID'  // You can generate a unique ID or use any other logic
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
<script>
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const dataList = document.getElementById('data-list');
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `GAmount: ${item.payload.GAmount.averageGAmount}, Time: ${item.payload.Time}`;
                dataList.appendChild(li);
            });
        });
</script>


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
