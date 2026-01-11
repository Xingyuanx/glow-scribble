const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, 'data.json');

// Initialize DB file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    entries: [],
    todos: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  console.log('Created new database file: data.json');
}

class JsonDB {
  constructor() {
    this.dbPath = DB_FILE;
  }

  _read() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading DB:', err);
      return { entries: [], todos: [] };
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error writing DB:', err);
    }
  }

  // Generic methods to mimic SQL-like operations
  
  // Get all items from a collection (table)
  getAll(collectionName) {
    const data = this._read();
    // Return a copy reversed (newest first) to mimic ORDER BY created_at DESC
    return (data[collectionName] || []).slice().reverse();
  }

  // Get all items for a specific user
  getAllByUser(collectionName, userId) {
    const data = this._read();
    const list = data[collectionName] || [];
    return list.filter(item => item.userId === userId).slice().reverse();
  }

  // Find one item matching a predicate
  findOne(collectionName, predicate) {
    const data = this._read();
    const list = data[collectionName] || [];
    return list.find(predicate);
  }

  // Add an item
  insert(collectionName, item) {
    const data = this._read();
    if (!data[collectionName]) data[collectionName] = [];
    
    const newItem = {
      id: Date.now(), // Simple ID generation
      ...item,
      created_at: new Date().toISOString()
    };
    
    data[collectionName].push(newItem);
    this._write(data);
    return newItem;
  }

  // Update an item
  update(collectionName, id, updates) {
    const data = this._read();
    const list = data[collectionName] || [];
    const index = list.findIndex(item => item.id == id); // loose equality for string/number id mismatch
    
    if (index === -1) return 0; // No changes
    
    list[index] = { ...list[index], ...updates };
    this._write(data);
    return 1; // 1 item changed
  }

  // Delete an item
  delete(collectionName, id) {
    const data = this._read();
    const list = data[collectionName] || [];
    const initialLength = list.length;
    
    data[collectionName] = list.filter(item => item.id != id);
    
    if (data[collectionName].length !== initialLength) {
      this._write(data);
      return 1; // 1 item deleted
    }
    return 0;
  }
}

module.exports = new JsonDB();
