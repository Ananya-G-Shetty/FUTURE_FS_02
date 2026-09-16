# LeadPulse Mini CRM — Client Lead Management System
### Task 2: Full Stack Client Lead Management System (Mini CRM)

> A modern, responsive, and full-featured Client Lead Management System (Mini CRM) designed to capture, organize, and track client leads generated from website contact forms.

---

## 🌟 Key Highlights & Features

- **Lead Listing & Management**: View leads with Name, Email, Phone, Company, Source, Status, and Scheduled Follow-Up Dates.
- **Dynamic Status Lifecycle**: Real-time updates across stages: `NEW` ➔ `CONTACTED` ➔ `CONVERTED` ➔ `LOST` with visual indicators and automatic activity logging.
- **Notes & Follow-ups Timeline**: Add chronological timestamped notes, schedule follow-up dates, and maintain a complete communication history for each client lead.
- **Live Website Contact Form Demo**: An integrated interactive landing page contact form simulation that demonstrates real-time lead ingestion into the CRM.
- **Secure Admin Authentication**: JWT token-based authentication with bcrypt password hashing and 1-click demo sign-in.
- **Analytics & KPIs Dashboard**: Real-time metrics tracking Total Leads, New Inquiries, In Conversation, Converted Clients, and Conversion Rate %.
- **Search, Filter & Sort**: Instant live search by name, email, company, or note contents; filter by status or source; sort by newest, oldest, or follow-up dates.
- **Data Export**: One-click export of filtered leads to CSV format.
- **Design & Theme**: Glassmorphism UI, fluid micro-animations, fully responsive layout, and instant **Dark / Light Mode** switching.
- **Hybrid Database Layer**: Seamless MongoDB (Mongoose) support with built-in auto-detect persistent local fallback, allowing instant execution without requiring a local database daemon.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast component rendering and hot module reloading |
| **Styling** | Vanilla CSS Design System | Modern CSS variables, glassmorphism, responsive grid, dark/light modes |
| **Icons** | Lucide React | Clean, modern SVG iconography |
| **Backend** | Node.js + Express | RESTful API endpoints, validation, and business logic |
| **Authentication** | JWT (JSON Web Tokens) + Bcrypt | Secure password hashing and bearer token authorization |
| **Database** | MongoDB (Mongoose) + Persistent JSON Fallback | Robust data persistence with zero-configuration fallback |

---

## 📁 Project Architecture

```text
FUTURE_FS_02/
├── package.json                 # Root script runner for concurrent client/server execution
├── .gitignore                   # Ignored files and directories
├── .env.example                 # Root environment template
├── README.md                    # Project documentation
│
├── backend/                     # Node.js & Express API Server
│   ├── package.json
│   ├── server.js                # Express app, middleware, and route mounting
│   ├── config/
│   │   └── db.js                # Database connection (MongoDB + local fallback)
│   ├── controllers/
│   │   ├── authController.js    # Register, login, and profile
│   │   ├── leadController.js    # CRUD, status patch, notes, and stats
│   │   └── publicController.js  # Public website contact form ingestion
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authorization middleware
│   ├── models/
│   │   ├── Lead.js              # Mongoose Lead schema
│   │   └── User.js              # Mongoose User schema
│   └── data/
│       ├── seeds.js             # Initial realistic demo leads
│       ├── leads.json           # Persistent local store (when MongoDB is offline)
│       └── users.json           # User credentials store
│
└── frontend/                    # React + Vite Client Application
    ├── package.json
    ├── vite.config.js           # Vite dev server configuration and API proxy
    ├── index.html               # Entry HTML with custom fonts
    └── src/
        ├── index.css            # Complete design system & responsive styling
        ├── main.jsx             # React entry point with AuthProvider
        ├── App.jsx              # Main dashboard view switcher
        ├── context/
        │   └── AuthContext.jsx  # Authentication state & helpers
        ├── services/
        │   └── api.js           # Centralized API client
        └── components/
            ├── Navbar.jsx       # Header, navigation tabs, theme toggle & auth status
            ├── StatsOverview.jsx# KPI analytics cards
            ├── LeadTable.jsx    # Leads table with inline status change, filters, search, CSV
            ├── LeadDetailDrawer.jsx # Detail drawer with Notes & Follow-ups timeline
            ├── LeadModal.jsx    # Add / Edit lead modal
            ├── ContactFormDemo.jsx  # Simulated external website contact form
            ├── LoginModal.jsx   # Admin login modal with 1-click demo autofill
            └── Toast.jsx        # Notification popups
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher

### 2. Install Dependencies
Run the installation command from the project root:

```bash
npm run install:all
```

Or install in each directory individually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Start the Application
To run both backend and frontend concurrently with a single command:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Default Admin Credentials

The system seeds a default Administrator account out-of-the-box:

- **Email**: `admin@crm.com`
- **Password**: `admin123`

*(You can also use the **"Auto-Fill"** button inside the Admin Sign In dialog for one-click login).*

---

## 🗄️ Database Configuration (MongoDB & Local Storage)

By default, the backend automatically detects whether MongoDB is running.
- If **MongoDB** is running on `mongodb://localhost:27017/mini_crm` or a cloud MongoDB Atlas URI is provided via `MONGODB_URI` in `.env`, it connects using Mongoose schemas.
- If **no MongoDB server is running**, the backend automatically switches to its **local persistent JSON adapter** located in `backend/data/leads.json`. All CRUD features, notes, and status updates persist across server restarts without crashing.

To configure MongoDB, create a `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini_crm
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mini_crm?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_leadpulse_crm_2026
```

---

## 📡 REST API Documentation

### Public Endpoints

#### 1. Ingest Lead from Website Contact Form
- **Method**: `POST`
- **Endpoint**: `/api/public/contact`
- **Payload**:
```json
{
  "name": "Jane Cooper",
  "email": "jane@coopertech.com",
  "phone": "+1 (555) 345-6789",
  "company": "Cooper Tech",
  "message": "Interested in CRM enterprise licensing.",
  "source": "Website Contact Form"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Thank you! Your message has been received.",
  "leadId": "lead_178957..."
}
```

#### 2. Admin Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Payload**:
```json
{
  "email": "admin@crm.com",
  "password": "admin123"
}
```
- **Response**: `200 OK` (returns JWT `token` and `user` object).

---

### Lead Management Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leads` | List all leads (supports query params: `search`, `status`, `source`, `sortBy`) |
| `GET` | `/api/leads/:id` | Retrieve single lead details with full notes array |
| `POST` | `/api/leads` | Create a new lead manually in CRM |
| `PUT` | `/api/leads/:id` | Update lead contact details and company |
| `PATCH` | `/api/leads/:id/status` | Quick update status (`new`, `contacted`, `converted`, `lost`) |
| `POST` | `/api/leads/:id/notes` | Add a timestamped note and schedule follow-up |
| `DELETE`| `/api/leads/:id/notes/:noteId` | Delete a specific note |
| `DELETE`| `/api/leads/:id` | Delete a lead |
| `GET` | `/api/leads/stats/summary` | Retrieve dashboard KPI metrics |

---

## 🌐 External Website Form Integration

To connect any external website or landing page form to this CRM:

```javascript
// Example: Add this to your website's contact form submit handler
const form = document.querySelector('#contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    name: form.querySelector('[name="name"]').value,
    email: form.querySelector('[name="email"]').value,
    phone: form.querySelector('[name="phone"]').value,
    company: form.querySelector('[name="company"]').value,
    message: form.querySelector('[name="message"]').value,
    source: 'Website Contact Form'
  };

  const response = await fetch('http://localhost:5000/api/public/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (result.success) {
    alert('Thank you! Our sales team will reach out soon.');
  }
});
```

---

## 📦 Deliverable: Pushing to GitHub

To host this project on your GitHub profile:

1. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: Client Lead Management System (Mini CRM) with React, Node.js, Express & MongoDB"
   ```

2. **Link to your GitHub remote**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/client-lead-management-crm.git
   git push -u origin main
   ```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
