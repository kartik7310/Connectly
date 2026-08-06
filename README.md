# Connexto - Full Stack Real-time Communication Platform

<div align="center">

**Enterprise-grade Real-time Messaging & Social Networking Platform**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github&logoColor=white)](https://github.com/kartik7310/connexto)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-v5.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat&logo=stripe&logoColor=white)](https://stripe.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-v4-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Overview

connexto is a modern, full-stack real-time communication platform built for speed and scalability. It features a robust **Node.js/Express** backend and a high-performance **React/Vite** frontend. connexto provides secure authentication, real-time messaging, social interaction, content management, and premium subscriptions.

### Key Capabilities

✅ **Secure Authentication** - JWT-based sessions with Google OAuth integration  
✅ **Real-time Messaging** - WebSocket-powered instant chat with Socket.io  
✅ **Social Networking** - Connection requests and user discovery  
✅ **Content Management** - Blog creation and management system  
✅ **Payment Integration** - stripe subscription and payment processing  
✅ **Media Optimization** - ImageKit integration for efficient media delivery  
✅ **Production Ready** - Comprehensive logging, error handling, and validation  

---

## 🏗️ System Architecture

### High-Level Design (HLD)

The backend follows a layered architecture with clear separation of concerns, enabling scalability and maintainability.

```mermaid
graph LR
    User([User]) <--> Client[(React Frontend)]
    Client <-->|HTTPS/WSS| API[(Express Backend)]
    
    subgraph "Backend Services"
        API <--> DB[(MongoDB)]
        API <--> AI[Grok/LangChain]
        API <--> Pay[stripe]
        API <--> Media[ImageKit]
    end
    
    API <--> Socket[Socket.io]
    Socket <--> Client
```

---

## 💻 Frontend Application

connexto's frontend is a sleek, responsive Single Page Application (SPA) designed for a premium user experience.

### Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + DaisyUI
- **State Management**: Redux Toolkit
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod
- **Networking**: Axios

## 🚀 Key Features

- ⚡ **Optimized Performance** — Fast loading and smooth user experience powered by Vite  
- 🎨 **Modern UI** — Clean, fully responsive interface built with DaisyUI components  
- 💬 **Real-time Messaging** — Instant chat with live message synchronization  
- ⌨️ **Real-time Typing Indicator** — Shows when users are actively typing during conversations  
- 🟢 **Live Online/Offline Status** — Real-time user presence tracking  
- 🔔 **Real-time In-App Notifications** — Instant alerts for messages and platform activities  
- 🤖 **AI Assistant** — Integrated chatbot powered by Grok AI  
- 💳 **Secure Payments** — Seamless and secure checkout using stripe  
- 📝 **Rich Content Editor** — Advanced blog creation and editing with Jodit React
### Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components (Navbar, Chatbot, etc.)
│   ├── pages/           # Page containers (Feed, Profile, Chat, etc.)
│   ├── services/        # API communication layers
│   ├── store/           # Redux logic and slices
│   ├── webSocket/       # Socket.io events and listeners
│   ├── utils/           # Shared utility functions
│   └── App.jsx          # Main routing and layout
├── public/              # Static assets
└── index.html           # HTML entry point
```

---

## 🛠️ Backend Architecture

### Low-Level Design (LLD)

The backend is organized into **7 core modules**, each following the MVC pattern:

#### 1. Authentication Module (`/api/v1/auth`)

**Purpose**: Manages user authentication and authorization.

**Components**:
- **Routes**: `auth.routes.js` - Defines authentication endpoints
- **Controller**: `auth.js` - Handles HTTP requests/responses
- **Service**: `auth.js` - Business logic for signup, login, OAuth
- **Model**: `user.js` - User schema and validation

**Flow**:
```
POST /signup → Validator → Controller → Service → Hash Password → Save to DB → Generate JWT → Response
POST /login → Controller → Service → Verify Password → Generate JWT → Set Cookie → Response
POST /google-login → Controller → Verify Google Token → Find/Create User → Generate JWT → Response
POST /logout → Auth Middleware → Controller → Clear Cookie → Response
```

**Key Features**:
- Password hashing with bcrypt
- JWT token generation and verification
- Google OAuth 2.0 integration
- Session management via HTTP-only cookies

---

#### 2. User Management Module (`/api/v1/user`)

**Purpose**: Handles user profile operations and user discovery.

**Components**:
- **Routes**: `user.route.js`
- **Controller**: `user.js`
- **Service**: `user.js`
- **Model**: `user.js`

**Operations**:
- Fetch user profile
- Update user information
- Search and discover users
- Manage user preferences

---

#### 3. Profile Module (`/api/v1/profile`)

**Purpose**: Manages user profile customization and visibility.

**Components**:
- **Routes**: `profile.routes.js`
- **Controller**: `profile.js`
- **Service**: `profile.js`

**Features**:
- Profile photo management (ImageKit integration)
- Bio and skills management
- Profile visibility settings

---

#### 4. Connection Module (`/api/v1/connections`)

**Purpose**: Social networking features for user connections.

**Components**:
- **Routes**: `connection.routes.js`
- **Controller**: `connectionRequest.js`
- **Service**: `connection.js`
- **Model**: `connectionRequest.js`

**Features**:
- Send connection requests
- Accept/Reject requests
- View pending requests
- Manage connections list

**States**: `pending` → `accepted` | `rejected` | `ignored`

---

#### 5. Chat Module (`/api/v1/chat`)

**Purpose**: Real-time messaging system.

**Components**:
- **Routes**: `chat.routes.js`
- **Controller**: `chat.js`
- **Service**: `chat.js`
- **Model**: `chat.js`
- **WebSocket**: `socket.js`

**Communication Flow**:
```
Client → Socket.io → Authenticate → Join Room → Send Message → Persist to DB → Broadcast to Room
```

**Events**:
- `connection` - User connects to WebSocket
- `join_room` - Join chat room
- `send_message` - Send message to room
- `receive_message` - Receive broadcast message
- `disconnect` - User disconnects

---

#### 6. Blog Module (`/api/v1/blogs`)

**Purpose**: Content management system for user blogs.

**Components**:
- **Routes**: `blog.route.js`
- **Controller**: `blog.js`
- **Service**: `blog.js`
- **Model**: `blog.js`
- **Validator**: `blog.js`

**Features**:
- Create, Read, Update, Delete (CRUD) operations
- Rich text content support (Jodit editor integration)
- Blog categorization
- User-specific blogs

---

#### 7. Subscription/Payment Module (`/api/v1/payment`)

**Purpose**: Manages premium subscriptions and payments.

**Components**:
- **Routes**: `subscription.routes.js`
- **Controller**: `subscription.js`
- **Service**: `subscription.js`
- **Model**: `subscription.js`

**Integration**: stripe API

**Features**:
- Create payment orders
- Verify payment signatures
- Activate premium membership
- Manage subscription tiers

---

## 📂 Project Structure

```
Backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js            # MongoDB connection
│   │   ├── googleOauth.js   # Google OAuth client
│   │   ├── imagekit.js      # ImageKit configuration
│   │   ├── logger.js        # Winston logger setup
│   │   └── stripe.js      # stripe configuration
│   │
│   ├── controllers/         # Request handlers
│   │   ├── auth.js          # Authentication controller
│   │   ├── blog.js          # Blog controller
│   │   ├── chat.js          # Chat controller
│   │   ├── connectionRequest.js
│   │   ├── profile.js
│   │   ├── subscription.js
│   │   └── user.js
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── blog.js
│   │   ├── chat.js
│   │   ├── connectionRequest.js
│   │   ├── otp.js
│   │   ├── subscription.js
│   │   └── user.js
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── blog.route.js
│   │   ├── chat.routes.js
│   │   ├── connection.routes.js
│   │   ├── profile.routes.js
│   │   ├── subscription.routes.js
│   │   └── user.route.js
│   │
│   ├── services/            # Business logic
│   │   ├── auth.js
│   │   ├── blog.js
│   │   ├── chat.js
│   │   ├── connection.js
│   │   ├── profile.js
│   │   ├── subscription.js
│   │   └── user.js
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── errorMiddleware.js    # Global error handler
│   │
│   ├── validators/          # Request validation (Zod)
│   │   ├── blog.js
│   │   ├── otp.js
│   │   └── user.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── AppError.js      # Custom error class
│   │   ├── generateOtp.js
│   │   ├── generateToken.js
│   │   ├── logger.js
│   │   ├── planType.js
│   │   └── roomSecret.js
│   │
│   ├── webSocket/           # Socket.io configuration
│   │   └── socket.js
│   │
│   └── app.js               # Express application entry point
│
├── logs/                    # Application logs
├── .env                     # Environment variables
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/signup` | Register new user | ❌ |
| `POST` | `/api/v1/auth/login` | User login | ❌ |
| `POST` | `/api/v1/auth/logout` | User logout | ✅ |
| `POST` | `/api/v1/auth/google-login` | Google OAuth login | ❌ |

**Example: User Signup**
```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "age": 25,
  "gender": "male"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "email": "john@example.com" }
}
```

---

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/user/me` | Get current user profile | ✅ |
| `PUT` | `/api/v1/user/update` | Update user details | ✅ |
| `GET` | `/api/v1/user/search` | Search users | ✅ |
| `GET` | `/api/v1/user/:id` | Get user by ID | ✅ |

---

### Connection Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/connections/request` | Send connection request | ✅ |
| `PUT` | `/api/v1/connections/accept/:id` | Accept connection | ✅ |
| `PUT` | `/api/v1/connections/reject/:id` | Reject connection | ✅ |
| `GET` | `/api/v1/connections/pending` | Get pending requests | ✅ |
| `GET` | `/api/v1/connections/list` | Get all connections | ✅ |

---

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/chat/conversations` | Get all conversations | ✅ |
| `GET` | `/api/v1/chat/:conversationId` | Get messages | ✅ |
| `POST` | `/api/v1/chat/send` | Send message | ✅ |

**WebSocket Events**:
- **Emit**: `send_message` - Send a message
- **Listen**: `receive_message` - Receive messages in real-time

---

### Blog Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/blogs/create` | Create new blog | ✅ |
| `GET` | `/api/v1/blogs` | Get all blogs | ❌ |
| `GET` | `/api/v1/blogs/:id` | Get blog by ID | ❌ |
| `PUT` | `/api/v1/blogs/:id` | Update blog | ✅ |
| `DELETE` | `/api/v1/blogs/:id` | Delete blog | ✅ |

---

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/payment/create-order` | Create payment order | ✅ |
| `POST` | `/api/v1/payment/verify` | Verify payment | ✅ |
| `GET` | `/api/v1/payment/subscription-status` | Check subscription | ✅ |

---

## 🗄️ Database Schema

The database uses **MongoDB Atlas** as a cloud-hosted NoSQL cluster. Below are the key schemas for the application:

#### 👤 User Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK | Unique identifier |
| `firstName` | `string` | Required | User's first name |
| `lastName` | `string` | Required | User's last name |
| `email` | `string` | UK, Required | Unique identifier for login |
| `password` | `string` | Required (local) | Hashed password |
| `age` | `number` | Min: 18 | User's age |
| `gender` | `string` | Enum | male, female, other |
| `skills` | `array` | Default: [] | List of professional skills |
| `about` | `string` | Max: 300 | User biography/overview |
| `photoUrl` | `string` | Default: image | URL to profile image |
| `authProvider`| `string` | local/google | Authentication method |
| `role` | `string` | user/admin | User access level |
| `isVerified` | `boolean` | Default: false | Email verification status |
| `membershipType`| `string` | - | Type of premium plan |
| `plan` | `string` | FREE/PREMIUM | Current subscription tier |
| `subscriptionStatus`| `string` | active/expired | Subscription state |
| `subscriptionStartDate`| `date` | - | Start of current subscription |
| `subscriptionEndDate`| `date` | - | Expiry date of subscription |
| `stripeCustomerId`| `string` | - | Stripe customer identifier |
| `stripeSubscriptionId`| `string` | - | Stripe subscription identifier |
| `lastLogin` | `date` | - | Timestamp of last activity |
| `createdAt` | `date` | - | Account creation timestamp |

#### 📝 Blog Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK | Unique identifier |
| `userId` | `ObjectId` | FK (User) | Author of the blog |
| `title` | `string` | Required | Blog post title |
| `content` | `string` | Required | Rich text HTML content |
| `category` | `string` | - | Blog categorization |
| `tags` | `array` | - | Searchable tags |
| `createdAt` | `date` | - | Publication timestamp |

#### 🤝 Connection Request Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK | Unique identifier |
| `fromUserId` | `ObjectId` | FK (User) | User sending the request |
| `toUserId` | `ObjectId` | FK (User) | User receiving the request |
| `status` | `string` | Enum | pending, accepted, rejected, ignored |
| `createdAt` | `date` | - | Request timestamp |

#### 💬 Chat Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK | Unique identifier |
| `senderId` | `ObjectId` | FK (User) | Message sender |
| `receiverId` | `ObjectId` | FK (User) | Message recipient |
| `message` | `string` | Required | Chat message content |
| `isRead` | `boolean` | Default: false | Message read status |
| `createdAt` | `date` | - | Sent timestamp |

#### 🔑 OTP Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK | Unique identifier |
| `email` | `string` | Required | Target email for verification |
| `otp` | `string` | Required | 6-digit verification code |
| `expiresAt` | `date` | Index | auto-deleted after expiry |
| `createdAt` | `date` | - | Generation timestamp |

---

## ☁️ Deployment Architecture

### Production Deployment

The backend is deployed on **AWS EC2** with a fully automated **CI/CD pipeline** using **GitHub Actions** and **Docker Hub**.

```mermaid
graph TB
    Dev[Developer] -->|Push Code| GH[GitHub Repository]
    GH -->|Webhook Trigger| GA[GitHub Actions CI/CD]
    
    subgraph "CI/CD Pipeline"
        GA -->|1. Build| DockerBuild[Docker Build]
        DockerBuild -->|2. Test| Tests[Run Tests]
        Tests -->|3. Push| DH[Docker Hub Registry]
    end
    
    subgraph "AWS Infrastructure"
        DH -->|4. Pull Image| EC2[AWS EC2 Instance]
        EC2 -.->|Elastic IP| EIP[Static IP Address]
        EC2 -->|5. Run Container| Container[Docker Container:5000]
    end
    
    subgraph "Network Layer"
        Domain[Custom Domain] -->|DNS A Record| EIP
        Client[Client Apps] -->|HTTPS Request| Domain
        Domain -->|SSL/TLS| Nginx[Nginx Reverse Proxy]
        Nginx -->|Proxy Pass| Container
    end
    
    Container -->|Secure Connection| DB[(MongoDB Atlas)]
    Container -->|WebSocket| WS[Socket.io]
```

### Deployment Strategy

Our production deployment follows a **containerized microservices** approach with automated CI/CD:

#### 🔄 CI/CD Pipeline (GitHub Actions)

**Trigger**: Push to `main` branch or Pull Request merge

**Workflow Steps**:
```yaml
1. Checkout Code → 2. Build Docker Image → 3. Run Tests → 
4. Push to Docker Hub → 5. SSH to EC2 → 6. Pull Latest Image → 
7. Stop Old Container → 8. Start New Container → 9. Health Check
```

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
- **Build**: Creates optimized Docker image with multi-stage build
- **Push**: Pushes image to Docker Hub with version tags
- **Deploy**: SSH into EC2 and executes deployment script
- **Rollback**: Previous image retained for quick rollback

#### 🖥️ AWS EC2 Configuration

| Configuration | Details |
|--------------|---------|
| **Instance Type** | t2.medium (2 vCPU, 4GB RAM) |
| **Operating System** | Ubuntu 22.04 LTS |
| **Elastic IP** | Static IP address attached for persistent endpoint |
| **Security Group** | Ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (App) |
| **Docker** | Docker Engine + Docker Compose |

#### 🌐 Domain & SSL Configuration

**Custom Domain Setup**:
- **Domain Registrar**: Custom domain configured with DNS provider
- **DNS Configuration**: A record pointing to Elastic IP
- **SSL Certificate**: Let's Encrypt via Certbot (Auto-renewal enabled)
- **SSL Termination**: Nginx handles HTTPS and forwards to backend on port 5000

**Nginx Configuration** (`/etc/nginx/sites-available/connexto`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 🐳 Docker Deployment

**Docker Hub Repository**: `username/connexto-backend:latest`

**Deployment Commands** (Auto-executed via CI/CD):
```bash
# Pull latest image from Docker Hub
docker pull username/connexto-backend:latest

# Stop and remove old container
docker stop connexto-backend && docker rm connexto-backend

# Run new container with environment variables
docker run -d \
  --name connexto-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env \
  -v /var/logs/connexto:/app/logs \
  username/connectly-backend:latest

# Verify deployment
curl https://yourdomain.com/health
```

### Infrastructure Components

| Component | Service | Description |
|-----------|---------|-------------|
| **Compute** | AWS EC2 (t2.medium) | Application server with Docker runtime |
| **Network** | Elastic IP | Static IP address for domain configuration |
| **Database** | MongoDB Atlas | Managed MongoDB cluster with auto-scaling |
| **Container Registry** | Docker Hub | Stores versioned Docker images |
| **Reverse Proxy** | Nginx | SSL termination and load balancing |
| **SSL/TLS** | Let's Encrypt | Free SSL certificates with auto-renewal |
| **CI/CD** | GitHub Actions | Automated build, test, and deployment |
| **Monitoring** | Winston Logs | Application logs persisted to EC2 volumes |
| **Domain** | Custom Domain | Professional domain with HTTPS |

### Deployment Benefits

✅ **Zero-Downtime Deployment**: New containers start before old ones stop  
✅ **Automatic Rollback**: Previous Docker image retained for instant rollback  
✅ **Scalability**: Easy horizontal scaling by adding EC2 instances  
✅ **Security**: HTTPS enforced, SSL auto-renewed, environment variables encrypted  
✅ **Monitoring**: Centralized logging and health check endpoints  
✅ **Cost-Effective**: Elastic IP ensures no IP changes, reducing DNS propagation issues

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (Local or Atlas connection string)
- **Docker** (optional)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/kartik7310/Connectly.git
   cd Connectly
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   # Create .env and follow the configuration below
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   # Create .env (VITE_BASE_URL=http://localhost:5000/api/v1)
   npm run dev
   ```

### Environment Variables

#### Backend (`/Backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_id
stripe_KEY_ID=your_id
stripe_KEY_SECRET=your_secret
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url
ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend (`/frontend/.env`)

```env
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your_id
VITE_SOCKET_URL=http://localhost:5000
```

### Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t connectly-backend .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **View Logs**
   ```bash
   docker-compose logs -f
   ```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Runtime** | Node.js v18+ | JavaScript runtime |
| **Framework** | Express.js v5.1 | Web application framework |
| **Database** | MongoDB + Mongoose | NoSQL database and ODM |
| **Real-time** | Socket.io v4.8 | WebSocket communication |
| **Authentication** | JWT + Google OAuth | Secure authentication |
| **Validation** | Zod v4.1 | Schema validation |
| **Logging** | Winston v3.18 | Application logging |
| **Payments** | stripe v2.9 | Payment gateway |
| **Media** | ImageKit v6.0 | Image optimization and delivery |
| **Security** | bcrypt v6.0 | Password hashing |
| **DevOps** | Docker + Docker Compose | Containerization |

---

## 📝 Development Guidelines

### Code Style

- Use **ES6 modules** (`import/export`)
- Follow **MVC pattern** strictly
- Keep controllers thin, services fat
- Use **async/await** for asynchronous operations
- Handle errors with try-catch and global error handler

### Error Handling

All errors are handled through the global error middleware:

```javascript
import AppError from './utils/AppError.js';

// In service or controller
throw new AppError('User not found', 404);
```

### Logging

Use the Winston logger for all logging:

```javascript
import logger from './config/logger.js';

logger.info('User logged in successfully');
logger.error('Database connection failed', { error });
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

<div align="center">

**Built with ❤️ by the Connectly Team**

[Report Bug](https://github.com/kartik7310/Connectly/issues) · [Request Feature](https://github.com/kartik7310/Connectly/issues)

</div>
