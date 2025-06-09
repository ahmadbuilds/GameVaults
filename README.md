# GameVaults

**GameVaults** is a full-stack gaming platform that allows users to discover, manage, and share their favorite games seamlessly. Built with a React/Next.js frontend and a Node.js/MongoDB backend, it provides robust user authentication, game uploads with Cloudinary integration, and an interactive dashboard for managing content.

---

## Features

* **User Authentication**: Secure user management leveraging Clerk for robust authentication flows.

* **Game Management**: Upload and manage games, including associated images, with seamless Cloudinary integration for file storage.

* **Modern UI**: A responsive and intuitive user interface built with React/Next.js and styled with Tailwind CSS, ensuring a smooth experience across devices.

* **RESTful API**: A powerful backend developed with Node.js and Express.js, providing a secure and scalable API.

* **Data Persistence**: Utilizes MongoDB Atlas as the primary database for efficient and reliable data storage.

* **Secure Configuration**: Environment variables are handled securely to protect sensitive credentials.

* **Scalable Architecture**: Designed with scalability in mind, allowing for easy expansion and future enhancements.

---

## Tech Stack

| **Layer** | **Technology** |
| :-------- | :------------- |
| Frontend | React, Next.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | Clerk.dev |
| File Upload | Cloudinary |
| Version Control | Git & GitHub |

---

## Setup Instructions

To get GameVaults up and running on your local machine, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v14 or above)

* **npm** or **yarn** (Node.js package manager)

* **MongoDB Atlas account** (or your own local MongoDB instance with a connection URI)

* **Cloudinary account** (for image storage)

* **Clerk.dev account** (for authentication services)

* **Git** (for version control)

### 1. Clone the repository

Start by cloning the GameVaults repository to your local machine using Git:

```bash
git clone (https://github.com/ahmadbuilds/GameVaults.git)
cd GameVaults
```
### 2. Backend Setup
Navigate into the backend directory:

```Bash

cd backend
Install Dependencies
```

Install all required Node.js packages for the backend:

```Bash

npm install
# or if you prefer yarn
# yarn install
```
Create .env File

Create a file named .env in the backend folder. This file will securely store all sensitive environment variables required for your backend to function correctly.

Open the .env file and add the following variables, replacing the placeholder values with your actual credentials obtained from your service providers (MongoDB Atlas, Cloudinary):

```Bash
# Backend server port
PORT=4000

# MongoDB connection string (replace <username>, <password>, <dbname> with your details)
DB_CONNECT="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority"

# MongoDB password (optional, if not included directly in DB_CONNECT URI for some configurations)
DB_PASSWORD=<your_mongodb_password>

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
CLOUDINARY_UPLOAD_PRESET=<your_cloudinary_upload_preset>
Run the Backend Server
```

Once your .env file is configured, you can start the backend server:

```Bash

npm start
# or
# node server.js
```
The server should now be running on http://localhost:4000 (or your specified PORT).

### 3. Frontend Setup
Navigate into the frontend (or client, depending on your project structure) directory. Assuming it's frontend:

```Bash

cd ../frontend
Install Dependencies
```
Install all required Node.js packages for the frontend:

```Bash

npm install
# or if you prefer yarn
# yarn install
```
Create .env File

For Next.js applications, environment variables for the frontend are typically stored in a .env.local file at the root of the frontend directory.

Create a file named .env and add the following variables, replacing the placeholder values with your actual credentials:

```Bash
# Clerk.dev Public API Key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>

# Clerk.dev Secret Key
CLERK_SECRET_KEY=<your_clerk_secret_key>

# Clerk.dev redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=<your_clerk_sign_in_url>
NEXT_PUBLIC_CLERK_SIGN_UP_URL=<your_clerk_sign_up_url>
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=<your_clerk_after_sign_up_url>
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=<your_clerk_after_sign_in_url>

# Cloudinary configuration for frontend (public-facing)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your_cloudinary_upload_preset>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

# Backend API URL
NEXT_PUBLIC_API_URL=<your_backend_api_url>
```
Run the Frontend Development Server

After configuring your .env.local file, you can start the frontend development server:

```Bash

npm run dev
# or
# yarn dev
```
The frontend application should now be accessible at http://localhost:3000 (or the port specified by Next.js).

### Project Structure
```Bash
GameVaults/
├── backend/
│   ├── node_modules/
│   ├── models/                # MongoDB Mongoose schemas (e.g., Game.js, User.js)
│   ├── routes/                # API routes (e.g., games.js, auth.js)
│   ├── controllers/           # Logic for handling requests (e.g., gameController.js)
│   ├── config/                # Database connection, Cloudinary config (optional, could be in server.js)
│   ├── middleware/            # Custom middleware (e.g., authMiddleware.js)
│   ├── .env                   # Environment variables for backend
│   ├── package.json
│   └── server.js              # Main backend server file
├── frontend/
│   ├── node_modules/
│   ├── public/                # Static assets
│   ├── components/            # Reusable React components
│   ├── pages/                 # Next.js pages/routes
│   ├── lib/                   # Utility functions, API helpers
│   ├── styles/                # Global styles, Tailwind CSS setup
│   ├── .env                   # Environment variables for frontend (note: updated to .env.local per Next.js convention)
│   ├── package.json
│   └── next.config.js
└── .gitignore
└── README.md
```
### Contributing
We welcome contributions to GameVaults!

Fork the repository.

Clone the repository: git clone https://github.com/ahmadbuilds/GameVaults.git

### License
This project is licensed under the MIT License. See the LICENSE.md file for details.

### Contact
For any inquiries or feedback, feel free to reach out:

Email: crisitiano678@gmail.com
