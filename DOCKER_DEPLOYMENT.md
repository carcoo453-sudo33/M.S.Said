# Docker Deployment Guide

This guide explains how to build and deploy the Portfolio application using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Portfolio
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```env
# Database
DB_CONNECTION_STRING=Server=your-server;Database=PortfolioDB;User Id=your-user;Password=your-password;TrustServerCertificate=True

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Email Settings
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Portfolio
```

### 3. Build and Run with Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Individual Container Builds

### Build API Only

```bash
cd Portfolio.API
docker build -t portfolio-api:latest .
docker run -p 5283:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="your-connection-string" \
  portfolio-api:latest
```

### Build UI Only

```bash
cd Portfolio.UI
docker build -t portfolio-ui:latest .
docker run -p 4200:80 portfolio-ui:latest
```

## GitHub Actions CI/CD

The repository includes a GitHub Actions workflow that automatically:

1. Builds Docker images on push to main/master
2. Pushes images to GitHub Container Registry (ghcr.io)
3. Tags images with branch name and commit SHA

### Setup GitHub Actions

1. Go to your repository settings
2. Navigate to Actions > General
3. Enable "Read and write permissions" for GITHUB_TOKEN
4. Push to main/master branch to trigger the workflow

### Pull Images from Registry

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull images
docker pull ghcr.io/your-username/portfolio/api:latest
docker pull ghcr.io/your-username/portfolio/ui:latest
```

## Production Deployment

### Using Docker Compose

1. Update `docker-compose.yml` with production settings
2. Set environment variables in `.env` file
3. Deploy:

```bash
docker-compose -f docker-compose.yml up -d
```

### Using Kubernetes

Create deployment files:

```yaml
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: portfolio-api
  template:
    metadata:
      labels:
        app: portfolio-api
    spec:
      containers:
      - name: api
        image: ghcr.io/your-username/portfolio/api:latest
        ports:
        - containerPort: 8080
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: db-connection
```

## Troubleshooting

### Build Failures

1. **Node modules error**: Clear npm cache
   ```bash
   cd Portfolio.UI
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Restore error**: Clear NuGet cache
   ```bash
   cd Portfolio.API
   dotnet clean
   dotnet restore
   ```

3. **Permission denied**: Check Docker daemon is running
   ```bash
   docker ps
   ```

### Runtime Issues

1. **API not connecting to database**: Check connection string in environment variables

2. **UI can't reach API**: Update API URL in `Portfolio.UI/src/environments/environment.prod.ts`

3. **Port conflicts**: Change ports in `docker-compose.yml`

## Health Checks

### API Health Check

```bash
curl http://localhost:5283/api/projects/health
```

### UI Health Check

```bash
curl http://localhost:4200
```

## Logs

### View API Logs

```bash
docker-compose logs -f api
```

### View UI Logs

```bash
docker-compose logs -f ui
```

## Cleanup

### Remove Containers

```bash
docker-compose down
```

### Remove Images

```bash
docker rmi portfolio-api:latest portfolio-ui:latest
```

### Remove Volumes

```bash
docker-compose down -v
```

## Performance Optimization

1. **Multi-stage builds**: Already implemented in Dockerfiles
2. **Layer caching**: Dependencies are cached separately
3. **Image size**: Using Alpine Linux for smaller images
4. **Nginx caching**: Configured in `nginx.conf`

## Security Best Practices

1. Never commit `.env` files
2. Use secrets management in production
3. Keep base images updated
4. Scan images for vulnerabilities:
   ```bash
   docker scan portfolio-api:latest
   ```

## Support

For issues or questions, please open an issue on GitHub.
