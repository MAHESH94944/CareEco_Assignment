# Distributed Job Scheduler

A comprehensive distributed job scheduling system built with Node.js, Express, and MongoDB. This system can schedule and execute jobs with cron-like scheduling, dependency management, priority handling, and retry policies across a cluster of worker machines.

## Features

- **Cron-like Scheduling**: Schedule jobs with cron expressions
- **Job Dependencies**: Define job execution order through dependencies
- **Priority Management**: High, Medium, Low priority job execution
- **Retry Policies**: Configurable retry mechanisms for failed jobs
- **Worker Capability Matching**: Intelligent job assignment based on worker capabilities
- **Cluster Management**: Distribute jobs across multiple worker nodes (12 workers)
- **Persistent Storage**: MongoDB for job definitions and execution history
- **RESTful API**: Complete CRUD operations for job management
- **Real-time Monitoring**: Track job status and worker health
- **Health Monitoring**: Advanced worker health tracking with consecutive failure detection

## System Requirements Compliance

✅ **Store job definitions persistently**: MongoDB with complete job schema
✅ **Trigger jobs at scheduled times**: Cron-based scheduler with minute-level precision
✅ **Manage job execution across cluster**: 12-worker cluster with capability-based assignment
✅ **Handle job failures and retry logic**: Configurable retry policies with exponential backoff
✅ **Support job dependencies**: Full dependency graph support with validation
✅ **Provide comprehensive API**: Complete CRUD operations with enhanced monitoring

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Scheduling**: node-cron
- **Authentication**: JWT (configured but not implemented in routes)

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://admin:Mahesh123mongo@ecommerce-web.kv4zvrc.mongodb.net/jobSchedulerDB?retryWrites=true&w=majority&appName=ecommerce-web
JWT_SECRET=jwsdfke5kthdrgjfdjkfdgdfgd@33344343jjddsdd
PORT=5000
```

4. Start the server

```bash
npm start
```

The server will start on `http://localhost:5000`

## Worker Architecture

The system now features a **12-worker cluster** with specialized capabilities:

### Worker Configuration

#### General Purpose Workers (2 workers)

- **worker-1**: `server-1.cluster.local:8001` - Supports `script`, `api`, `shell`
- **worker-2**: `server-2.cluster.local:8002` - Supports `script`, `api`, `shell`

#### Specialized Workers (6 workers)

- **worker-3**: `script-1.cluster.local:8003` - Script specialist
- **worker-4**: `script-2.cluster.local:8004` - Script specialist
- **worker-5**: `api-1.cluster.local:8005` - API specialist
- **worker-6**: `api-2.cluster.local:8006` - API specialist
- **worker-7**: `shell-1.cluster.local:8007` - Shell specialist
- **worker-8**: `shell-2.cluster.local:8008` - Shell specialist

#### Mixed Capability Workers (2 workers)

- **worker-9**: `mixed-1.cluster.local:8009` - Supports `script`, `api`
- **worker-10**: `mixed-2.cluster.local:8010` - Supports `api`, `shell`

#### Test Workers (2 workers)

- **worker-11**: `offline-1.cluster.local:8011` - Initially offline for testing
- **worker-12**: `busy-1.cluster.local:8012` - Initially busy for testing

### Enhanced Features

#### Advanced Health Monitoring

- **Consecutive Failure Tracking**: Workers track consecutive job failures
- **Health Status Levels**: healthy, warning, degraded, offline, unresponsive
- **Conservative Offline Marking**: Busy workers won't be marked offline
- **Faster Recovery**: 30-second recovery detection

#### Load Balancing Strategy

- **Capability-First**: Only assign jobs to capable workers
- **Reliability-Based**: Prioritize workers with fewer consecutive failures
- **Load Distribution**: Balance jobs across workers with similar reliability

#### Enhanced Error Reporting

- **Complete Worker Status**: Full worker information in error responses
- **Cluster Health Summary**: Overview of entire cluster state
- **Actionable Suggestions**: Specific recommendations for failed assignments
- **Fallback Options**: Alternative workers suggested when assignments fail

## API Endpoints

### Job Management

#### 1. Create Job

- **POST** `/api/jobs`
- **Description**: Create a new job with capability-based worker assignment
- **Body**:

```json
{
  "name": "Daily Report Generation",
  "schedule": "0 3 * * *",
  "command": "script:/path/to/report.js",
  "priority": "High",
  "dependencies": [],
  "retryPolicy": 3
}
```

#### 2. Get All Jobs

- **GET** `/api/jobs`
- **Description**: Retrieve all jobs with optional filtering
- **Query Parameters**:
  - `status`: Filter by status (pending, running, success, failed)
  - `priority`: Filter by priority (High, Medium, Low)
- **Example**: `/api/jobs?status=pending&priority=High`

#### 3. Get Job by ID

- **GET** `/api/jobs/:id`
- **Description**: Retrieve a specific job by ID

#### 4. Update Job

- **PUT** `/api/jobs/:id`
- **Description**: Update job configuration
- **Body**:

```json
{
  "schedule": "*/10 * * * *",
  "priority": "Medium",
  "retryPolicy": 2
}
```

#### 5. Delete Job

- **DELETE** `/api/jobs/:id`
- **Description**: Delete a job (checks for dependencies)

#### 6. Get Job Status

- **GET** `/api/jobs/:id/status`
- **Description**: Get current job status and statistics

#### 7. Get Job History

- **GET** `/api/jobs/:id/history`
- **Description**: Get job execution history and statistics

#### 8. Execute Job Manually

- **POST** `/api/jobs/:id/execute`
- **Description**: Manually trigger job execution

### Worker Management

#### 1. Get All Workers

- **GET** `/api/workers`
- **Description**: Get all 12 workers with cluster statistics and capability information

#### 2. Get Worker Status

- **GET** `/api/workers/:id`
- **Description**: Get specific worker status with health information

#### 3. Get Cluster Statistics

- **GET** `/api/workers/stats`
- **Description**: Get comprehensive cluster performance metrics

#### 4. Get Workers by Capability

- **GET** `/api/workers/capability/:type`
- **Description**: Get workers that support specific capability
- **Parameters**:
  - `type`: Capability type (script, api, shell)
- **Example**: `/api/workers/capability/script`

#### 5. Assign Job to Worker

- **POST** `/api/workers/assign`
- **Description**: Manually assign job to worker with capability verification
- **Body**:

```json
{
  "workerId": "worker-1",
  "jobId": "60d5ec49f1b2c8a5e8b9f123"
}
```

#### 6. Release Worker

- **POST** `/api/workers/:id/release`
- **Description**: Release worker from current job
- **Body**:

```json
{
  "jobSuccess": true
}
```

## Command Type Detection & Worker Compatibility

### Command Types

- **script**: Commands starting with `script:` (e.g., `script:/path/to/script.js`)
- **api**: Commands starting with `http://` or `https://` (e.g., `http://api.example.com/test`)
- **shell**: All other commands (e.g., `ls -la`, `echo "Hello"`)

### Worker Capability Matrix

| Worker    | Script | API | Shell | Host                    |
| --------- | ------ | --- | ----- | ----------------------- |
| worker-1  | ✅     | ✅  | ✅    | server-1.cluster.local  |
| worker-2  | ✅     | ✅  | ✅    | server-2.cluster.local  |
| worker-3  | ✅     | ❌  | ❌    | script-1.cluster.local  |
| worker-4  | ✅     | ❌  | ❌    | script-2.cluster.local  |
| worker-5  | ❌     | ✅  | ❌    | api-1.cluster.local     |
| worker-6  | ❌     | ✅  | ❌    | api-2.cluster.local     |
| worker-7  | ❌     | ❌  | ✅    | shell-1.cluster.local   |
| worker-8  | ❌     | ❌  | ✅    | shell-2.cluster.local   |
| worker-9  | ✅     | ✅  | ❌    | mixed-1.cluster.local   |
| worker-10 | ❌     | ✅  | ✅    | mixed-2.cluster.local   |
| worker-11 | ✅     | ✅  | ✅    | offline-1.cluster.local |
| worker-12 | ✅     | ❌  | ✅    | busy-1.cluster.local    |

## Postman Testing Guide

### Environment Setup

1. Create a new environment in Postman
2. Add variables:
   - `baseUrl`: `http://localhost:5000`
   - `jobId`: (will be set after creating a job)
   - `workerId`: `worker-1`

### Testing Enhanced Worker System

#### 1. Test Worker Capabilities Distribution

**Get Script Workers (6 workers expected):**

```
GET {{baseUrl}}/api/workers/capability/script
```

**Get API Workers (7 workers expected):**

```
GET {{baseUrl}}/api/workers/capability/api
```

**Get Shell Workers (6 workers expected):**

```
GET {{baseUrl}}/api/workers/capability/shell
```

#### 2. Test Load Balancing

**Create Multiple Script Jobs:**

```
POST {{baseUrl}}/api/jobs
Content-Type: application/json

{
  "name": "Script Job {{$randomInt}}",
  "schedule": "*/5 * * * *",
  "command": "script:/path/to/script{{$randomInt}}.js",
  "priority": "High",
  "dependencies": [],
  "retryPolicy": 2
}
```

#### 3. Test Capability Mismatch Handling

**Try to assign shell job to script-only worker:**

```
POST {{baseUrl}}/api/workers/assign
Content-Type: application/json

{
  "workerId": "worker-3",
  "jobId": "{{shellJobId}}"
}
```

#### 4. Test Worker Health Monitoring

**Check specific worker health:**

```
GET {{baseUrl}}/api/workers/worker-11
```

**Monitor cluster health:**

```
GET {{baseUrl}}/api/workers/stats
```

### Enhanced Error Responses

**Capability Mismatch Response:**

```json
{
  "error": "Worker worker-3 doesn't support 'shell' commands",
  "compatibleWorkers": [
    "worker-1",
    "worker-2",
    "worker-7",
    "worker-8",
    "worker-10",
    "worker-11",
    "worker-12"
  ],
  "availableCompatibleWorkers": ["worker-1", "worker-7", "worker-8"],
  "clusterStatus": {
    "totalWorkers": 12,
    "activeWorkers": 11,
    "idleWorkers": 8,
    "busyWorkers": 2,
    "offlineWorkers": 1
  },
  "suggestions": "Try assigning to: worker-1, worker-7, worker-8"
}
```

**Enhanced Worker Status Response:**

```json
{
  "id": "worker-1",
  "status": "idle",
  "capabilities": ["script", "api", "shell"],
  "uptime": "2h 45m",
  "loadPercentage": 25,
  "healthStatus": {
    "status": "healthy",
    "message": "Operating normally",
    "consecutiveFailures": 0,
    "lastPing": "2024-01-15T10:30:00.000Z"
  }
}
```

## System Requirements Verification

### 1. ✅ Store Job Definitions Persistently

- **Implementation**: MongoDB with comprehensive job schema
- **Features**: Full CRUD operations, job history, execution tracking
- **Storage**: Persistent job definitions with relationships and metadata

### 2. ✅ Trigger Jobs at Scheduled Times

- **Implementation**: Cron-based scheduler with minute-level precision
- **Features**: Multiple cron expressions, timezone support, manual triggering
- **Reliability**: Automatic job pickup and execution

### 3. ✅ Manage Job Execution Across Cluster

- **Implementation**: 12-worker cluster with capability-based assignment
- **Features**: Load balancing, health monitoring, automatic failover
- **Scalability**: Easily configurable worker pool

### 4. ✅ Handle Job Failures and Retry Logic

- **Implementation**: Configurable retry policies with exponential backoff
- **Features**: Consecutive failure tracking, retry limits, failure analytics
- **Reliability**: Automatic retry with intelligent backoff

### 5. ✅ Support Job Dependencies

- **Implementation**: Full dependency graph support with validation
- **Features**: Dependency checking, circular dependency prevention
- **Reliability**: Automatic dependency resolution

### 6. ✅ Provide API for Job Management

- **Implementation**: Complete RESTful API with comprehensive endpoints
- **Features**: CRUD operations, status monitoring, manual execution
- **Usability**: Clear error messages and response formats

## Monitoring & Analytics

### Enhanced Cluster Statistics

- **Total Workers**: 12 (configurable)
- **Worker Distribution**: General purpose, specialized, and mixed workers
- **Capability Coverage**: Redundancy across all job types
- **Health Metrics**: Real-time health monitoring with degradation detection

### Job Execution Analytics

- **Success Rates**: Per-job and cluster-wide success tracking
- **Execution History**: Detailed logs with timing and output
- **Performance Metrics**: Job duration, failure patterns, retry statistics
- **Dependency Analytics**: Dependency resolution times and bottlenecks

## Development

### Enhanced Architecture Benefits

1. **Scalability**: Easy to add more workers with specific capabilities
2. **Reliability**: Multiple workers per capability type ensure redundancy
3. **Performance**: Specialized workers optimized for specific job types
4. **Monitoring**: Comprehensive health and performance tracking
5. **Maintenance**: Individual worker management without cluster downtime

### Adding New Workers

To add more workers, update the `workers` array in `workerController.js`:

```javascript
{
  id: "worker-13",
  status: "idle",
  capabilities: ["script", "api"],
  host: "new-worker.cluster.local",
  port: 8013,
  // ... other properties
}
```

## Troubleshooting

### Common Issues with 12-Worker Setup

1. **Worker Overload**: Monitor individual worker loads and redistribute
2. **Capability Gaps**: Ensure sufficient workers for each job type
3. **Health Issues**: Check worker health status and consecutive failures
4. **Network Issues**: Verify worker connectivity and ping status

### Performance Optimization

- **Load Balancing**: Monitor worker distribution and adjust assignment logic
- **Capacity Planning**: Scale workers based on job volume and types
- **Health Monitoring**: Set up alerts for worker health degradation
- **Dependency Optimization**: Minimize dependency chains for better performance

## License

This project is licensed under the MIT License.
