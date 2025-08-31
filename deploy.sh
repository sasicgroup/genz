#!/bin/bash

# GenZ AI Agents - Deployment Script
# This script automates the deployment process for the GenZ AI Agents platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="genz-ai-agents"
DOCKER_IMAGE="genz-ai-agents:latest"
DOMAIN="your-domain.com"
EMAIL="admin@your-domain.com"

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before continuing"
        read -p "Press Enter after editing .env file..."
    fi
    
    # Create necessary directories
    mkdir -p uploads logs ssl
    
    print_success "Environment setup completed"
}

# Function to build and start services
deploy_services() {
    print_status "Deploying services..."
    
    # Build the Docker image
    print_status "Building Docker image..."
    docker build -t $DOCKER_IMAGE .
    
    # Start services with Docker Compose
    print_status "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    print_status "Checking service health..."
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Application is running successfully"
    else
        print_error "Application health check failed"
        exit 1
    fi
}

# Function to setup SSL with Let's Encrypt
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    # Check if domain is configured
    if [ "$DOMAIN" = "your-domain.com" ]; then
        print_warning "Domain not configured. Skipping SSL setup."
        return
    fi
    
    # Create nginx configuration
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }
    
    server {
        listen 80;
        server_name $DOMAIN;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://\$host\$request_uri;
        }
    }
    
    server {
        listen 443 ssl;
        server_name $DOMAIN;
        
        ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
        
        location / {
            proxy_pass http://app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF
    
    # Setup Let's Encrypt
    docker run --rm -it \
        -v "$(pwd)/ssl:/etc/letsencrypt" \
        -v "$(pwd)/ssl:/var/lib/letsencrypt" \
        -v "$(pwd):/var/www/certbot" \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN
    
    print_success "SSL certificate setup completed"
}

# Function to setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Create Prometheus configuration
    cat > prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'genz-ai-agents'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s
EOF
    
    # Create Grafana provisioning
    mkdir -p grafana/datasources grafana/dashboards
    
    cat > grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF
    
    print_success "Monitoring setup completed"
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo "===================="
    
    # Show running containers
    echo "Running containers:"
    docker-compose ps
    
    echo ""
    
    # Show service URLs
    echo "Service URLs:"
    echo "- Application: http://localhost:3000"
    echo "- MongoDB: localhost:27017"
    echo "- Redis: localhost:6379"
    echo "- Prometheus: http://localhost:9090"
    echo "- Grafana: http://localhost:3001 (admin/admin)"
    
    if [ "$DOMAIN" != "your-domain.com" ]; then
        echo "- Production URL: https://$DOMAIN"
    fi
    
    echo ""
    
    # Show logs
    echo "Recent application logs:"
    docker-compose logs --tail=10 app
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    docker-compose down
    docker system prune -f
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    echo "🚀 GenZ AI Agents - Deployment Script"
    echo "====================================="
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Setup environment
    setup_environment
    
    # Deploy services
    deploy_services
    
    # Setup SSL (optional)
    if [ "$1" = "--ssl" ]; then
        setup_ssl
    fi
    
    # Setup monitoring
    setup_monitoring
    
    # Show status
    show_status
    
    echo ""
    print_success "Deployment completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Visit http://localhost:3000 to access the application"
    echo "2. Create your first user account"
    echo "3. Configure your AI provider API keys in .env"
    echo "4. Start building with AI agents!"
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --ssl        Setup SSL certificate with Let's Encrypt"
    echo "  --cleanup    Clean up all containers and images"
    echo "  --status     Show deployment status"
    echo "  --help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Basic deployment"
    echo "  $0 --ssl        # Deployment with SSL"
    echo "  $0 --cleanup    # Clean up deployment"
}

# Parse command line arguments
case "$1" in
    --ssl)
        main --ssl
        ;;
    --cleanup)
        cleanup
        ;;
    --status)
        show_status
        ;;
    --help|-h)
        show_help
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac