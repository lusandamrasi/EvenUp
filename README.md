# EvenUp 🍽️

> The smart way to split bills and track spending when dining out

EvenUp is a mobile-first application that revolutionizes how groups handle restaurant bills. By integrating directly with restaurant POS systems and providing real-time bill tracking, EvenUp eliminates the awkward math at the end of meals and makes dining out with friends seamless.

## 🌟 Features

### For Customers
- **Real-time Bill Tracking**: See your order total update as you dine
- **Smart Group Splitting**: Join groups with simple codes, pay only your share
- **Restaurant Discovery**: Browse local Stellenbosch venues with integrated menus
- **Budget Management**: Set spending limits and track your dining habits
- **Multiple Split Options**: Pay per item or split equally with flexible tip options

### For Restaurants
- **POS Integration**: Seamless connection with existing point-of-sale systems
- **Faster Payments**: Customers pay directly through the app
- **Reduced Wait Times**: Eliminate payment delays and speed up table turnover
- **Digital Tips**: Higher average tips through convenient digital payments
- **Analytics Dashboard**: Insights into customer spending patterns

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │────│   Load Balancer │────│   API Gateway   │
│   Mobile App    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       │                              │                              │
            ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
            │   Auth Service  │            │   Menu Service  │            │  Order Service  │
            │   (Node.js)     │            │   (Node.js)     │            │   (Node.js)     │
            └─────────────────┘            └─────────────────┘            └─────────────────┘
                       │                              │                              │
            ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
            │   PostgreSQL    │            │   PostgreSQL    │            │   PostgreSQL    │
            │   (Users)       │            │   (Menus)       │            │   (Orders)      │
            └─────────────────┘            └─────────────────┘            └─────────────────┘
                                                      │
                                           ┌─────────────────┐
                                           │     Redis       │
                                           │  (Real-time &   │
                                           │   Caching)      │
                                           └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- React Native CLI
- Android Studio / Xcode (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/evenup.git
   cd evenup
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your database and Redis URLs in .env
   npm run migrate
   npm run seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # For iOS
   cd ios && pod install && cd ..
   npx react-native run-ios
   
   # For Android
   npx react-native run-android
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb evenup_development
   
   # Run migrations
   npm run migrate
   
   # Seed with sample data
   npm run seed
   ```

## 📱 Tech Stack

### Frontend (Mobile)
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type safety and developer experience
- **Redux Toolkit** - State management with RTK Query
- **React Navigation** - Navigation between screens
- **Socket.io Client** - Real-time updates
- **AsyncStorage** - Local data persistence

### Backend (API)
- **Node.js + Express** - RESTful API server
- **PostgreSQL** - Primary database
- **Redis** - Caching and real-time session management
- **Socket.io** - WebSocket connections for real-time features
- **JWT** - Authentication and authorization
- **Joi** - Input validation

### DevOps & Tools
- **Docker** - Containerization for development
- **Jest** - Testing framework
- **ESLint + Prettier** - Code formatting and linting
- **Swagger** - API documentation
- **GitHub Actions** - CI/CD pipeline

## 🗂️ Project Structure

```
evenup/
├── frontend/                    # React Native mobile app
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── screens/            # App screens/pages
│   │   ├── navigation/         # Navigation configuration
│   │   ├── store/              # Redux store and slices
│   │   ├── services/           # API and external services
│   │   ├── utils/              # Helper functions
│   │   └── types/              # TypeScript definitions
│   └── package.json
│
├── backend/                     # Node.js API server
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Helper functions
│   │   └── config/             # Configuration files
│   ├── migrations/             # Database migrations
│   ├── seeds/                  # Sample data
│   └── package.json
│
├── docs/                        # Documentation
├── scripts/                     # Utility scripts
├── docker-compose.yml           # Development environment
└── README.md
```

## 🔧 Development

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/evenup_development
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application
NODE_ENV=development
PORT=3000
```

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
npm run lint         # Lint code
```

**Frontend:**
```bash
npm start            # Start Metro bundler
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run test         # Run tests
npm run lint         # Lint code
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test                    # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Generate coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test                    # Run component tests
npm run test:e2e               # Run end-to-end tests
```

## 📚 API Documentation

The API documentation is available at `http://localhost:3000/api/docs` when running the development server.

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/orders` - Create order
- `POST /api/groups` - Create group bill
- `POST /api/groups/join` - Join group with code

## 🏪 POS Integration

EvenUp integrates with popular restaurant POS systems:

- **Toast POS** - Primary integration partner
- **Square** - Coming soon
- **Clover** - Coming soon

### Integration Flow
1. Customer provides EvenUp ID to server
2. Server inputs ID into POS system
3. Orders automatically sync to customer's bill
4. Customer pays through app
5. POS receives payment confirmation

## 🚀 Deployment

### Production Setup
1. Set up PostgreSQL and Redis instances
2. Configure environment variables
3. Build and deploy backend API
4. Build and submit mobile apps to stores

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Email**: support@evenup.app
- **Documentation**: [docs.evenup.app](https://docs.evenup.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/evenup/issues)

## 🗺️ Roadmap

### Phase 1 (Current) - Foundation
- [x] Basic authentication system
- [x] Restaurant and menu management
- [x] Individual bill tracking
- [ ] Real-time group bill splitting

### Phase 2 - POS Integration
- [ ] Toast POS integration
- [ ] Payment processing
- [ ] Real-time order syncing
- [ ] Pilot restaurant partnerships

### Phase 3 - Scale
- [ ] Multiple POS system support
- [ ] Advanced analytics
- [ ] Loyalty program integration
- [ ] Multi-city expansion

### Phase 4 - Enterprise
- [ ] Restaurant dashboard
- [ ] Enterprise reporting
- [ ] White-label solutions
- [ ] International expansion

## 🏆 Acknowledgments

- Built for the Stellenbosch student community
- Inspired by the need for seamless dining experiences
- Thanks to our early restaurant partners
- Special thanks to the open-source community

---

**EvenUp** - Making group dining effortlessly fair, one bill at a time. 🍻
