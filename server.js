const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

// 🔗 Standard URI — Note: mongodb.net ke baad ek dot (.) lagaya hai jo DNS resolve karwayega!
const mongoURI = "mongodb+srv://syedmuhammadqasimsajjad3_db_user:dA8zgkfJ6RqWL7sp@cluster0.jsgxpq2.mongodb.net./?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Cloud se connection fit ho gaya hai! 🔥"))
    .catch((err) => console.log("Database connection mein masla aya:", err));

let tasks = [];

app.get('/api/tasks', (req, res) => {
    res.send(tasks);
});

app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        priority: req.body.priority,
    };
    tasks.push(newTask);
    res.status(201).json({
        message: 'Task created!',
        task: newTask
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.json({ message: 'Task deleted successfully.' });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});