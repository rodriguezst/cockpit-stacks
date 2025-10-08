#!/bin/bash
# Installation script for Cockpit Stacks Manager

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cockpit Stacks Manager Installation ===${NC}"
echo

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Check if Cockpit is installed
echo -e "${YELLOW}Checking for Cockpit...${NC}"
if ! command -v cockpit-bridge &> /dev/null; then
    echo -e "${RED}Cockpit is not installed. Please install Cockpit first.${NC}"
    echo "Visit: https://cockpit-project.org/running.html"
    exit 1
fi
echo -e "${GREEN}✓ Cockpit is installed${NC}"

# Check if Docker is installed
echo -e "${YELLOW}Checking for Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/engine/install/"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose V2 is installed
echo -e "${YELLOW}Checking for Docker Compose V2...${NC}"
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Docker Compose V2 is not installed. Please install Docker Compose V2.${NC}"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose V2 is installed${NC}"

# Create Cockpit package directory
echo -e "${YELLOW}Installing Cockpit Stacks package...${NC}"
COCKPIT_DIR="/usr/share/cockpit/cockpit-stacks"
mkdir -p "$COCKPIT_DIR"

# Copy files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp -r "$SCRIPT_DIR"/{manifest.json,index.html,stacks.js,stacks.css} "$COCKPIT_DIR/"

echo -e "${GREEN}✓ Package files copied${NC}"

# Create stacks directory
STACKS_DIR="/var/stacks"
echo -e "${YELLOW}Creating stacks directory at ${STACKS_DIR}...${NC}"
mkdir -p "$STACKS_DIR"
chmod 755 "$STACKS_DIR"
echo -e "${GREEN}✓ Stacks directory created${NC}"

# Check if Cockpit is running
echo -e "${YELLOW}Checking Cockpit service...${NC}"
if systemctl is-active --quiet cockpit.socket; then
    echo -e "${GREEN}✓ Cockpit is running${NC}"
    echo -e "${YELLOW}Restarting Cockpit...${NC}"
    systemctl restart cockpit.socket
    echo -e "${GREEN}✓ Cockpit restarted${NC}"
else
    echo -e "${YELLOW}Starting Cockpit...${NC}"
    systemctl enable --now cockpit.socket
    echo -e "${GREEN}✓ Cockpit started${NC}"
fi

# Get server IP/hostname
HOSTNAME=$(hostname -f 2>/dev/null || hostname)
IP=$(hostname -I | awk '{print $1}')

echo
echo -e "${GREEN}=== Installation Complete! ===${NC}"
echo
echo "You can now access Cockpit Stacks Manager at:"
echo -e "${GREEN}  https://${HOSTNAME}:9090${NC}"
echo -e "${GREEN}  https://${IP}:9090${NC}"
echo
echo "Look for 'Docker Stacks' in the left menu."
echo
echo "Note: Make sure your user is in the 'docker' group to manage stacks:"
echo "  sudo usermod -aG docker \$USER"
echo "  (logout and login again for changes to take effect)"
echo
