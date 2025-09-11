#!/bin/bash

# EvenUp Development Environment Setup Script
# This script sets up the complete development environment for EvenUp

set -e  # Exit on any error

echo "🚀 Setting up EvenUp development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi
    
    # Check PostgreSQL
    if command_exists psql; then
        PSQL_VERSION=$(psql --version)
        print_success "PostgreSQL found: $PSQL_VERSION"
    else
        print_warning "PostgreSQL not found. Please install PostgreSQL 14+"
        echo "macOS: brew install postgresql"
        echo "Ubuntu: sudo apt install postgresql postgresql-contrib"
    fi
    
    # Check Redis
    if command_exists redis-cli; then
        print_success "Redis found"
    else
        print_warning "Redis not found. Please install Redis 6+"
        echo "macOS: brew install redis"
        echo "Ubuntu: sudo apt install redis-server"
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cp .env.example .env
        print_warning "Please update .env file with your configuration"
    else
        print_success ".env file already exists"
    fi
    
    cd ..
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if database exists
    if command_exists psql; then
        DB_EXISTS=$(psql -lqt | cut -d \| -f 1 | grep -w evenup_development | wc -l)
        
        if [ $DB_EXISTS -eq 0 ]; then
            print_status "Creating database..."
            createdb evenup_development || print_warning "Could not create database. Please create manually."
        else
            print_success "Database already exists"
        fi
        
        # Run migrations
        cd backend
        print_status "Running database migrations..."
        npm run migrate || print_warning "Migration failed. Please run manually: npm run migrate"
        
        print_status "Seeding database..."
        npm run seed || print_warning "Seeding failed. Please run manually: npm run seed"
        
        cd ..
    else
        print_warning "PostgreSQL not available. Skipping database setup."
    fi
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # iOS setup (if on macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists pod; then
            print_status "Installing iOS dependencies..."
            cd ios
            pod install
            cd ..
        else
            print_warning "CocoaPods not found. For iOS development, install with: sudo gem install cocoapods"
        fi
    fi
    
    cd ..
}

# Setup development tools
setup_dev_tools() {
    print_status "Setting up development tools..."
    
    # Install global tools if not present
    if ! command_exists react-native; then
        print_status "Installing React Native CLI..."
        npm install -g react-native-cli
    fi
    
    # Git hooks
    if [ -d .git ]; then
        print_status "Setting up git hooks..."
        # Add pre-commit hook for linting
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Run linting before commit
cd backend && npm run lint
cd ../frontend && npm run lint
EOF
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks installed"
    fi
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start Redis if available
    if command_exists redis-server; then
        if ! pgrep -x "redis-server" > /dev/null; then
            print_status "Starting Redis..."
            redis-server --daemonize yes
        else
            print_success "Redis already running"
        fi
    fi
    
    # Start PostgreSQL if available
    if command_exists pg_ctl; then
        if ! pgrep -x "postgres" > /dev/null; then
            print_status "Starting PostgreSQL..."
            pg_ctl -D /usr/local/var/postgres start || print_warning "Could not start PostgreSQL"
        else
            print_success "PostgreSQL already running"
        fi
    fi
}

# Main setup function
main() {
    echo "🍽️  Welcome to EvenUp Setup!"
    echo "This script will set up your development environment."
    echo ""
    
    check_prerequisites
    setup_backend
    setup_database
    setup_frontend
    setup_dev_tools
    start_services
    
    echo ""
    print_success "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Update backend/.env with your configuration"
    echo "2. Start the backend: cd backend && npm run dev"
    echo "3. Start the frontend: cd frontend && npx react-native run-ios (or run-android)"
    echo ""
    echo "For detailed instructions, see docs/SETUP.md"
    echo "API documentation: http://localhost:3000/api/docs"
}

# Run main function
main "$@"