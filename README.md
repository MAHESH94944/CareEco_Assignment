# TaskCron - Distributed Job Scheduling System

A comprehensive distributed job scheduling system built with Node.js, Express, MongoDB backend and React.js frontend. This system can schedule and execute jobs with cron-like scheduling, dependency management, priority handling, and retry policies across a cluster of worker machines.

## 🎯 Features

### Backend Features

- **Cron-like Scheduling**: Schedule jobs with cron expressions
- **Job Dependencies**: Define job execution order through dependencies
- **Priority Management**: High, Medium, Low priority job execution
- **Retry Policies**: Configurable retry mechanisms for failed jobs
- **Worker Capability Matching**: Intelligent job assignment based on worker capabilities
- **Cluster Management**: Distribute jobs across multiple worker nodes (12 workers)
- **Persistent Storage**: MongoDB for job definitions and execution history
- **RESTful API**: Complete CRUD operations for job management
- **Real-time Monitoring**: Track job status and worker health

### Frontend Features

- **Modern React UI**: Built with React 18, Vite, and Tailwind CSS
- **Real-time Dashboard**: Live monitoring of jobs and workers
- **Job Management**: Create, edit, delete, and execute jobs
- **Worker Monitoring**: View worker status and health metrics
- **Responsive Design**: Mobile-first responsive interface
- **Advanced Filtering**: Filter jobs by status, priority, and search
- **Toast Notifications**: User-friendly feedback system

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Scheduling**: node-cron
- **Authentication**: JWT (configured)
- **Validation**: Mongoose schema validation

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📋 System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MAHESH94944/CareEco_Assignment.git
cd CareEco_Assignment
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/taskcron
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/taskcron?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex

# Server Configuration
PORT=5000
```

**Important Environment Variables:**

- `MONGO_URI`: Your MongoDB connection string
  - **Local MongoDB**: `mongodb://localhost:27017/taskcron`
  - **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/taskcron?retryWrites=true&w=majority`
- `JWT_SECRET`: A secure random string for JWT token signing (minimum 32 characters)
- `PORT`: Port number for the backend server (default: 5000)

Start the backend server:

```bash
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB**: Download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. **Start MongoDB**:

   ```bash
   # On Windows
   mongod

   # On macOS/Linux
   sudo systemctl start mongod
   ```

3. **Use in .env**:
   ```env
   MONGO_URI=mongodb://localhost:27017/taskcron
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**: Sign up at [https://cloud.mongodb.com/](https://cloud.mongodb.com/)

2. **Create Cluster**: Create a free cluster (M0)

3. **Create Database User**:

   - Go to Database Access
   - Add new user with read/write permissions
   - Remember the username and password

4. **Configure Network Access**:

   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (for development)

5. **Get Connection String**:

   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string

6. **Use in .env**:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskcron?retryWrites=true&w=majority
   ```

## 📁 Project Structure

```
CareEco_Assignment/
├── backend/                     # Node.js Backend
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   ├── schedular/          # Job scheduling logic
│   │   ├── utils/              # Utility functions
│   │   └── config/             # Configuration files
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── stores/             # Zustand stores
│   │   ├── services/           # API services
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── .env                    # Environment variables
└── README.md                   # This file
```

## 🎮 Usage Guide

### Creating Your First Job

1. **Access the Dashboard**: Open `http://localhost:5173` in your browser
2. **Create New Job**: Click "Create New Job" or navigate to `/jobs/new`
3. **Fill Job Details**:
   - **Name**: Give your job a descriptive name
   - **Schedule**: Use cron expression (e.g., `*/5 * * * *` for every 5 minutes)
   - **Command**: Enter the command to execute
   - **Priority**: Select High, Medium, or Low
   - **Retry Policy**: Set number of retries on failure

### Command Types

TaskCron supports three types of commands:

1. **Script Commands**: `script:/path/to/script.js`
2. **API Commands**: `http://api.example.com/endpoint`
3. **Shell Commands**: `echo "Hello World"`

### Cron Expression Examples

```
* * * * *        # Every minute
*/5 * * * *      # Every 5 minutes
0 * * * *        # Every hour
0 0 * * *        # Daily at midnight
0 9 * * 1        # Weekly on Monday at 9 AM
0 0 1 * *        # Monthly on the 1st at midnight
```

### Worker System

TaskCron features a 12-worker cluster with specialized capabilities:

| Worker Type        | Capabilities         | Count |
| ------------------ | -------------------- | ----- |
| General Purpose    | Script, API, Shell   | 2     |
| Script Specialists | Script only          | 2     |
| API Specialists    | API only             | 2     |
| Shell Specialists  | Shell only           | 2     |
| Mixed Capability   | Various combinations | 4     |

## 📚 API Documentation

### Base URL

```
Local: http://localhost:5000/api
Production: https://careeco-assignment-r5mw.onrender.com/api
```

### Job Management Endpoints

#### Create Job

```http
POST /api/jobs
Content-Type: application/json

{
  "name": "Daily Report",
  "schedule": "0 9 * * *",
  "command": "script:/path/to/report.js",
  "priority": "High",
  "dependencies": [],
  "retryPolicy": 3
}
```

#### Get All Jobs

```http
GET /api/jobs
GET /api/jobs?status=pending&priority=High
```

#### Get Job by ID

```http
GET /api/jobs/:id
```

#### Update Job

```http
PUT /api/jobs/:id
Content-Type: application/json

{
  "schedule": "*/10 * * * *",
  "priority": "Medium"
}
```

#### Delete Job

```http
DELETE /api/jobs/:id
```

#### Execute Job Manually

```http
POST /api/jobs/:id/execute
```

### Worker Management Endpoints

#### Get All Workers

```http
GET /api/workers
```

#### Get Worker by ID

```http
GET /api/workers/:id
```

#### Get Cluster Statistics

```http
GET /api/workers/stats
```

#### Assign Job to Worker

```http
POST /api/workers/assign
Content-Type: application/json

{
  "workerId": "worker-1",
  "jobId": "job-id-here"
}
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual Testing with Postman

1. **Import Collection**: Import the provided Postman collection
2. **Set Environment Variables**:
   - `baseUrl`: `http://localhost:5000`
   - `frontendUrl`: `http://localhost:5173`
3. **Test Endpoints**: Run the provided test scenarios

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Web Service** on Render
2. **Configure Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Add Environment Variables**:
   ```
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-production-jwt-secret
   PORT=5000
   ```

### Frontend Deployment (Render)

1. **Create Static Site** on Render
2. **Configure Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# Database
MONGO_URI=mongodb://localhost:27017/taskcron

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Server
PORT=5000

# Optional: Logging level
LOG_LEVEL=info
```

### Frontend Configuration

Edit `frontend/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Application settings
VITE_APP_NAME=TaskCron
VITE_APP_VERSION=1.0.0
```

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start

- **Check MongoDB**: Ensure MongoDB is running and accessible
- **Check Port**: Make sure port 5000 is not in use
- **Check Environment**: Verify all environment variables are set correctly

#### Frontend won't start

- **Check Node Version**: Ensure Node.js 18+ is installed
- **Check API URL**: Verify `VITE_API_URL` points to running backend
- **Clear Cache**: Delete `node_modules` and run `npm install`

#### Database Connection Issues

- **Local MongoDB**: Ensure MongoDB service is running
- **MongoDB Atlas**: Check network access and credentials
- **Connection String**: Verify the format and credentials

#### CORS Issues

- **Frontend URL**: Ensure backend CORS allows frontend URL
- **Local Development**: Check `app.js` CORS configuration

### Debug Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB connection
mongosh "your-connection-string"

# Check if port is in use
netstat -an | grep :5000

# View application logs
npm run dev  # Frontend
npm start    # Backend
```
