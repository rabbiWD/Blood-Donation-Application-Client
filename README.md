# Blood Donation Application 

A full-stack web application designed to connect blood donors with people in urgent need of blood. This platform allows users to create blood donation requests, browse active requests, volunteer to donate, and manage their own requests through a personalized dashboard.

**Live URL**: [https://blood-donation-applications.netlify.app](https://blood-donation-applications.netlify.app)  

**Backend API**: [https://blood-donation-application-server-phi.vercel.app](https://blood-donation-application-server-phi.vercel.app)

## Purpose

In emergencies, finding the right blood group quickly can save lives. This application bridges the gap between blood seekers and willing donors by providing an easy-to-use platform where:

- Anyone can post an urgent blood donation request with details (blood group, location, hospital, date/time).
- Registered users can browse requests and volunteer to donate.
- Users can manage their own requests (edit/delete if pending, view status).
- Admins can manage all users (block/unblock, change roles).

## Key Features

### Public Features
- View all active blood donation requests with filters (status, blood group, district)
- Detailed view of each request
- Responsive design (mobile, tablet, desktop friendly)
- Clean and intuitive UI using DaisyUI & Tailwind CSS

### User Features (after login)
- Create new blood donation request
- View and manage personal donation requests (edit/delete pending ones)
- Dashboard with recent requests overview
- Volunteer to donate (confirms donation and changes status to "In Progress")

### Admin Features
- Full user management (view all users, block/unblock, promote to volunteer/admin)
- Delete any donation request

### Technical Features
- Authentication with Firebase (email/password, Google login supported via useAuth hook)
- Protected routes (dashboard accessible only to logged-in users)
- Real-time status updates using optimistic UI and server sync
- Toast notifications for success/error feedback (react-hot-toast)
- Pagination for large lists
- Loading states and error handling

## Technologies & NPM Packages Used

### Frontend (React + Vite)
- `react` & `react-dom` – Core library
- `react-router-dom` – Client-side routing
- `axios` – HTTP requests to backend
- `react-hot-toast` – Beautiful toast notifications
- `react-helmet` – Dynamic page titles
- `daisyui` – Tailwind CSS component library (used for buttons, cards, modals, tables, etc.)
- `tailwindcss` – Utility-first CSS framework
- Custom hook: `useAuth` – Centralized Firebase authentication management

### Backend (Node.js + Express + MongoDB) *(separate repo)*
- Express server with MongoDB (Mongoose)
- RESTful APIs for CRUD operations on donation requests and users
- Role-based access (admin, volunteer, donor)

### Deployment
- Frontend: Vercel
- Backend: Vercel (serverless functions)

## Project Structure (Frontend)
src/
├── components/     # Reusable components (Navbar, Container, etc.)
├── hooks/          # Custom hooks (useAuth)
├── pages/          # Public pages (Home, Donation Requests)
├── dashboard/      # Protected dashboard pages
│   ├── AllUsers.jsx
│   ├── DashboardHome.jsx
│   ├── MyDonationRequests.jsx
│   └── ...
├── App.jsx
├── main.jsx
└── ...
text## How to Run Locally

1. Clone the frontend repository
2. Install dependencies:
   ```bash
   npm install

Set up environment variables (if needed for Firebase config in useAuth)
Run the development server:Bashnpm run dev

The backend must be running separately for full functionality.
Future Improvements (Ideas)

Add search functionality by recipient name or hospital
Email/SMS notifications for donors and requesters
Blood donor search by location and blood group
Blog section for awareness


Made with ❤️ to save lives through technology.
Thank you for using the Blood Donation Application!
Every donation counts — be a hero today.