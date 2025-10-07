# Cockpit Stacks - Docker Compose Manager for Cockpit

A self-hosted, easy-to-use, and reactive manager for Docker Compose YAML stacks, built as a Cockpit package.

## Features

- **Stack Management**: Create, edit, start, stop, restart, and delete Docker Compose stacks
- **Real-time Operations**: Stream output from Docker Compose commands in real-time
- **YAML Editor**: Built-in YAML editor with syntax highlighting and line numbers
- **Stack Discovery**: Automatically discover existing stacks from the filesystem
- **Image Updates**: Pull latest Docker images and restart stacks
- **Cockpit Integration**: Seamless integration with Cockpit's UI and APIs

## Requirements

- Cockpit (version 276 or later)
- Docker Engine
- Docker Compose V2
- Linux system with systemd

## Installation

### Method 1: Manual Installation

1. Clone or download this repository:
```bash
git clone https://github.com/rodriguezst/cockpit-stacks.git
```

2. Copy the package to Cockpit's package directory:
```bash
sudo mkdir -p /usr/share/cockpit
sudo cp -r cockpit-stacks /usr/share/cockpit/cockpit-stacks
```

3. Restart Cockpit:
```bash
sudo systemctl restart cockpit
```

4. Create the stacks directory:
```bash
sudo mkdir -p /var/stacks
sudo chmod 755 /var/stacks
```

### Method 2: From GitHub (for distribution)

```bash
sudo wget -O /tmp/cockpit-stacks.tar.gz https://github.com/rodriguezst/cockpit-stacks/archive/main.tar.gz
sudo mkdir -p /usr/share/cockpit/cockpit-stacks
sudo tar -xzf /tmp/cockpit-stacks.tar.gz -C /usr/share/cockpit/cockpit-stacks --strip-components=1
sudo systemctl restart cockpit
```

## Usage

1. Access Cockpit in your browser (typically at `https://your-server:9090`)
2. Log in with your system credentials
3. Click on "Docker Stacks" in the left menu
4. Create your first stack by clicking "Create New Stack"
5. Manage your stacks using the provided controls

## Configuration

### Stacks Directory

By default, stacks are stored in `/var/stacks`. Each stack has its own subdirectory:
```
/var/stacks/
  ├── my-stack/
  │   └── compose.yaml
  ├── another-stack/
  │   └── compose.yaml
  ...
```

You can change the stacks directory by modifying the `STACKS_DIR` constant in `stacks.js`.

### Docker Permissions

The Cockpit user needs permission to run Docker commands. Ensure your user is in the `docker` group:
```bash
sudo usermod -aG docker $USER
```

## Architecture

This application follows the Cockpit package structure:
- `manifest.json`: Package metadata and Cockpit integration
- `index.html`: Main UI layout with Cockpit styling
- `stacks.js`: Frontend logic using Cockpit's JavaScript APIs
- `stacks.css`: Custom styling following Cockpit's design patterns

## Operations

### Stack Creation
Creates a new directory under `/var/stacks/<stack-name>` with a `compose.yaml` file.

### Stack Starting
Executes `docker compose up -d` in the stack's directory.

### Stack Stopping
Executes `docker compose down` in the stack's directory.

### Stack Restarting
Stops the stack, then starts it again.

### Image Updating
Executes `docker compose pull` followed by `docker compose up -d` to update images.

### Stack Deletion
Stops the stack if running, then removes the entire stack directory.

## Development

To modify this package:

1. Edit the files in your local copy
2. Copy changes to `/usr/share/cockpit/cockpit-stacks/`
3. Refresh your browser (Ctrl+F5) to see changes

No build process is required as this is a pure HTML/CSS/JS application.

## Security Considerations

- This application does not implement authentication; use Cockpit's built-in authentication
- Docker socket access is managed through Cockpit's privilege system
- Consider using a reverse proxy (e.g., Caddy) for additional security layers

## Troubleshooting

### Stack list is empty
- Ensure `/var/stacks` directory exists and is readable
- Check that Docker is installed and running
- Verify Docker Compose V2 is available: `docker compose version`

### Permission denied errors
- Ensure your user is in the `docker` group
- Check filesystem permissions on `/var/stacks`
- Verify Cockpit has necessary permissions

### Operations fail
- Check Docker daemon is running: `sudo systemctl status docker`
- Verify Docker Compose is installed: `docker compose version`
- Check Cockpit logs: `journalctl -u cockpit`

## License

This project follows the licensing of the Cockpit project.

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## References

- [Cockpit Project](https://cockpit-project.org/)
- [Cockpit Package Documentation](https://cockpit-project.org/guide/latest/packages.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
