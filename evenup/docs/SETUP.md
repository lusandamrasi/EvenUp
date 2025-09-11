# EvenUp Development Setup Guide

## Prerequisites

Before setting up EvenUp, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **PostgreSQL** (v14 or higher)
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Verify installation: `psql --version`

3. **Redis** (v6 or higher)
   - macOS: `brew install redis`
   - Ubuntu: `sudo apt install redis-server`
   - Windows: Use Redis for Windows or Docker

4. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

5. **Mobile Development Environment**
   - **For iOS**: Xcode (macOS only)
   - **For Android**: Android Studio with Android SDK

### Optional but Recommended

- **Docker** for containerized development
- **Yarn** as an alternative package manager
- **Flipper** for React Native debugging

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/evenup.git
cd evenup
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

#### Environment Configuration

Update the `.env` file with your settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evenup_development
DB_USER=your_username
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Create database user
createuser -d evenup_user

# Create database
createdb -O evenup_user evenup_development

# Or using psql
psql -c "CREATE USER evenup_user WITH CREATEDB;"
psql -c "CREATE DATABASE evenup_development OWNER evenup_user;"
```

#### Run Migrations and Seeds

```bash
# Run database migrations
npm run migrate

# Seed with sample data
npm run seed
```

### 4. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:3000`

### 5. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# For iOS only - install CocoaPods dependencies
cd ios && pod install && cd ..
```

#### Configure API Endpoints

Update the local IP address in `src/constants/api.ts`:

```typescript
const LOCAL_IP = '192.168.1.100'; // Replace with your machine's IP
```

To find your IP address:
- **macOS/Linux**: `ifconfig | grep inet`
- **Windows**: `ipconfig`

### 6. Start React Native Development

#### For iOS (macOS only)

```bash
npx react-native run-ios
```

#### For Android

```bash
# Make sure Android emulator is running or device is connected
npx react-native run-android
```

#### Metro Bundler

If not started automatically:

```bash
npx react-native start
```

## Docker Setup (Alternative)

For a containerized development environment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Verification

### Backend Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "EvenUp API is running",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Database Connection

```bash
# Test database connection
npm run test:db  # Custom script to verify DB connection
```

### Redis Connection

```bash
# Test Redis connection
redis-cli ping
# Should return "PONG"
```

## Common Issues and Solutions

### Port Already in Use

If port 3000 is occupied:

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### PostgreSQL Connection Issues

1. **Database doesn't exist**:
   ```bash
   createdb evenup_development
   ```

2. **Authentication failed**:
   - Check username/password in `.env`
   - Verify PostgreSQL is running: `brew services list | grep postgresql`

3. **Permission denied**:
   ```bash
   # Grant privileges to user
   psql -c "ALTER USER evenup_user CREATEDB;"
   ```

### React Native Metro Issues

```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clean build
cd ios && xcodebuild clean && cd ..
# or
cd android && ./gradlew clean && cd ..
```

### Android Build Issues

1. **SDK not found**:
   - Set `ANDROID_HOME` environment variable
   - Add SDK tools to PATH

2. **Gradle build fails**:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

### iOS Build Issues

1. **CocoaPods errors**:
   ```bash
   cd ios
   pod deintegrate
   pod install
   ```

2. **Xcode build errors**:
   - Clean build folder in Xcode (⌘+Shift+K)
   - Delete derived data

## Development Workflow

### Making Changes

1. **Backend changes**: Server auto-reloads with nodemon
2. **Frontend changes**: Metro bundler hot-reloads automatically
3. **Database changes**: Create new migration files

### Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Run specific test file
npm test -- auth.test.js
```

### Debugging

#### Backend Debugging

- Use console.log or debugging tools
- Check logs: `tail -f logs/error.log`
- Use Postman or curl for API testing

#### Frontend Debugging

- Use React Native Debugger
- Enable Flipper for advanced debugging
- Use console.log in Metro terminal

## Next Steps

After successful setup:

1. **Explore the API**: Visit `http://localhost:3000/api/docs` for interactive documentation
2. **Test the mobile app**: Create an account and browse restaurants
3. **Review the codebase**: Start with `src/app.js` (backend) and `src/App.tsx` (frontend)
4. **Read the architecture docs**: Check `docs/ARCHITECTURE.md`

## Getting Help

- Check the [troubleshooting guide](TROUBLESHOOTING.md)
- Review [common issues](https://github.com/yourusername/evenup/issues)
- Join our [Discord community](https://discord.gg/evenup)

## Contributing

Before making changes:

1. Read the [contributing guidelines](../CONTRIBUTING.md)
2. Set up pre-commit hooks: `npm run setup-hooks`
3. Run linting: `npm run lint`
4. Run tests: `npm test`