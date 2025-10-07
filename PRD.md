# Product Requirements Document: Docker Compose Stacks Manager for Cockpit

## 1. Introduction

This document outlines the functional requirements for a self-hosted, easy-to-use, and reactive manager for Docker Compose YAML stacks. The primary goal is to provide a user-friendly web interface to manage `compose.yaml` files, interact with Docker stacks, and perform related operations with real-time feedback.

## 2. Core Stack Management Functionalities

*   **FR-1.1: Stack Creation:** The system shall enable users to create new Docker Compose stacks by providing a name and initial `compose.yaml` content, resulting in a new directory (e.g., `/opt/stacks/<stackName>/`) containing the `compose.yaml` file.
*   **FR-1.2: Stack Editing:** The system shall provide an interactive web-based editor for modifying existing `compose.yaml` files. This editor should, at a minimum, offer YAML syntax highlighting and line numbers.
*   **FR-1.3: Stack Starting:** The system shall allow users to start a Docker Compose stack, which involves executing a command equivalent to `docker compose up -d` in the stack's directory, with real-time output streamed to the user interface.
*   **FR-1.4: Stack Stopping:** The system shall allow users to stop a running Docker Compose stack, which involves executing a command equivalent to `docker compose down` in the stack's directory, with real-time output streamed to the user interface.
*   **FR-1.5: Stack Restarting:** The system shall allow users to restart a Docker Compose stack. This operation should first stop the stack and then start it again, providing real-time feedback for both phases.
*   **FR-1.6: Stack Deletion:** The system shall allow users to delete a Docker Compose stack. This should involve stopping the stack if it's running, and then deleting the stack's directory and its `compose.yaml` file from the filesystem, typically after user confirmation.
*   **FR-1.7: Docker Image Updating:** The system shall allow users to update Docker images for a stack. This involves pulling the latest versions of images defined in the `compose.yaml` (e.g., via `docker compose pull`) and then restarting the stack to use these new images, with real-time feedback during the pull and restart process.
*   **FR-1.8: File-Based Stack Structure:** The system shall store `compose.yaml` files and associated stack data in a user-configurable directory on the server's filesystem (defaulting to `/var/stacks`). Each stack will reside in its own subdirectory (e.g., `/var/stacks/<stackName>/compose.yaml`), allowing for direct interaction via standard `docker compose` commands outside the application if desired.
*   **FR-1.9: Stack Discovery:** The system shall be able to scan the designated stacks directory to discover existing `compose.yaml` files and list them as manageable stacks within the interface.
*   **FR-1.10: Docker Compose V2 Utilization:** The system shall utilize Docker Compose V2 (invoked via `docker compose` commands) for all stack-related operations.
*   **FR-1.11: Reactive UI for Operations:** The system shall provide a reactive user interface that offers real-time updates and streaming output for all stack operations (e.g., pull, up, down), ensuring users are informed of progress and any errors immediately.

## 3. User Interface and Interaction Experience

*   **FR-2.1: Interactive Compose Editor:** The system shall provide an interactive web-based editor for `compose.yaml` files, featuring at least YAML syntax highlighting and line numbers to facilitate editing.
*   **FR-2.2: User-Friendly and Fancy UI:** The system shall aim for an easy-to-use and aesthetically pleasing user interface, drawing inspiration from tools known for good UI/UX like Uptime Kuma, ensuring clarity and responsiveness.
*   **FR-2.3: UI Style and Theme:** The system shall implement the same look and feel of Cockpit (https://cockpit-project.org/)

## 5. System and Operational Requirements

*   **FR-3.1: Technology Stack (Backend):** The backend should be built according to Cockpit Packages documentation (https://cockpit-project.org/guide/latest/packages.html).
*   **FR-3.2: Real-Time Communication:** The system shall implement real-time, bidirectional communication between the server and the client, and between the main instance and agent instances using Cockpit APIs.
*   **FR-3.3: Docker Daemon Access:** The application (or its agent components) will require access to the Docker daemon on the host machine, typically achieved by mounting `/var/run/docker.sock`.
*   **FR-3.4: Configurable Stacks Directory:** The path to the stacks directory shall be configurable (e.g., via environment variables or a settings file), defaulting to `/var/stacks`.
*   **FR-3.5: Configurable Application Port:** The port on which the main web interface listens shall be configurable, defaulting to port 5001.
*   **FR-3.6: User Authentication:** The system will not implement user authentication to restrict access to the management interface. The user shall use an external reverse proxy (e.g., caddy) for this purpose.
*   **FR-3.7: Command Execution Environment:** The system must be able to execute `docker compose` commands. This requires that the Docker CLI and Docker Compose V2 are installed and accessible in the environment where the application/agent runs.
