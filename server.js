const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Frontend files serve karne ke liye perfect tareeqa
app.use(express.static(path.join(__dirname, '.')));

// 🔗 MongoDB Connection String
const mongoURI = "mongodb+srv://syedmuhammadqasimsajjad3_db_user:dA8zgkfJ6RqWL7sp@cluster0.jsgxpq2.mongodb.net/task_manager?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Cloud se connection fit ho gaya hai! 🔥"))
    .catch((err) => console.log("Database connection mein masla aya:", err));

// 📝 MongoDB Task Schema aur Model (Kachra Array ki jagah Real DB!)
const TaskSchema = new mongoose.Schema({
    title: String,
    priority: String
});
const Task = mongoose.model('Task', TaskSchema);

// 🌍 Main Route (Frontend file explicitly serve karne ke liye)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔄 API Routes (Real MongoDB ke sath)
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            priority: req.body.priority,
        });
        await newTask.save();
        res.status(201).json({ message: 'Task created!', task: newTask });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});