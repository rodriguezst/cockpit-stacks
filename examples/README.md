# Example Docker Compose Stacks

This directory contains example `compose.yaml` files that you can use as templates for creating your own stacks.

## Available Examples

### 1. nginx-simple.yaml
A basic Nginx web server.
- **Port**: 8080
- **Use case**: Simple web server, reverse proxy
- **Image**: nginx:alpine

### 2. wordpress.yaml
Complete WordPress installation with MySQL database.
- **Ports**: 8080 (WordPress)
- **Services**: WordPress + MySQL 8.0
- **Features**: Persistent volumes for data and uploads
- **Environment variables**: Configurable passwords

### 3. monitoring.yaml
Monitoring stack with Prometheus and Grafana.
- **Ports**: 9090 (Prometheus), 3000 (Grafana)
- **Services**: Prometheus + Grafana
- **Features**: Metrics collection and visualization
- **Default credentials**: admin/admin (configurable)

### 4. redis.yaml
Redis cache server.
- **Port**: 6379
- **Use case**: Caching, session storage
- **Features**: Data persistence with AOF

## Using These Examples

### Method 1: Through Cockpit UI
1. Open Cockpit Stacks Manager
2. Click "Create New Stack"
3. Copy the content from any example file
4. Paste into the editor
5. Give your stack a name
6. Click "Create"

### Method 2: Direct Filesystem
1. Copy the example to `/var/stacks/`
   ```bash
   sudo mkdir -p /var/stacks/my-stack
   sudo cp examples/nginx-simple.yaml /var/stacks/my-stack/compose.yaml
   ```
2. Refresh the Cockpit Stacks Manager
3. Your stack will appear in the list

## Best Practices

1. **Use specific image tags** instead of `latest` for production
2. **Set restart policies** to ensure containers auto-start
3. **Use volumes** for data that needs to persist
4. **Configure resource limits** to prevent resource exhaustion
5. **Use environment variables** for configuration
