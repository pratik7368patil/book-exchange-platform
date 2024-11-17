## Technology Stack

### Frontend Architecture

- **Vue 3 with TypeScript**
  - Enhanced type safety
  - Component-based structure
  - Reactive data management
- **Naive-UI & Tailwind CSS**
  - Responsive design system
  - Custom theme support
  - Accessible components
- **Pinia State Management**
  - Centralized data store
  - Type-safe actions
  - Modular state handling

### Prerequisites

```bash
Node.js >= 14.x
MongoDB >= 4.x
npm >= 6.x
```

### Environment Setup

1. Clone the repository

```bash
git clone https://github.com/pratik7368patil/book-exchange-platform.git
cd book-exchange-platform
```

2. Install dependencies

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

3. Configure environment variables

```bash
# Backend (.env)
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret

# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
VITE_ENABLE_DEBUG=true
VITE_APP_TITLE="Book Exchange Platform"
```

### Launch Application

```bash
# Start backend server
cd backend
npm run dev

# Start frontend application
cd frontend
npm run dev
```

## Development Guidelines

### Code Structure

- **Frontend**: Component-based architecture with Vue 3
- **Backend**: MVC pattern with Express
- **Database**: Mongoose schemas with validation

### Best Practices

- Write descriptive commit messages
- Follow TypeScript type safety guidelines
- Implement error handling
- Add comments for complex logic

## Project Structure

```
book-exchange-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── helpers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.ts
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── helper/
│   │   ├── router/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── views/
│   │   └── App.vue
└── postman/
    └── API collection files
```

## Deployment

1. Build frontend

```bash
cd frontend
npm run build
```

2. Configure production environment
3. Deploy using your preferred hosting service
