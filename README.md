# Combinations API

API for generating combinations from a list of items and storing them in MySQL database. Items with the same starting letter cannot be combined together.

## Features

- ✅ Express.js REST API
- ✅ MySQL database with transactions
- ✅ Docker Compose setup (one command to rule them all!)
- ✅ Joi request validation
- ✅ Centralized error handling
- ✅ Morgan HTTP logging

## Prerequisites

- Node.js 18+ (if running locally)
- Docker and Docker Compose (for containerized setup)
- MySQL 8.0+ (if running database separately)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Start everything with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the Node.js application
   - Start MySQL database
   - Initialize database schema automatically
   - Start the API server

4. **Test the API**
   ```bash
   curl -X POST http://localhost:3000/generate \
     -H "Content-Type: application/json" \
     -d '{"items": [1, 2, 1], "length": 2}'
   ```

## Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start MySQL database** (or use Docker)
   ```bash
   docker-compose up db
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## API Endpoints

### POST /generate

Generate valid combinations and store them in the database.

**Request:**
```json
{
  "items": [1, 2, 1],
  "length": 2
}
```

**Response:**
```json
{
  "id": 1,
  "combination": [
    ["A1", "B1"],
    ["A1", "B2"],
    ["A1", "C1"],
    ["B1", "C1"],
    ["B2", "C1"]
  ]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Schema

### Tables

1. **items** - Stores individual items (A1, B1, B2, etc.)
2. **combinations** - Stores generated combinations as JSON with unique IDs
3. **responses** - Stores full response JSON for audit trail

### Transaction Flow

1. Generate combinations
2. START TRANSACTION
3. Insert items (batch INSERT IGNORE)
4. Insert combination (as JSON)
5. Insert response (full JSON)
6. COMMIT TRANSACTION

## Project Structure

```
task/
├── config/
│   └── database.js          # MySQL connection pool
├── controllers/
│   └── combinationController.js
├── database/
│   ├── init.sql             # Database schema
│   └── queries.js           # SQL query functions
├── middleware/
│   └── errorHandler.js
├── routes/
│   └── combinationRoutes.js
├── services/
│   └── combinationService.js
├── utils/
│   └── validation.js        # Joi validation schemas
├── index.js                 # Main Express app
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=db
DB_PORT=3306
DB_USER=combinations_user
DB_PASSWORD=combinations_password
DB_NAME=combinations_db
DB_ROOT_PASSWORD=rootpassword
```
