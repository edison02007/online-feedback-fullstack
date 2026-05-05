# Feedback Form System - Frontend

## Setup Instructions

1. Install dependencies:
```
cd frontend
npm install
```

2. Start the development server:
```
npm start
```

3. Open http://localhost:3000 in your browser

## Features

- **Feedback Form**: Users can submit feedback with name, email, type, and message
- **Admin Dashboard**: View all feedback, filter by type, and delete entries
- **Temporary Storage**: Uses localStorage until backend is integrated

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── FeedbackForm.js
│   │   └── AdminDashboard.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Next Steps

- Integrate with backend API
- Add authentication for admin dashboard
- Implement advanced filtering and search
