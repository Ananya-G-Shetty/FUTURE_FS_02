const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { initialLeads } = require('../data/seeds');

let isMongoConnected = false;

// File-based persistence paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Helper to ensure data directory and files exist
function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(LEADS_FILE)) {
    const seededLeads = initialLeads.map((lead, idx) => ({
      id: 'lead_' + (Date.now() - (idx * 3600000)) + '_' + Math.random().toString(36).substring(2, 6),
      ...lead
    }));
    fs.writeFileSync(LEADS_FILE, JSON.stringify(seededLeads, null, 2));
  }

  if (!fs.existsSync(USERS_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);
    const defaultUsers = [
      {
        id: 'usr_admin_default',
        name: 'Demo Admin',
        email: 'admin@crm.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
}

// File storage CRUD helpers
function readFileData(filePath) {
  try {
    ensureFiles();
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return [];
  }
}

function writeFileData(filePath, data) {
  try {
    ensureFiles();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err.message);
  }
}

// Unified Lead Store
const LeadStore = {
  async getAll({ search, status, source, sortBy = 'newest' } = {}) {
    if (isMongoConnected) {
      const Lead = require('../models/Lead');
      const query = {};
      if (status && status !== 'all') query.status = status;
      if (source && source !== 'all') query.source = source;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
      if (sortBy === 'name') sortOptions = { name: 1 };
      if (sortBy === 'followUp') sortOptions = { followUpDate: 1 };

      const leads = await Lead.find(query).sort(sortOptions);
      return leads.map(l => l.toJSON());
    } else {
      let leads = readFileData(LEADS_FILE);

      if (status && status !== 'all') {
        leads = leads.filter(l => l.status === status);
      }

      if (source && source !== 'all') {
        leads = leads.filter(l => l.source === source);
      }

      if (search) {
        const q = search.toLowerCase();
        leads = leads.filter(
          l =>
            (l.name && l.name.toLowerCase().includes(q)) ||
            (l.email && l.email.toLowerCase().includes(q)) ||
            (l.company && l.company.toLowerCase().includes(q)) ||
            (l.message && l.message.toLowerCase().includes(q))
        );
      }

      leads.sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'followUp') {
          if (!a.followUpDate) return 1;
          if (!b.followUpDate) return -1;
          return new Date(a.followUpDate) - new Date(b.followUpDate);
        }
        // default newest
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return leads;
    }
  },

  async getById(id) {
    if (isMongoConnected) {
      const Lead = require('../models/Lead');
      const lead = await Lead.findById(id);
      return lead ? lead.toJSON() : null;
    } else {
      const leads = readFileData(LEADS_FILE);
      return leads.find(l => l.id === id || l._id === id) || null;
    }
  },

  async create(leadData) {
    if (isMongoConnected) {
      const Lead = require('../models/Lead');
      const lead = new Lead(leadData);
      const saved = await lead.save();
      return saved.toJSON();
    } else {
      const leads = readFileData(LEADS_FILE);
      const newLead = {
        id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: leadData.name,
        email: leadData.email.toLowerCase(),
        phone: leadData.phone || '',
        company: leadData.company || '',
        source: leadData.source || 'Website Contact Form',
        status: leadData.status || 'new',
        message: leadData.message || '',
        followUpDate: leadData.followUpDate || '',
        notes: leadData.notes || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      leads.unshift(newLead);
      writeFileData(LEADS_FILE, leads);
      return newLead;
    }
  },

  async update(id, updateData) {
    if (isMongoConnected) {
      const Lead = require('../models/Lead');
      const updated = await Lead.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return updated ? updated.toJSON() : null;
    } else {
      const leads = readFileData(LEADS_FILE);
      const index = leads.findIndex(l => l.id === id || l._id === id);
      if (index === -1) return null;

      leads[index] = {
        ...leads[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      writeFileData(LEADS_FILE, leads);
      return leads[index];
    }
  },

  async delete(id) {
    if (isMongoConnected) {
      const Lead = require('../models/Lead');
      const res = await Lead.findByIdAndDelete(id);
      return !!res;
    } else {
      const leads = readFileData(LEADS_FILE);
      const filtered = leads.filter(l => l.id !== id && l._id !== id);
      if (filtered.length === leads.length) return false;
      writeFileData(LEADS_FILE, filtered);
      return true;
    }
  },

  async addNote(leadId, { content, author = 'Admin' }) {
    if (isMongoConnected) {
      const Lead = require('../models/Lead');
      const lead = await Lead.findById(leadId);
      if (!lead) return null;

      const newNote = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        content,
        author,
        createdAt: new Date()
      };

      lead.notes.push(newNote);
      lead.updatedAt = new Date();
      await lead.save();
      return lead.toJSON();
    } else {
      const leads = readFileData(LEADS_FILE);
      const lead = leads.find(l => l.id === leadId || l._id === leadId);
      if (!lead) return null;

      if (!lead.notes) lead.notes = [];
      const newNote = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        content,
        author,
        createdAt: new Date().toISOString()
      };

      lead.notes.push(newNote);
      lead.updatedAt = new Date().toISOString();
      writeFileData(LEADS_FILE, leads);
      return lead;
    }
  },

  async deleteNote(leadId, noteId) {
    if (isMongoConnected) {
      const Lead = require('../models/Lead');
      const lead = await Lead.findById(leadId);
      if (!lead) return null;

      lead.notes = lead.notes.filter(n => n.id !== noteId && n._id?.toString() !== noteId);
      lead.updatedAt = new Date();
      await lead.save();
      return lead.toJSON();
    } else {
      const leads = readFileData(LEADS_FILE);
      const lead = leads.find(l => l.id === leadId || l._id === leadId);
      if (!lead) return null;

      lead.notes = (lead.notes || []).filter(n => n.id !== noteId && n._id !== noteId);
      lead.updatedAt = new Date().toISOString();
      writeFileData(LEADS_FILE, leads);
      return lead;
    }
  },

  async getStats() {
    const allLeads = await this.getAll();
    const total = allLeads.length;
    const newCount = allLeads.filter(l => l.status === 'new').length;
    const contactedCount = allLeads.filter(l => l.status === 'contacted').length;
    const convertedCount = allLeads.filter(l => l.status === 'converted').length;
    const lostCount = allLeads.filter(l => l.status === 'lost').length;

    const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(1) : '0.0';

    // Source breakdown
    const sourceBreakdown = allLeads.reduce((acc, lead) => {
      const src = lead.source || 'Other';
      acc[src] = (acc[src] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      new: newCount,
      contacted: contactedCount,
      converted: convertedCount,
      lost: lostCount,
      conversionRate: parseFloat(conversionRate),
      sourceBreakdown
    };
  }
};

// Unified User Store
const UserStore = {
  async findByEmail(email) {
    if (isMongoConnected) {
      const User = require('../models/User');
      return await User.findOne({ email: email.toLowerCase() });
    } else {
      const users = readFileData(USERS_FILE);
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async findById(id) {
    if (isMongoConnected) {
      const User = require('../models/User');
      const user = await User.findById(id).select('-password');
      return user ? user.toJSON() : null;
    } else {
      const users = readFileData(USERS_FILE);
      const user = users.find(u => u.id === id || u._id === id);
      if (!user) return null;
      const { password, ...safeUser } = user;
      return safeUser;
    }
  },

  async create({ name, email, password, role = 'admin' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isMongoConnected) {
      const User = require('../models/User');
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role
      });
      await newUser.save();
      return newUser.toJSON();
    } else {
      const users = readFileData(USERS_FILE);
      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      writeFileData(USERS_FILE, users);
      const { password: _, ...safeUser } = newUser;
      return safeUser;
    }
  }
};

// Connect to Database
async function connectDB() {
  ensureFiles();

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini_crm';

  try {
    // Attempt connection with a short 2.5s serverSelectionTimeoutMS so we don't hang if no Mongo is running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`[Database] Successfully connected to MongoDB at ${mongoUri}`);

    // Seed admin if missing in MongoDB
    const User = require('../models/User');
    const existingAdmin = await User.findOne({ email: 'admin@crm.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Demo Admin',
        email: 'admin@crm.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('[Database] Seeded default Admin user in MongoDB: admin@crm.com / admin123');
    }

    // Seed leads if empty in MongoDB
    const Lead = require('../models/Lead');
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      await Lead.insertMany(initialLeads);
      console.log(`[Database] Seeded ${initialLeads.length} initial leads in MongoDB.`);
    }

  } catch (err) {
    isMongoConnected = false;
    console.log(`[Database] Notice: MongoDB server not reachable (${err.message}).`);
    console.log(`[Database] -> Using persistent JSON storage adapter in ./backend/data/`);
    console.log(`[Database] -> Default Admin seeded: admin@crm.com / admin123`);
    console.log(`[Database] -> All features, CRUD, and data persistence are 100% active and operational.`);
  }

  return { isMongoConnected };
}

module.exports = {
  connectDB,
  LeadStore,
  UserStore,
  getIsMongoConnected: () => isMongoConnected
};
