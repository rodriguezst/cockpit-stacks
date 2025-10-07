# Quick Start Guide

## Prerequisites

Before installing Cockpit Stacks Manager, ensure you have:

1. **Cockpit** installed and running
   - Ubuntu/Debian: `sudo apt install cockpit`
   - RHEL/CentOS/Fedora: `sudo dnf install cockpit`
   - See: https://cockpit-project.org/running.html

2. **Docker Engine** installed
   - Follow: https://docs.docker.com/engine/install/

3. **Docker Compose V2** (usually comes with Docker Engine)
   - Verify with: `docker compose version`

## Installation

### Option 1: Using the install script (Recommended)

```bash
# Clone the repository
git clone https://github.com/rodriguezst/cockpit-stacks.git
cd cockpit-stacks

# Run the installation script
sudo ./install.sh
```

### Option 2: Manual installation

```bash
# Clone the repository
git clone https://github.com/rodriguezst/cockpit-stacks.git

# Copy to Cockpit's package directory
sudo mkdir -p /usr/share/cockpit/cockpit-stacks
sudo cp -r cockpit-stacks/{manifest.json,index.html,stacks.js,stacks.css} /usr/share/cockpit/cockpit-stacks/

# Create stacks directory
sudo mkdir -p /var/stacks
sudo chmod 755 /var/stacks

# Restart Cockpit
sudo systemctl restart cockpit.socket
```

## First Time Setup

1. **Add your user to the docker group** (required to run Docker commands):
   ```bash
   sudo usermod -aG docker $USER
   ```
   Then log out and log back in.

2. **Access Cockpit**:
   - Open your browser and navigate to: `https://your-server:9090`
   - Log in with your system credentials

3. **Find Docker Stacks**:
   - Look for "Docker Stacks" in the left menu
   - Click to open the Stacks Manager

## Creating Your First Stack

1. Click the **"Create New Stack"** button
2. Enter a name for your stack (e.g., `nginx-test`)
3. Edit the compose.yaml content (or use the default)
4. Click **"Create"**

Example compose.yaml:
```yaml
version: "3"
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
```

5. Click the **"Start"** button to start your stack
6. Watch the real-time output as Docker downloads and starts the containers

## Common Operations

### Starting a Stack
- Click the **"Start"** button on a stopped stack
- Watch real-time output as containers start

### Stopping a Stack
- Click the **"Stop"** button on a running stack
- Containers will be stopped and removed

### Editing a Stack
- Click the **"Edit"** button
- Modify the YAML content
- Click **"Save"**
- Restart the stack to apply changes

### Updating Images
- Click the **"Update Images"** button
- Docker will pull the latest versions
- Stack will automatically restart with new images

### Deleting a Stack
- Click the **"Delete"** button
- Confirm the deletion
- Stack will be stopped and all files removed

## Example Stacks

### WordPress with MySQL
```yaml
version: "3"
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppass
    volumes:
      - db_data:/var/lib/mysql
  
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppass
      WORDPRESS_DB_NAME: wordpress
    depends_on:
      - db

volumes:
  db_data:
```

### Simple Web Server with Nginx
```yaml
version: "3"
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
```

### Monitoring Stack (Prometheus + Grafana)
```yaml
version: "3"
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

## Troubleshooting

### "Permission denied" when running commands
- Ensure your user is in the `docker` group: `groups $USER`
- If not, add them: `sudo usermod -aG docker $USER`
- Log out and log back in

### Stack list is empty
- Check that `/var/stacks` exists and is readable
- Verify Cockpit has proper permissions

### Docker commands fail
- Verify Docker is running: `sudo systemctl status docker`
- Check Docker Compose V2: `docker compose version`
- View logs: `journalctl -u docker`

### Changes to compose.yaml not taking effect
- After editing, restart the stack
- Or stop and start the stack manually

### Cockpit shows errors
- Check Cockpit logs: `journalctl -u cockpit`
- Restart Cockpit: `sudo systemctl restart cockpit.socket`
- Clear browser cache

## Tips

1. **Use Stack Names Wisely**: Use lowercase, hyphens, and no spaces
2. **Check Status Regularly**: The UI auto-refreshes every 10 seconds
3. **Monitor Output**: Watch the real-time output during operations
4. **Backup Stacks**: Your stacks are in `/var/stacks` - back them up!
5. **External Access**: Can manage stacks directly via CLI in `/var/stacks/<stack-name>/`

## Next Steps

- Explore the example stacks above
- Create your own custom stacks
- Set up monitoring and logging
- Configure reverse proxy for production use
- Check out the full [README.md](README.md) for more details

## Getting Help

- Report issues: https://github.com/rodriguezst/cockpit-stacks/issues
- Cockpit documentation: https://cockpit-project.org/guide/latest/
- Docker Compose docs: https://docs.docker.com/compose/
