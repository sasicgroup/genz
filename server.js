const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { ChatAnthropic } = require('langchain/chat_models/anthropic');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { HumanMessage, SystemMessage } = require('langchain/schema');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const stripe = require('stripe');
const Redis = require('redis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

// AI Providers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// In-memory storage for demo (replace with database in production)
let users = new Map();
let conversations = new Map();
let agents = new Map();
let files = new Map();

// Initialize default agents
const defaultAgents = [
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'A helpful AI assistant for general questions',
    provider: 'openai',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.',
    capabilities: ['chat', 'qa', 'writing']
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Specialized in creative writing and storytelling',
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    systemPrompt: 'You are a creative writing expert. Help users develop stories, characters, and creative content.',
    capabilities: ['writing', 'storytelling', 'creative']
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Expert in programming and software development',
    provider: 'openai',
    model: 'gpt-4',
    systemPrompt: 'You are a programming expert. Help users with code, debugging, and software development questions.',
    capabilities: ['coding', 'debugging', 'software']
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Specialized in data analysis and insights',
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    systemPrompt: 'You are a data analysis expert. Help users understand data, create visualizations, and derive insights.',
    capabilities: ['data-analysis', 'visualization', 'insights']
  }
];

defaultAgents.forEach(agent => agents.set(agent.id, agent));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      preferences: {},
      usage: { requests: 0, tokens: 0 }
    };

    users.set(email, user);
    
    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, username, email, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.get(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available agents
app.get('/api/agents', (req, res) => {
  const agentsList = Array.from(agents.values());
  res.json(agentsList);
});

// Create custom agent
app.post('/api/agents', authenticateToken, (req, res) => {
  try {
    const { name, description, provider, model, systemPrompt, capabilities } = req.body;
    
    const agent = {
      id: `agent-${Date.now()}`,
      name,
      description,
      provider,
      model,
      systemPrompt,
      capabilities: capabilities || [],
      createdBy: req.user.userId,
      createdAt: new Date(),
      isCustom: true
    };

    agents.set(agent.id, agent);
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat with agent
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { agentId, message, conversationId } = req.body;
    const agent = agents.get(agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    let response;
    let tokens = 0;

    if (agent.provider === 'openai') {
      const completion = await openai.chat.completions.create({
        model: agent.model,
        messages: [
          { role: 'system', content: agent.systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });
      
      response = completion.choices[0].message.content;
      tokens = completion.usage.total_tokens;
    } else if (agent.provider === 'anthropic') {
      const message = await anthropic.messages.create({
        model: agent.model,
        max_tokens: 1000,
        messages: [
          { role: 'user', content: message }
        ],
        system: agent.systemPrompt
      });
      
      response = message.content[0].text;
      tokens = message.usage.input_tokens + message.usage.output_tokens;
    }

    // Store conversation
    const convId = conversationId || `conv-${Date.now()}`;
    if (!conversations.has(convId)) {
      conversations.set(convId, []);
    }
    
    conversations.get(convId).push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    conversations.get(convId).push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    // Update user usage
    const user = users.get(req.user.email);
    if (user) {
      user.usage.requests += 1;
      user.usage.tokens += tokens;
    }

    res.json({
      response,
      conversationId: convId,
      tokens,
      agent: { id: agent.id, name: agent.name }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// File upload and processing
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = `file-${Date.now()}`;
    const fileInfo = {
      id: fileId,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.userId,
      uploadedAt: new Date(),
      buffer: req.file.buffer
    };

    // Process image files
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const processedImage = await sharp(req.file.buffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();
        
        fileInfo.processedBuffer = processedImage;
        fileInfo.processedSize = processedImage.length;
      } catch (error) {
        console.error('Image processing error:', error);
      }
    }

    files.set(fileId, fileInfo);
    
    res.json({
      message: 'File uploaded successfully',
      fileId,
      fileName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get file
app.get('/api/files/:fileId', authenticateToken, (req, res) => {
  const file = files.get(req.params.fileId);
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.set({
    'Content-Type': file.mimetype,
    'Content-Disposition': `attachment; filename="${file.originalName}"`
  });
  
  res.send(file.processedBuffer || file.buffer);
});

// Web scraping endpoint
app.post('/api/scrape', authenticateToken, async (req, res) => {
  try {
    const { url, selector } = req.body;
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    let data;
    if (selector) {
      data = $(selector).text().trim();
    } else {
      data = $('body').text().trim();
    }

    res.json({
      url,
      data: data.substring(0, 1000) + (data.length > 1000 ? '...' : ''),
      fullLength: data.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Web scraping failed' });
  }
});

// Scheduled tasks
cron.schedule('0 0 * * *', async () => {
  // Daily cleanup and maintenance
  console.log('Running daily maintenance...');
  
  // Clean up old conversations (older than 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  for (const [convId, messages] of conversations.entries()) {
    if (messages.length > 0 && messages[0].timestamp < thirtyDaysAgo) {
      conversations.delete(convId);
    }
  }
  
  // Clean up old files (older than 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  for (const [fileId, file] of files.entries()) {
    if (file.uploadedAt < sevenDaysAgo) {
      files.delete(fileId);
    }
  }
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send-message', async (data) => {
    try {
      const { agentId, message, conversationId } = data;
      const agent = agents.get(agentId);
      
      if (!agent) {
        socket.emit('error', { message: 'Agent not found' });
        return;
      }

      // Broadcast user message
      socket.to(conversationId).emit('user-message', {
        message,
        timestamp: new Date(),
        userId: socket.id
      });

      // Get AI response
      let response;
      if (agent.provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: agent.model,
          messages: [
            { role: 'system', content: agent.systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7
        });
        response = completion.choices[0].message.content;
      } else if (agent.provider === 'anthropic') {
        const message = await anthropic.messages.create({
          model: agent.model,
          max_tokens: 1000,
          messages: [
            { role: 'user', content: message }
          ],
          system: agent.systemPrompt
        });
        response = message.content[0].text;
      }

      // Broadcast AI response
      io.to(conversationId).emit('ai-response', {
        response,
        agent: { id: agent.id, name: agent.name },
        timestamp: new Date()
      });

    } catch (error) {
      socket.emit('error', { message: 'Failed to get AI response' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 GenZ AI Agents server running on port ${PORT}`);
  console.log(`📱 Real-time chat enabled with Socket.IO`);
  console.log(`🤖 ${agents.size} AI agents available`);
  console.log(`🔐 Authentication system ready`);
  console.log(`📁 File upload and processing enabled`);
  console.log(`🌐 Web scraping capabilities active`);
  console.log(`⏰ Scheduled tasks running`);
});

module.exports = app;