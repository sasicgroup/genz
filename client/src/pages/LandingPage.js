import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Sparkles,
  Users,
  BarChart3,
  Code,
  Palette
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Agents',
      description: 'Intelligent AI agents specialized in different domains and tasks',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant communication with AI agents using WebSocket technology',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FileText,
      title: 'File Processing',
      description: 'Upload and process documents, images, and various file types',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with caching and efficient algorithms',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with JWT authentication',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Web Integration',
      description: 'Web scraping and data extraction capabilities',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const stats = [
    { label: 'AI Models', value: '4+' },
    { label: 'File Types', value: '10+' },
    { label: 'Response Time', value: '<1s' },
    { label: 'Uptime', value: '99.9%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">GenZ AI Agents</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border border-white/20 dark:border-secondary-700/20 hover:bg-white dark:hover:bg-secondary-700 transition-colors"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
            <Link
              to="/login"
              className="btn-secondary"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Next-Gen</span> AI Agents
            </h1>
            <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-300 mb-8 max-w-3xl mx-auto">
              Experience the future of AI interaction with our intelligent agents. 
              Chat, create, analyze, and automate with cutting-edge AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Start Building</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full opacity-20 blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-accent-400 to-purple-400 rounded-full opacity-20 blur-xl"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Modern AI
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
              Discover the comprehensive toolkit that makes GenZ AI Agents the most advanced 
              AI platform for developers and businesses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your AI Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers and businesses already using GenZ AI Agents
            </p>
            <Link
              to="/register"
              className="btn-accent bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-secondary-200 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">GenZ AI</span>
              </div>
              <p className="text-secondary-600 dark:text-secondary-400">
                Next-generation AI agents for the modern world.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                <li><a href="#" className="hover:text-primary-600">Features</a></li>
                <li><a href="#" className="hover:text-primary-600">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-600">API</a></li>
                <li><a href="#" className="hover:text-primary-600">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                <li><a href="#" className="hover:text-primary-600">About</a></li>
                <li><a href="#" className="hover:text-primary-600">Blog</a></li>
                <li><a href="#" className="hover:text-primary-600">Careers</a></li>
                <li><a href="#" className="hover:text-primary-600">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                <li><a href="#" className="hover:text-primary-600">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-600">Community</a></li>
                <li><a href="#" className="hover:text-primary-600">Status</a></li>
                <li><a href="#" className="hover:text-primary-600">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-200 dark:border-secondary-700 mt-8 pt-8 text-center text-secondary-600 dark:text-secondary-400">
            <p>&copy; 2024 GenZ AI Agents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;