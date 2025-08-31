# 🚀 GenZ AI Agents - Next-Generation AI Platform

A comprehensive, full-stack AI agent platform built with modern technologies, featuring real-time chat, file processing, web scraping, and multiple AI providers.

![GenZ AI Agents](https://img.shields.io/badge/GenZ-AI%20Agents-blue?style=for-the-badge&logo=ai)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### 🤖 AI Agents
- **Multiple AI Providers**: OpenAI GPT-4, Anthropic Claude, and more
- **Specialized Agents**: General Assistant, Creative Writer, Code Assistant, Data Analyst
- **Custom Agent Creation**: Build your own AI agents with custom prompts
- **Real-time Responses**: Instant AI interactions with WebSocket technology

### 💬 Real-time Chat
- **Live Conversations**: Real-time chat with AI agents using Socket.IO
- **Conversation History**: Persistent chat history and context
- **Multi-agent Support**: Switch between different AI agents seamlessly
- **Typing Indicators**: Visual feedback during AI response generation

### 📁 File Management
- **Multi-format Support**: Upload and process various file types
- **Image Processing**: Automatic image optimization and resizing
- **Secure Storage**: Encrypted file storage with access control
- **File Sharing**: Share files between users and agents

### 🌐 Web Integration
- **Web Scraping**: Extract data from websites with custom selectors
- **Data Processing**: Clean and structure scraped data
- **API Integration**: Connect with external services and APIs
- **Automation**: Schedule and automate web tasks

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Rate Limiting**: API rate limiting and abuse prevention
- **CORS Protection**: Cross-origin resource sharing security

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first, responsive interface
- **Dark/Light Mode**: Theme switching with system preference detection
- **Smooth Animations**: Framer Motion animations and transitions
- **Accessibility**: WCAG compliant design patterns

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database (configurable)
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Multer** - File uploads
- **Sharp** - Image processing
- **Cron** - Scheduled tasks

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Socket.IO Client** - Real-time features
- **React Hook Form** - Form management
- **React Query** - Data fetching
- **Zustand** - State management

### AI & ML
- **OpenAI API** - GPT-4 integration
- **Anthropic API** - Claude integration
- **LangChain** - AI framework
- **Cheerio** - Web scraping
- **Puppeteer** - Browser automation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (optional, uses in-memory storage by default)
- Redis (optional, for production)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/genz-ai-agents.git
cd genz-ai-agents
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# AI Provider API Keys
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Database (Optional)
MONGODB_URI=mongodb://localhost:27017/genz-ai-agents
REDIS_URL=redis://localhost:6379

# External Services (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 4. Start Development Servers
```bash
# Start backend server
npm run dev

# In another terminal, start frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📱 Usage

### 1. User Registration
- Visit the landing page and click "Get Started"
- Fill in your username, email, and password
- Verify your account (if email verification is enabled)

### 2. AI Agent Interaction
- Choose from pre-built AI agents or create custom ones
- Start a conversation with your selected agent
- Upload files for processing and analysis
- Use web scraping to gather data from websites

### 3. File Management
- Upload various file types (images, documents, etc.)
- Process and optimize files automatically
- Share files with other users or AI agents
- Organize files in custom collections

### 4. Advanced Features
- Create custom AI agents with specific prompts
- Schedule automated tasks and workflows
- Integrate with external APIs and services
- Monitor usage statistics and performance

## 🏗️ Project Structure

```
genz-ai-agents/
├── server.js                 # Main server file
├── package.json             # Backend dependencies
├── .env                     # Environment variables
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── docs/                   # Documentation
├── tests/                  # Test files
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration
The server can be configured through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `MONGODB_URI` | MongoDB connection string | (in-memory) |
| `REDIS_URL` | Redis connection string | (disabled) |

### Frontend Configuration
Frontend configuration is in `client/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t genz-ai-agents .

# Run container
docker run -p 3000:3000 genz-ai-agents
```

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
MONGODB_URI=your-production-mongodb-uri
REDIS_URL=your-production-redis-url
```

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## 📊 Performance

- **Response Time**: < 1 second for AI responses
- **Concurrent Users**: Supports 1000+ simultaneous users
- **File Upload**: Up to 10MB per file
- **Real-time Chat**: WebSocket-based with fallback to polling

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting and abuse prevention
- CORS protection
- Input validation and sanitization
- Secure file uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Anthropic for Claude API
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/genz-ai-agents/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/genz-ai-agents/discussions)
- **Email**: support@genz-ai-agents.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/genz-ai-agents&type=Date)](https://star-history.com/#yourusername/genz-ai-agents&Date)

---

**Made with ❤️ by the GenZ AI Agents Team**

*Transform your AI experience today!*