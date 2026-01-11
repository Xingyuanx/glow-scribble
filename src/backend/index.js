const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { authMiddleware, SECRET_KEY } = require('./auth');

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

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = db.findOne('users', u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.insert('users', { username, password: hashedPassword });

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '24h' });

    res.json({
      message: 'success',
      token,
      user: { id: newUser.id, username: newUser.username, avatar: '😎' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.findOne('users', u => u.username === username);
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });

    res.json({
      message: 'success',
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        bio: user.bio || '', 
        tags: user.tags || [],
        avatar: user.avatar || '😎'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', authMiddleware, (req, res) => {
  try {
    const { bio, tags, avatar } = req.body;
    const updates = {};
    
    if (bio !== undefined) {
      if (typeof bio !== 'string') {
        return res.status(400).json({ error: 'Bio must be a string' });
      }
      updates.bio = bio;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array' });
      }
      updates.tags = tags;
    }

    if (avatar !== undefined) {
      if (typeof avatar !== 'string') {
        return res.status(400).json({ error: 'Avatar must be a string' });
      }
      updates.avatar = avatar;
    }

    db.update('users', req.user.id, updates);
    
    // Return updated user info
    const updatedUser = db.findOne('users', u => u.id === req.user.id);
    
    res.json({
      message: 'success',
      user: { 
        id: updatedUser.id, 
        username: updatedUser.username, 
        bio: updatedUser.bio,
        tags: updatedUser.tags || [],
        avatar: updatedUser.avatar || '😎'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Diary Entries Routes (Protected) ---

// Get all entries for current user
app.get('/api/entries', authMiddleware, (req, res) => {
  try {
    const rows = db.getAllByUser('entries', req.user.id);
    res.json({
      message: 'success',
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new entry
app.post('/api/entries', authMiddleware, (req, res) => {
  try {
    const { content, mood } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }
    
    const newItem = db.insert('entries', { 
      content, 
      mood, 
      userId: req.user.id 
    });
    
    res.json({
      message: 'success',
      data: newItem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an entry
app.delete('/api/entries/:id', authMiddleware, (req, res) => {
  try {
    const item = db.findOne('entries', i => i.id == req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const changes = db.delete('entries', req.params.id);
    res.json({ message: 'deleted', changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Todo List Routes (Protected) ---

// Get all todos for current user
app.get('/api/todos', authMiddleware, (req, res) => {
  try {
    const rows = db.getAllByUser('todos', req.user.id);
    res.json({
      message: 'success',
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new todo
app.post('/api/todos', authMiddleware, (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      res.status(400).json({ error: 'Task is required' });
      return;
    }
    
    const newItem = db.insert('todos', { 
      task, 
      completed: 0,
      userId: req.user.id
    });
    
    res.json({
      message: 'success',
      data: newItem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update todo status (toggle completion)
app.put('/api/todos/:id', authMiddleware, (req, res) => {
  try {
    const item = db.findOne('todos', i => i.id == req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { completed } = req.body;
    const changes = db.update('todos', req.params.id, { completed });
    res.json({ message: 'updated', changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete('/api/todos/:id', authMiddleware, (req, res) => {
  try {
    const item = db.findOne('todos', i => i.id == req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const changes = db.delete('todos', req.params.id);
    res.json({ message: 'deleted', changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Habit Tracker Routes (Protected) ---

// Get all habits for current user
app.get('/api/habits', authMiddleware, (req, res) => {
  try {
    const rows = db.getAllByUser('habits', req.user.id);
    res.json({
      message: 'success',
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new habit
app.post('/api/habits', authMiddleware, (req, res) => {
  try {
    const { name, icon, color } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Habit name is required' });
      return;
    }
    
    const newItem = db.insert('habits', { 
      name,
      icon: icon || '🌱',
      color: color || 'bg-[#7FBC8C]',
      streak: 0,
      lastCompleted: null,
      prevStreak: null,
      prevLastCompleted: null,
      userId: req.user.id
    });
    
    res.json({
      message: 'success',
      data: newItem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update habit (check-in/toggle)
app.put('/api/habits/:id/checkin', authMiddleware, (req, res) => {
  try {
    const item = db.findOne('habits', i => i.id == req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const today = new Date().toISOString().split('T')[0];
    let updates = {};

    if (item.lastCompleted === today) {
      // Toggle OFF: Restore previous state
      updates = {
        streak: item.prevStreak ?? 0,
        lastCompleted: item.prevLastCompleted ?? null,
        prevStreak: null,
        prevLastCompleted: null
      };
    } else {
      // Toggle ON
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = item.streak;
      if (item.lastCompleted === yesterdayStr) {
        newStreak++;
      } else {
        newStreak = 1; // Reset or start new streak
      }

      updates = {
        prevStreak: item.streak,
        prevLastCompleted: item.lastCompleted,
        streak: newStreak,
        lastCompleted: today
      };
    }

    db.update('habits', req.params.id, updates);
    
    // Return updated item
    const updatedItem = db.findOne('habits', i => i.id == req.params.id);
    res.json({ message: 'success', data: updatedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a habit
app.delete('/api/habits/:id', authMiddleware, (req, res) => {
  try {
    const item = db.findOne('habits', i => i.id == req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const changes = db.delete('habits', req.params.id);
    res.json({ message: 'deleted', changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
