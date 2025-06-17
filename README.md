#  ModarFlor - Floor Decoration Company Web Application

A complete full-stack web application for a floor decoration company built with Next.js 15, TypeScript, and PostgreSQL.

## 🏗️ Project Structure

\`\`\`
floor-decoration-app/
├── frontend/                 # Next.js 15 frontend
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   └── public/             # Static assets
└── backend/                # Node.js TypeScript backend
    ├── src/                # Source code
    ├── scripts/            # Database scripts
    └── dist/              # Compiled JavaScript
\`\`\`

## 🚀 Features

### Frontend
- **Modern UI**: Built with Next.js 15 App Router and Tailwind CSS
- **Responsive Design**: Mobile-first approach with smooth animations
- **Image Optimization**: Next.js Image component with lazy loading
- **Dark Mode**: Theme switching capability
- **Admin Dashboard**: Complete content management system
- **SEO Optimized**: Structured data and semantic HTML

### Backend
- **RESTful API**: Built with Express.js and TypeScript
- **Raw SQL**: Direct PostgreSQL queries for optimal performance
- **Authentication**: JWT-based auth with refresh tokens
- **Security**: Rate limiting, CORS, input validation, password hashing
- **Role-based Access**: Admin and Viewer roles
- **Error Handling**: Centralized error handling with logging

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui components

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL (Raw SQL)
- JWT Authentication
- Winston Logging
- Joi Validation

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Backend Setup
\`\`\`bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations and seed
npm run seed

# Start development server
npm run dev
\`\`\`

## 🔧 Environment Variables

### Backend (.env)
\`\`\`env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/floorcraft_db
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `projects` - Portfolio projects
- `project_images` - Project image gallery
- `services` - Company services
- `service_features` - Service feature lists
- `testimonials` - Customer testimonials

## 🔐 Authentication

### Default Admin Credentials
- Email: `admin@ ModarFlor.com`
- Password: `admin123`

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh access token

## 📱 Admin Dashboard

Access the admin dashboard at `/admin` with the following features:
- **Dashboard**: Overview statistics and recent activity
- **Projects**: CRUD operations for portfolio projects
- **Services**: Manage company services
- **Testimonials**: Customer testimonial management
- **Users**: User account management (admin only)
- **Image Upload**: Drag-and-drop image upload with preview

## 🎨 Key Components

### Frontend Components
- `HeroSection` - Homepage hero with image carousel
- `StatsSection` - Company statistics with animations
- `FeaturedProjects` - Portfolio showcase
- `ServicesSection` - Interactive service cards
- `TestimonialsSection` - Auto-rotating testimonials
- `AdminLayout` - Admin dashboard layout

### Backend Controllers
- `authController` - Authentication logic
- `projectController` - Project CRUD operations
- `serviceController` - Service management
- `testimonialController` - Testimonial management
- `userController` - User management

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Access (15min) and refresh (7 days) tokens
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers

## 📊 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Image Optimization**: Next.js Image component with WebP
- **Lazy Loading**: Components and images load on demand
- **Caching**: Browser caching for static assets
- **Pagination**: Large datasets are paginated
- **Connection Pooling**: PostgreSQL connection pool

## 🚀 Deployment

### Frontend (Vercel)
\`\`\`bash
cd frontend
npm run build
# Deploy to Vercel
\`\`\`

### Backend (Railway/Heroku)
\`\`\`bash
cd backend
npm run build
# Deploy to your preferred platform
\`\`\`

## 🧪 Testing

\`\`\`bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
\`\`\`

## 📝 API Documentation

### Projects
- `GET /api/projects` - Get all projects (with pagination/filtering)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/featured` - Get featured testimonials
- `POST /api/testimonials` - Create testimonial (admin only)
- `PUT /api/testimonials/:id` - Update testimonial (admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@ ModarFlor.com or create an issue in the repository.
