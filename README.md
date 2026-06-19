# CloudVault

A secure, production-ready cloud-based file storage and sharing platform (Mini Google Drive).

## Features

- **Modern SaaS Dashboard**: Built with React, Vite, and Tailwind CSS using a sleek Glassmorphism design.
- **File Management**: Drag-and-drop file upload, list, rename, delete, and download.
- **Folder Organization**: Create folders, organize files.
- **AWS S3 Integration**: Files are securely stored directly in AWS S3 buckets.
- **File Sharing**: Generate share links with optional expiration and download limits.
- **Storage Analytics**: Visual representation of your storage usage using Recharts.
- **Admin Panel**: Monitor total users, storage, and activity.
- **Security**: JWT Authentication, bcrypt password hashing, CORS, Helmet.

## Tech Stack

**Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Recharts, React Dropzone, Lucide Icons.
**Backend**: Node.js, Express, MongoDB, Mongoose, AWS SDK v3 S3, Multer.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas Account / Cluster
- AWS Account (S3 Bucket & IAM User with programmatic access)

### Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`: `cp ../.env.example .env`
4. Fill in your `MONGO_URI`, `JWT_SECRET`, and `AWS_*` variables in the `.env` file.
5. Start the dev server: `npm run dev` (Runs on port 5000)

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

Open your browser to `http://localhost:5173` to see the app.
