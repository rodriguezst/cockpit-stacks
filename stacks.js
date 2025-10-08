/* Docker Stacks Manager - Frontend JavaScript */

(function() {
    const cockpit = window.cockpit;
    let stacks = [];
    let currentStackName = null;
    let createEditor = null;
    let editEditor = null;

    // Default configuration
    const STACKS_DIR = '/var/stacks';

    // Initialize Cockpit connection
    const client = cockpit.dbus('org.freedesktop.systemd1');

    // Initialize CodeMirror editors
    function initEditors() {
        // Create stack editor
        const createTextArea = document.getElementById('create-editor');
        createEditor = CodeMirror.fromTextArea(createTextArea, {
            mode: 'yaml',
            theme: 'material',
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 2,
            tabSize: 2
        });
        createEditor.setValue('version: "3"\nservices:\n  example:\n    image: nginx:latest\n    ports:\n      - "80:80"\n');

        // Edit stack editor
        const editTextArea = document.getElementById('edit-editor');
        editEditor = CodeMirror.fromTextArea(editTextArea, {
            mode: 'yaml',
            theme: 'material',
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 2,
            tabSize: 2
        });
    }

    // Execute command via Cockpit spawn
    function executeCommand(command, workingDir) {
        return new Promise((resolve, reject) => {
            const options = workingDir ? { directory: workingDir, err: 'out' } : { err: 'out' };
            const process = cockpit.spawn(command, options);
            let output = '';

            process.stream((data) => {
                output += data;
                // Stream output to modal if open
                if ($('#output-modal').hasClass('in')) {
                    const outputContent = document.getElementById('output-content');
                    outputContent.textContent += data;
                    outputContent.scrollTop = outputContent.scrollHeight;
                }
            });

            process.then(() => {
                resolve(output);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    // Show output modal
    function showOutputModal(title) {
        document.getElementById('output-title').textContent = title;
        document.getElementById('output-content').textContent = '';
        $('#output-modal').modal('show');
    }

    // Load stacks from filesystem
    async function loadStacks() {
        try {
            const listCmd = ['sh', '-c', `find ${STACKS_DIR} -maxdepth 2 -name compose.yaml -o -name docker-compose.yaml -o -name docker-compose.yml 2>/dev/null | xargs -I {} dirname {}`];
            const output = await executeCommand(listCmd);
            
            const stackDirs = output.trim().split('\n').filter(dir => dir);
            stacks = [];

            for (const dir of stackDirs) {
                const stackName = dir.split('/').pop();
                if (stackName) {
                    // Check if stack is running
                    let status = 'unknown';
                    try {
                        const psOutput = await executeCommand(['docker', 'compose', 'ps', '-q'], dir);
                        status = psOutput.trim() ? 'running' : 'stopped';
                    } catch (e) {
                        status = 'stopped';
                    }

                    stacks.push({
                        name: stackName,
                        path: dir,
                        status: status
                    });
                }
            }

            renderStacks();
        } catch (error) {
            console.error('Error loading stacks:', error);
            showError('Failed to load stacks: ' + error.message);
            renderStacks();
        }
    }

    // Render stacks list
    function renderStacks() {
        const container = document.getElementById('stacks-list');
        
        if (stacks.length === 0) {
            container.innerHTML = `
                <div class="blank-slate-pf">
                    <div class="blank-slate-pf-icon">
                        <span class="fa fa-cubes" style="font-size: 48px;"></span>
                    </div>
                    <h1>No stacks found</h1>
                    <p>Create your first Docker Compose stack to get started.</p>
                    <button class="btn btn-primary btn-lg" onclick="document.getElementById('create-stack-btn').click()">
                        <span class="fa fa-plus"></span> Create Stack
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        stacks.forEach(stack => {
            const statusClass = stack.status;
            html += `
                <div class="stack-item" data-stack="${stack.name}">
                    <div class="stack-header">
                        <div class="stack-name">${stack.name}</div>
                        <span class="stack-status ${statusClass}">${stack.status}</span>
                    </div>
                    <div class="stack-path">
                        <small class="text-muted"><span class="fa fa-folder"></span> ${stack.path}</small>
                    </div>
                    <div class="stack-actions">
                        <button class="btn btn-default btn-sm" onclick="editStack('${stack.name}')">
                            <span class="fa fa-edit"></span> Edit
                        </button>
                        ${stack.status === 'stopped' ? `
                            <button class="btn btn-success btn-sm" onclick="startStack('${stack.name}')">
                                <span class="fa fa-play"></span> Start
                            </button>
                        ` : ''}
                        ${stack.status === 'running' ? `
                            <button class="btn btn-warning btn-sm" onclick="stopStack('${stack.name}')">
                                <span class="fa fa-stop"></span> Stop
                            </button>
                        ` : ''}
                        <button class="btn btn-info btn-sm" onclick="restartStack('${stack.name}')">
                            <span class="fa fa-refresh"></span> Restart
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="updateStack('${stack.name}')">
                            <span class="fa fa-download"></span> Update Images
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStack('${stack.name}')">
                            <span class="fa fa-trash"></span> Delete
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Create new stack
    async function createStack() {
        const name = document.getElementById('stack-name').value.trim();
        if (!name) {
            alert('Please enter a stack name');
            return;
        }

        // Validate stack name (alphanumeric, hyphens, underscores)
        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            alert('Stack name can only contain letters, numbers, hyphens, and underscores');
            return;
        }

        const content = createEditor.getValue();
        if (!content.trim()) {
            alert('Please enter compose.yaml content');
            return;
        }

        try {
            const stackPath = `${STACKS_DIR}/${name}`;
            
            // Create directory
            await executeCommand(['mkdir', '-p', stackPath]);
            
            // Write compose file
            const file = cockpit.file(`${stackPath}/compose.yaml`);
            await file.replace(content);

            $('#create-stack-modal').modal('hide');
            document.getElementById('stack-name').value = '';
            createEditor.setValue('version: "3"\nservices:\n  example:\n    image: nginx:latest\n    ports:\n      - "80:80"\n');
            
            showSuccess(`Stack "${name}" created successfully`);
            await loadStacks();
        } catch (error) {
            showError('Failed to create stack: ' + error.message);
        }
    }

    // Edit stack
    window.editStack = async function(name) {
        currentStackName = name;
        const stack = stacks.find(s => s.name === name);
        if (!stack) return;

        try {
            const file = cockpit.file(`${stack.path}/compose.yaml`);
            const content = await file.read();
            
            document.getElementById('edit-stack-name').textContent = name;
            editEditor.setValue(content || '');
            $('#edit-stack-modal').modal('show');
        } catch (error) {
            showError('Failed to load stack content: ' + error.message);
        }
    };

    // Save stack
    async function saveStack() {
        if (!currentStackName) return;

        const stack = stacks.find(s => s.name === currentStackName);
        if (!stack) return;

        const content = editEditor.getValue();

        try {
            const file = cockpit.file(`${stack.path}/compose.yaml`);
            await file.replace(content);
            
            $('#edit-stack-modal').modal('hide');
            showSuccess(`Stack "${currentStackName}" saved successfully`);
            currentStackName = null;
        } catch (error) {
            showError('Failed to save stack: ' + error.message);
        }
    }

    // Start stack
    window.startStack = async function(name) {
        const stack = stacks.find(s => s.name === name);
        if (!stack) return;

        showOutputModal(`Starting stack: ${name}`);
        
        try {
            await executeCommand(['docker', 'compose', 'up', '-d'], stack.path);
            showSuccess(`Stack "${name}" started successfully`);
            await loadStacks();
        } catch (error) {
            showError('Failed to start stack: ' + error.message);
        }
    };

    // Stop stack
    window.stopStack = async function(name) {
        const stack = stacks.find(s => s.name === name);
        if (!stack) return;

        showOutputModal(`Stopping stack: ${name}`);
        
        try {
            await executeCommand(['docker', 'compose', 'down'], stack.path);
            showSuccess(`Stack "${name}" stopped successfully`);
            await loadStacks();
        } catch (error) {
            showError('Failed to stop stack: ' + error.message);
        }
    };

    // Restart stack
    window.restartStack = async function(name) {
        const stack = stacks.find(s => s.name === name);
        if (!stack) return;

        showOutputModal(`Restarting stack: ${name}`);
        
        try {
            await executeCommand(['docker', 'compose', 'down'], stack.path);
            await executeCommand(['docker', 'compose', 'up', '-d'], stack.path);
            showSuccess(`Stack "${name}" restarted successfully`);
            await loadStacks();
        } catch (error) {
            showError('Failed to restart stack: ' + error.message);
        }
    };

    // Update stack images
    window.updateStack = async function(name) {
        const stack = stacks.find(s => s.name === name);
        if (!stack) return;

        showOutputModal(`Updating images for stack: ${name}`);
        
        try {
            await executeCommand(['docker', 'compose', 'pull'], stack.path);
            await executeCommand(['docker', 'compose', 'up', '-d'], stack.path);
            showSuccess(`Stack "${name}" images updated and restarted successfully`);
            await loadStacks();
        } catch (error) {
            showError('Failed to update stack: ' + error.message);
        }
    };

    // Delete stack
    window.deleteStack = async function(name) {
        if (!confirm(`Are you sure you want to delete stack "${name}"? This will stop the stack and remove all its files.`)) {
            return;
        }

        const stack = stacks.find(s => s.name === name);
        if (!stack) return;

        try {
            // Try to stop the stack first
            try {
                await executeCommand(['docker', 'compose', 'down'], stack.path);
            } catch (e) {
                console.log('Stack was not running or already stopped');
            }

            // Remove the directory
            await executeCommand(['rm', '-rf', stack.path]);
            
            showSuccess(`Stack "${name}" deleted successfully`);
            await loadStacks();
        } catch (error) {
            showError('Failed to delete stack: ' + error.message);
        }
    };

    // Show success message
    function showSuccess(message) {
        cockpit.message({ problem: null, message: message });
    }

    // Show error message
    function showError(message) {
        cockpit.message({ problem: 'error', message: message });
    }

    // Initialize on document ready
    $(document).ready(function() {
        initEditors();

        // Create stacks directory if it doesn't exist
        executeCommand(['mkdir', '-p', STACKS_DIR]).catch(() => {
            console.log('Stacks directory may already exist or cannot be created');
        });

        // Load stacks
        loadStacks();

        // Event listeners
        document.getElementById('create-stack-btn').addEventListener('click', function() {
            $('#create-stack-modal').modal('show');
        });

        document.getElementById('create-stack-confirm').addEventListener('click', createStack);
        document.getElementById('save-stack-btn').addEventListener('click', saveStack);
        document.getElementById('refresh-btn').addEventListener('click', loadStacks);

        // Auto-refresh every 10 seconds
        setInterval(loadStacks, 10000);
    });
})();
