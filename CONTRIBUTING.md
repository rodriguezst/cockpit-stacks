# Contributing to Cockpit Stacks Manager

Thank you for your interest in contributing to Cockpit Stacks Manager! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to create a welcoming environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/rodriguezst/cockpit-stacks/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Cockpit version, Docker version)
   - Error messages or logs if available

### Suggesting Features

1. Check existing issues and PRD.md to see if it's already planned
2. Create an issue describing:
   - The problem you're trying to solve
   - Your proposed solution
   - Why this would be useful
   - Any alternatives you've considered

### Contributing Code

1. **Fork the repository**
   ```bash
   git clone https://github.com/rodriguezst/cockpit-stacks.git
   cd cockpit-stacks
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Keep changes focused and minimal
   - Test thoroughly

4. **Test your changes**
   ```bash
   # Copy to Cockpit directory
   sudo cp -r {manifest.json,index.html,stacks.js,stacks.css} /usr/share/cockpit/cockpit-stacks/
   
   # Test in browser
   # Access https://your-server:9090
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

6. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Linux system with systemd
- Cockpit installed and running
- Docker and Docker Compose V2
- Text editor or IDE
- Modern web browser

### Local Development

1. Clone and install:
   ```bash
   git clone https://github.com/rodriguezst/cockpit-stacks.git
   cd cockpit-stacks
   sudo ./install.sh
   ```

2. Make changes to files

3. Copy changes to Cockpit:
   ```bash
   sudo cp stacks.js /usr/share/cockpit/cockpit-stacks/
   sudo cp stacks.css /usr/share/cockpit/cockpit-stacks/
   sudo cp index.html /usr/share/cockpit/cockpit-stacks/
   ```

4. Refresh browser (Ctrl+F5)

No build process or service restart needed!

## Code Style

### JavaScript
- Use ES6+ features (const, let, arrow functions, async/await)
- Use 4-space indentation
- Use meaningful variable names
- Add comments for complex logic
- Handle errors properly with try-catch

### HTML
- Use semantic HTML5 elements
- Follow Cockpit's PatternFly structure
- Keep markup clean and minimal
- Use Cockpit CSS classes

### CSS
- Use Cockpit's PatternFly classes when possible
- Add custom styles only when necessary
- Use clear, descriptive class names
- Keep specificity low

## Project Structure

```
cockpit-stacks/
├── manifest.json          # Cockpit package manifest
├── index.html            # Main UI layout
├── stacks.js             # Frontend logic
├── stacks.css            # Custom styles
├── install.sh            # Installation script
├── README.md             # Main documentation
├── QUICKSTART.md         # Quick start guide
├── IMPLEMENTATION.md     # Implementation details
├── CONTRIBUTING.md       # This file
├── PRD.md               # Product requirements
└── examples/            # Example compose files
    ├── nginx-simple.yaml
    ├── wordpress.yaml
    ├── monitoring.yaml
    ├── redis.yaml
    └── README.md
```

## Testing

### Manual Testing Checklist
- [ ] Create a new stack
- [ ] Edit an existing stack
- [ ] Start a stack
- [ ] Stop a stack
- [ ] Restart a stack
- [ ] Update images
- [ ] Delete a stack
- [ ] Verify real-time output
- [ ] Test with invalid YAML
- [ ] Test with multiple stacks
- [ ] Test auto-refresh
- [ ] Test on different browsers

### Test Environment
- Test on a clean system or VM
- Test with different Docker Compose file formats
- Test permission scenarios
- Test error conditions

## Documentation

When adding features:
- Update README.md if user-facing
- Add examples if applicable
- Update QUICKSTART.md if it affects getting started
- Add comments in code for complex logic

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Test thoroughly on your system
3. Update documentation if needed
4. Create a pull request with:
   - Clear title describing the change
   - Description of what changed and why
   - Testing performed
   - Screenshots if UI changes

## Areas for Contribution

### Good First Issues
- Add more example stacks
- Improve error messages
- Add tooltips or help text
- Documentation improvements
- Fix typos

### Feature Enhancements
- Additional Docker Compose operations
- UI/UX improvements
- Performance optimizations
- Better error handling
- Accessibility improvements

### Advanced
- Container log viewing
- Resource monitoring
- Stack templates
- Git integration
- Backup/restore

## Questions?

- Open an issue for questions
- Check existing issues and documentation first
- Be specific about what you're trying to do

## Recognition

Contributors will be acknowledged in:
- Git commit history
- Release notes (for significant contributions)
- GitHub contributors page

Thank you for contributing! 🎉
