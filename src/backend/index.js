const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = 5175;

// Middleware
app.use(cors({
  origin: 'http://localhost:5174', // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Glow Scribble Backend!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connection successful!', timestamp: new Date() });
});

// --- Diary Entries Routes ---

// Get all entries
app.get('/api/entries', (req, res) => {
  try {
    const rows = db.getAll('entries');
    res.json({
      message: 'success',
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new entry
app.post('/api/entries', (req, res) => {
  try {
    const { content, mood } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }
    
    const newItem = db.insert('entries', { content, mood });
    res.json({
      message: 'success',
      data: newItem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an entry
app.delete('/api/entries/:id', (req, res) => {
  try {
    const changes = db.delete('entries', req.params.id);
    res.json({ message: 'deleted', changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Todo List Routes ---

// Get all todos
app.get('/api/todos', (req, res) => {
  try {
    const rows = db.getAll('todos');
    res.json({
      message: 'success',
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new todo
app.post('/api/todos', (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      res.status(400).json({ error: 'Task is required' });
      return;
    }
    
    const newItem = db.insert('todos', { task, completed: 0 });
    res.json({
      message: 'success',
      data: newItem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update todo status (toggle completion)
app.put('/api/todos/:id', (req, res) => {
  try {
    const { completed } = req.body;
    const changes = db.update('todos', req.params.id, { completed });
    res.json({ message: 'updated', changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const changes = db.delete('todos', req.params.id);
    res.json({ message: 'deleted', changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
