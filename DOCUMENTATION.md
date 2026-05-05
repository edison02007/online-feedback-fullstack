# Online Feedback Management System — Full Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Frontend Documentation](#5-frontend-documentation)
   - 5.1 [App Entry Point](#51-app-entry-point)
   - 5.2 [Context Providers](#52-context-providers)
   - 5.3 [Components](#53-components)
   - 5.4 [Pages](#54-pages)
   - 5.5 [Routing](#55-routing)
   - 5.6 [Styling & Theming](#56-styling--theming)
6. [Backend Documentation](#6-backend-documentation)
   - 6.1 [Server Entry Point](#61-server-entry-point)
   - 6.2 [Database Model](#62-database-model)
   - 6.3 [Middleware](#63-middleware)
   - 6.4 [API Endpoints](#64-api-endpoints)
   - 6.5 [Controllers](#65-controllers)
7. [API Reference](#7-api-reference)
8. [Data Flow](#8-data-flow)
9. [Error Handling](#9-error-handling)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Project Overview

The **Online Feedback Management System** is a full-stack web application that allows users to submit feedback and enables administrators to manage, analyze, and respond to that feedback through a professional dashboard.

### Key Objectives
- Replace manual or paper-based feedback collection with a digital solution
- Provide a clean, user-friendly form for submitting feedback
- Give administrators a powerful dashboard to view, filter, search, and analyze feedback
- Store all data reliably in a MongoDB database
- Deliver a responsive, accessible UI with dark mode support

### Core Features

| Feature | Description |
|---|---|
| Feedback Submission | Form with name, email, type, star rating, tags, message, file upload |
| Form Validation | Client-side validation with toast notifications |
| Admin Dashboard | Table view with search, filter, sort, edit, delete, and detail view |
| Analytics | Pie chart (by type), bar chart (rating distribution), summary stats |
| Dark Mode | Toggle between light and dark themes, persisted in localStorage |
| Responsive Design | Mobile, tablet, and desktop layouts |
| Toast Notifications | Non-blocking success/error/info messages |
| File Upload | Screenshot attachment support (images only, max 2MB) |
| RESTful API | 6 dedicated endpoints, each in its own controller file |

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2.0 | UI library |
| Vite | 5.0.0 | Build tool and dev server |
| React Router DOM | 6.20.0 | Client-side routing |
| Recharts | Latest | Analytics charts |
| CSS Variables | — | Theming (light/dark mode) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | JavaScript runtime |
| Express.js | 4.18.2 | Web framework |
| MongoDB | — | NoSQL database |
| Mongoose | 8.0.3 | MongoDB ODM |
| Multer | 1.4.5-lts | File upload handling |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 16.3.1 | Environment variables |
| express-validator | 7.0.1 | Request validation |
| nodemon | 3.0.2 | Dev auto-restart |

---

## 3. Project Structure

```
fsd/
├── frontend/                        # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   └── StarRating.jsx       # Reusable star rating component
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx      # Dark/light mode global state
│   │   │   └── ToastContext.jsx      # Toast notification global state
│   │   ├── pages/
│   │   │   ├── FeedbackForm.jsx      # Feedback submission page
│   │   │   ├── AdminDashboard.jsx    # Admin management page
│   │   │   └── FeedbackDetail.jsx    # Single feedback detail page
│   │   ├── App.jsx                   # Root component with routing
│   │   ├── index.jsx                 # React DOM entry point
│   │   └── index.css                 # Global styles + CSS variables
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── vercel.json
│
└── backend/                          # Node.js + Express backend
    ├── controllers/
    │   ├── submitFeedback.js         # POST   /api/feedback
    │   ├── getAllFeedback.js          # GET    /api/feedback
    │   ├── getFeedbackById.js         # GET    /api/feedback/:id
    │   ├── updateFeedback.js          # PUT    /api/feedback/:id
    │   ├── deleteFeedback.js          # DELETE /api/feedback/:id
    │   └── getAnalytics.js            # GET    /api/feedback/analytics
    ├── middleware/
    │   ├── upload.js                  # Multer file upload config
    │   └── errorHandler.js            # Global error handler
    ├── models/
    │   └── Feedback.js                # Mongoose schema & model
    ├── routes/
    │   └── feedback.js                # All route definitions
    ├── uploads/                       # Uploaded files stored here
    ├── .env                           # Environment variables
    ├── .gitignore
    ├── package.json
    └── server.js                      # Express app entry point
```

---

## 4. Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

### Step 1 — Clone or navigate to the project
```bash
cd fsd
```

### Step 2 — Setup and run the Backend
```bash
cd backend
npm install
```

Edit the `.env` file with your MongoDB connection:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/feedbackdb
```

Start the backend server:
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

### Step 3 — Setup and run the Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Step 4 — Verify the connection
Open your browser and visit:
- Frontend: `http://localhost:5173`
- API Health Check: `http://localhost:5000`

---

## 5. Frontend Documentation

### 5.1 App Entry Point

**`src/index.jsx`**
The React DOM entry point. Mounts the root App component into the `#root` div in `index.html`.

**`src/App.jsx`**
The root component that wraps the entire application with:
- `ThemeProvider` — provides dark/light mode context
- `ToastProvider` — provides toast notification context
- `BrowserRouter` — enables client-side routing
- `Navbar` — persistent top navigation
- `Routes` — defines all page routes

---

### 5.2 Context Providers

#### ThemeContext (`src/context/ThemeContext.jsx`)
Manages the global dark/light mode state.

| Export | Type | Description |
|---|---|---|
| `ThemeProvider` | Component | Wraps the app, sets `data-theme` attribute on `<html>` |
| `useTheme` | Hook | Returns `{ dark, toggle }` |

- Theme is persisted in `localStorage` under the key `theme`
- CSS variables in `index.css` respond to `[data-theme='dark']` selector

#### ToastContext (`src/context/ToastContext.jsx`)
Manages global toast notifications displayed at the bottom-right of the screen.

| Export | Type | Description |
|---|---|---|
| `ToastProvider` | Component | Wraps the app, renders the toast container |
| `useToast` | Hook | Returns `{ addToast }` |

**Usage:**
```jsx
const { addToast } = useToast();
addToast('Feedback submitted!', 'success'); // types: success, error, info
```

Toasts auto-dismiss after **3.5 seconds**.

---

### 5.3 Components

#### Navbar (`src/components/Navbar.jsx`)
Sticky top navigation bar with:
- Brand logo and title "FeedbackPro"
- Navigation links: Home (`/`) and Admin Dashboard (`/admin`)
- Active link highlighting using React Router's `NavLink`
- Dark mode toggle button (☀️ / 🌙)
- Hamburger menu for mobile screens

#### StarRating (`src/components/StarRating.jsx`)
Reusable interactive 5-star rating component.

| Prop | Type | Description |
|---|---|---|
| `value` | Number | Currently selected rating (1–5) |
| `onChange` | Function | Callback when a star is clicked |

- Hover effect scales the star up
- Filled stars shown in amber (#f59e0b)
- Label shows text: Poor / Fair / Good / Very Good / Excellent

---

### 5.4 Pages

#### FeedbackForm (`src/pages/FeedbackForm.jsx`)
The main public-facing page where users submit feedback.

**Form Fields:**

| Field | Type | Required | Validation |
|---|---|---|---|
| Full Name | Text input | Yes | Must not be empty |
| Email Address | Email input | Yes | Must match email regex |
| Feedback Type | Select dropdown | Yes | general / bug / suggestion / compliment |
| Overall Rating | Star rating | Yes | Must select 1–5 stars |
| Category Tags | Toggle buttons | No | UI, Performance, Bug, Suggestion, Feature, Other |
| Message | Textarea | Yes | Max 500 characters |
| Screenshot | File input | No | Images only, max 2MB |

**State:**
- `form` — holds all field values
- `loading` — shows spinner during submission
- `errors` — field-level error messages

**Behavior:**
- Validates all required fields before submission
- Shows toast error if validation fails
- Shows loading spinner for 1 second (simulates API call)
- Saves to `localStorage` (temporary until backend integration)
- Resets form and shows success toast on completion
- Character counter turns red when message exceeds 500 characters

---

#### AdminDashboard (`src/pages/AdminDashboard.jsx`)
The admin management page with two tabs: Feedback Table and Analytics.

**Feedback Table Tab:**

| Feature | Description |
|---|---|
| Search | Filters by name, email, or message (case-insensitive) |
| Type Filter | Filter by general / bug / suggestion / compliment |
| Rating Filter | Filter by exact star rating (1–5) |
| Sort | Newest first / Oldest first / Highest rating / Lowest rating |
| View | Navigates to FeedbackDetail page |
| Edit | Opens inline modal to edit the message |
| Delete | Confirms then removes from localStorage |
| Refresh | Reloads data from localStorage |

**Analytics Tab:**

| Chart | Description |
|---|---|
| Pie Chart | Feedback distribution by type |
| Bar Chart | Rating distribution (1★ to 5★) |
| Summary Grid | Total, avg rating, bug count, suggestion count, compliment count, general count |

**State:**
- `feedbacks` — full list from localStorage
- `search`, `typeFilter`, `ratingFilter`, `sortBy` — filter/sort controls
- `editId`, `editMsg` — inline edit modal state
- `tab` — active tab (table or analytics)

---

#### FeedbackDetail (`src/pages/FeedbackDetail.jsx`)
Displays the full details of a single feedback entry.

**Accessed via:** `/feedback/:id`

**Displays:**
- Name, email, type badge
- Submission date and time
- Star rating (visual)
- Category tags
- Attached file name (if any)
- Full message

Includes a "← Back to Dashboard" button that navigates to `/admin`.
Shows a "not found" state if the ID doesn't match any stored feedback.

---

### 5.5 Routing

| Path | Component | Description |
|---|---|---|
| `/` | FeedbackForm | Feedback submission form |
| `/admin` | AdminDashboard | Admin management dashboard |
| `/feedback/:id` | FeedbackDetail | Single feedback detail view |

---

### 5.6 Styling & Theming

All styles are in `src/index.css` using CSS custom properties (variables).

**Light Mode Variables:**
```css
--bg: #f0f4ff
--card: #ffffff
--text: #1e293b
--text-muted: #64748b
--border: #e2e8f0
--primary: #2563eb
```

**Dark Mode Variables (applied via `[data-theme='dark']`):**
```css
--bg: #0f172a
--card: #1e293b
--text: #f1f5f9
--text-muted: #94a3b8
--border: #334155
```

**Animations:**
- `fadeSlideIn` — cards and table rows fade in from below on mount
- `toastIn` — toasts slide in from the right
- `spin` — loading spinner rotation

**Responsive Breakpoints:**
- `768px` — hamburger menu, single-column form, 2-column stats
- `480px` — 2-column stats, full-width toasts

---

## 6. Backend Documentation

### 6.1 Server Entry Point (`server.js`)

Initializes the Express application with:

| Middleware | Purpose |
|---|---|
| `cors` | Allows requests from `http://localhost:5173` |
| `express.json()` | Parses JSON request bodies |
| `express.urlencoded()` | Parses form data |
| `/uploads` static | Serves uploaded files publicly |

**Startup sequence:**
1. Load environment variables from `.env`
2. Connect to MongoDB via Mongoose
3. Start Express server on configured PORT
4. Exit process if MongoDB connection fails

---

### 6.2 Database Model (`models/Feedback.js`)

**Collection name:** `feedbacks`

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | String | Yes | Max 100 chars, trimmed |
| `email` | String | Yes | Valid email format, lowercase |
| `type` | String | No | Enum: general, bug, suggestion, compliment. Default: general |
| `rating` | Number | Yes | Min: 1, Max: 5 |
| `tags` | [String] | No | Array of strings. Default: [] |
| `message` | String | Yes | Max 500 chars, trimmed |
| `file` | String | No | Stored filename. Default: null |
| `status` | String | No | Enum: new, reviewed, resolved. Default: new |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

---

### 6.3 Middleware

#### upload.js
Multer configuration for handling file uploads.

| Setting | Value |
|---|---|
| Storage | Disk storage in `uploads/` folder |
| Filename | `{timestamp}-{random}.{ext}` |
| Allowed types | jpeg, jpg, png, gif, webp |
| Max file size | 2MB (2 × 1024 × 1024 bytes) |

Used as `upload.single('file')` on the POST route.

#### errorHandler.js
Global Express error handling middleware (4-argument function).

| Error Type | HTTP Status | Behavior |
|---|---|---|
| Mongoose ValidationError | 400 | Returns all validation messages joined |
| Mongoose Duplicate Key (11000) | 400 | Returns duplicate field message |
| Mongoose CastError | 404 | Returns "Resource not found" |
| All other errors | 500 | Returns error message or "Internal Server Error" |

---

### 6.4 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Controller | Description |
|---|---|---|---|
| GET | `/feedback/analytics` | getAnalytics | Get analytics data |
| POST | `/feedback` | submitFeedback | Submit new feedback |
| GET | `/feedback` | getAllFeedback | Get all feedback (with filters) |
| GET | `/feedback/:id` | getFeedbackById | Get single feedback by ID |
| PUT | `/feedback/:id` | updateFeedback | Update feedback message/status |
| DELETE | `/feedback/:id` | deleteFeedback | Delete feedback and its file |

> Note: `/analytics` is registered before `/:id` in the router to prevent route conflict.

---

### 6.5 Controllers

#### submitFeedback.js — `POST /api/feedback`
Creates a new feedback document in MongoDB.

**Request:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| name | string | Yes |
| email | string | Yes |
| type | string | No |
| rating | number | Yes |
| tags | JSON string or array | No |
| message | string | Yes |
| file | image file | No |

**Response `201`:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": { ...feedbackObject }
}
```

---

#### getAllFeedback.js — `GET /api/feedback`
Returns a paginated, filtered, and sorted list of feedback.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| search | string | — | Search name, email, message |
| type | string | all | Filter by feedback type |
| rating | number | all | Filter by exact rating |
| sortBy | string | date-desc | date-desc / date-asc / rating-desc / rating-asc |
| page | number | 1 | Page number |
| limit | number | 20 | Results per page |

**Response `200`:**
```json
{
  "success": true,
  "total": 42,
  "page": 1,
  "pages": 3,
  "data": [ ...feedbackArray ]
}
```

---

#### getFeedbackById.js — `GET /api/feedback/:id`
Returns a single feedback document by its MongoDB ObjectId.

**Response `200`:**
```json
{
  "success": true,
  "data": { ...feedbackObject }
}
```

**Response `404`:**
```json
{
  "success": false,
  "error": "Feedback not found"
}
```

---

#### updateFeedback.js — `PUT /api/feedback/:id`
Updates the `message` and/or `status` fields of a feedback document.

**Request Body (JSON):**
```json
{
  "message": "Updated message text",
  "status": "reviewed"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Feedback updated successfully",
  "data": { ...updatedFeedbackObject }
}
```

---

#### deleteFeedback.js — `DELETE /api/feedback/:id`
Deletes a feedback document and removes its associated uploaded file from disk.

**Response `200`:**
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

---

#### getAnalytics.js — `GET /api/feedback/analytics`
Returns aggregated analytics data using MongoDB aggregation pipelines.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "avgRating": 4.2,
    "byType": [
      { "name": "general", "value": 15 },
      { "name": "bug", "value": 10 },
      { "name": "suggestion", "value": 12 },
      { "name": "compliment", "value": 5 }
    ],
    "ratingDistribution": [
      { "rating": "1★", "count": 2 },
      { "rating": "2★", "count": 4 },
      { "rating": "3★", "count": 8 },
      { "rating": "4★", "count": 14 },
      { "rating": "5★", "count": 14 }
    ],
    "byStatus": [
      { "status": "new", "count": 30 },
      { "status": "reviewed", "count": 8 },
      { "status": "resolved", "count": 4 }
    ]
  }
}
```

---

## 7. API Reference

### Complete Endpoint Summary

```
GET    http://localhost:5000/                          → Health check
GET    http://localhost:5000/api/feedback/analytics    → Analytics data
POST   http://localhost:5000/api/feedback              → Submit feedback
GET    http://localhost:5000/api/feedback              → Get all feedback
GET    http://localhost:5000/api/feedback/:id          → Get one feedback
PUT    http://localhost:5000/api/feedback/:id          → Update feedback
DELETE http://localhost:5000/api/feedback/:id          → Delete feedback
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | OK — Request succeeded |
| 201 | Created — New resource created |
| 400 | Bad Request — Validation failed |
| 404 | Not Found — Resource doesn't exist |
| 500 | Internal Server Error — Unexpected failure |

### Standard Response Format

All responses follow this structure:
```json
{
  "success": true | false,
  "message": "Optional message string",
  "error": "Error description (on failure)",
  "data": { } | [ ]
}
```

---

## 8. Data Flow

### Feedback Submission Flow
```
User fills form (FeedbackForm.jsx)
  → Client-side validation (validate function)
  → If invalid: toast error shown, stop
  → If valid: loading spinner shown
  → POST /api/feedback (multipart/form-data)
  → upload.js middleware handles file
  → submitFeedback controller saves to MongoDB
  → 201 response returned
  → Success toast shown, form reset
```

### Admin Dashboard Flow
```
Admin opens /admin (AdminDashboard.jsx)
  → GET /api/feedback (with query params)
  → getAllFeedback controller queries MongoDB
  → Results displayed in table
  → Admin can search/filter/sort (re-queries API)
  → Admin clicks 👁 → navigates to /feedback/:id
  → Admin clicks ✏️ → edit modal opens → PUT /api/feedback/:id
  → Admin clicks 🗑 → confirm → DELETE /api/feedback/:id
  → Admin clicks Analytics tab → GET /api/feedback/analytics
  → Charts rendered with Recharts
```

---

## 9. Error Handling

### Frontend
- Form validation runs before any API call
- Toast notifications display all errors to the user
- File size checked client-side before upload (max 2MB)
- Email format validated with regex

### Backend
- Mongoose schema enforces data types and constraints
- Global `errorHandler` middleware catches all unhandled errors
- Specific handling for ValidationError, CastError, and duplicate key errors
- 404 handler catches all undefined routes
- All controllers use try/catch and pass errors to `next(err)`

---

## 10. Future Enhancements

| Feature | Description |
|---|---|
| Backend Integration | Replace localStorage with real API calls in the frontend |
| Authentication | JWT-based login for admin dashboard access |
| Email Notifications | Send confirmation email on feedback submission |
| Pagination UI | Add page controls to the admin table |
| Export to CSV | Allow admin to download feedback as CSV |
| Status Management | Admin can mark feedback as reviewed or resolved |
| AI Sentiment Analysis | Automatically classify feedback tone |
| Role-Based Access | Multiple admin roles with different permissions |
| MongoDB Atlas | Cloud database deployment |
| Rate Limiting | Prevent spam submissions |
