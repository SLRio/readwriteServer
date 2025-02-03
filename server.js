<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Write Data</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }
        form {
            display: inline-block;
            text-align: left;
            background: #f4f4f4;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        label {
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 8px;
            margin: 5px 0 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #218838;
        }
        .action-buttons {
            margin-top: 20px;
        }
        .action-buttons button {
            margin: 10px;
        }
    </style>
</head>
<body>
    <h1>Write Data to MongoDB</h1>
    <form action="/write" method="POST">
        <label for="date">Date:</label>
        <input type="date" id="date" name="date" required>
        <br>
        <label for="value">Value:</label>
        <input type="number" id="value" name="value" step="any" required>
        <br>
        <button type="submit">Submit</button>
    </form>

    <script>
        // Set the default value of the date field to today's date
        document.getElementById('date').valueAsDate = new Date();
    </script>

    <!-- Action buttons for managing the database and showing the graph -->
    <div class="action-buttons">
        <button onclick="createDatabase()">Create Database</button>
        <button onclick="deleteDatabase()">Delete Database</button>
        <button onclick="showGraphPage()">Show Graph</button>
    </div>

    <script>
        // Function to create the 'methane' database
        function createDatabase() {
            fetch('/create-db', {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error creating database:', error));
        }

        // Function to delete the 'methane' database
        function deleteDatabase() {
            fetch('/delete-db', {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error deleting database:', error));
        }

        // Function to navigate to the graph page
        function showGraphPage() {
            window.location.href = '/graph.html';
        }
    </script>
</body>
</html>
