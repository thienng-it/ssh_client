# Docker Deployment Guide

## Architecture

- **Frontend**: React + Vite app served by Nginx (port 80)
- **Backend**: Node.js WebSocket server for SSH connections (port 3001)
- **Traefik**: Uses existing Traefik instance (shared with other apps)
- **Nginx**: Proxies `/ws` to backend for WebSocket connections

## Prerequisites

- Docker and Docker Compose installed
- **Existing Traefik instance** with network named `traefik-network`
- Domain name configured in DNS

## Setup for Shared Traefik (Production)

### 1. Verify Traefik Network

Check if Traefik network exists:
```bash
docker network ls | grep traefik
```

If not, create it:
```bash
docker network create traefik-network
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Update:
- `SSH_DOMAIN`: Your domain (e.g., ssh.example.com)

### 3. Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Check Status

```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Local Testing (No Traefik)

For local development without Traefik:

```bash
docker-compose -f docker-compose.local.yml up -d --build
```

**Access**: http://localhost:8080

## Services

| Service | Internal Port | Description |
|---------|---------------|-------------|
| Frontend | 80 | React app + Nginx |
| Backend | 3001 | WebSocket SSH server |

## Access

- **Production**: https://yourdomain.com
- **Local**: http://localhost:8080

## How It Works

1. Existing Traefik routes `yourdomain.com` to frontend container
2. Traefik terminates SSL and forwards to Nginx (frontend:80)
3. Nginx serves React app for all routes
4. WebSocket connections to `/ws` are proxied to backend:3001
5. Backend handles SSH connections via WebSocket

## Networks

- **traefik-network**: External network shared with Traefik and other apps
- **ssh-internal**: Internal network for frontend ↔ backend communication

## Updating

```bash
git pull
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

**Traefik network not found:**
```bash
docker network create traefik-network
```

**Port conflicts:**
This setup doesn't expose any ports directly - everything goes through Traefik.

**WebSocket connection fails:**
```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Check if backend is reachable from frontend
docker-compose -f docker-compose.prod.yml exec frontend ping backend
```

**Container not showing in Traefik:**
```bash
# Check Traefik logs
docker logs traefik

# Verify labels
docker inspect ssh-frontend | grep traefik
```

## Multiple Apps on Same Server

This setup is designed to coexist with other apps:

✅ **No port conflicts** - Uses existing Traefik on ports 80/443
✅ **Shared SSL certificates** - Traefik handles all domains
✅ **Isolated networks** - Internal network for app communication
✅ **Unique container names** - `ssh-frontend`, `ssh-backend`
✅ **Unique router names** - `ssh-frontend`, `ssh-frontend-http`

## Example Traefik Setup

If you need to verify your Traefik configuration supports this:

```yaml
# Your existing Traefik should have:
networks:
  traefik-network:
    external: true

# And expose Docker socket:
volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro
```

## Security

- ✅ HTTPS enforced (via existing Traefik)
- ✅ Internal network for backend (not exposed)
- ✅ WebSocket over TLS (WSS)
- ✅ No port conflicts with other apps
