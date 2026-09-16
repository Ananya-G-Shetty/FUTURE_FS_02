const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    source: {
      type: String,
      enum: ['Website Contact Form', 'LinkedIn', 'Referral', 'Organic Search', 'Campaign', 'Other'],
      default: 'Website Contact Form'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'lost'],
      default: 'new'
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    followUpDate: {
      type: String,
      default: ''
    },
    notes: [NoteSchema]
  },
  {
    timestamps: true
  }
);

// Virtual for id to match JSON representation
LeadSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    return ret;
  }
});

module.exports = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
