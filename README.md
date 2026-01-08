# Modern SSH Client

A sleek, modern SSH client built with React, Vite, and xterm.js. Inspired by Termius and Tabby, this project focuses on a premium user experience with a beautiful dark theme, glassmorphism effects, and smooth animations.

![SSH Client Terminal](https://github.com/thienng-it/ssh_client/assets/placeholder-image-url-mock)
*(Note: Replace with actual screenshot URL after uploading to repo)*

## Features

- **Modern UI**: Polished "Catppuccin Mocha" inspired dark theme.
- **Interactive Terminal**: Fully functional terminal emulation powered by `xterm.js`.
- **Connection Manager**: Easily add and manage your SSH hosts.
- **Responsive Design**: Fluid layout that adapts to any window size.
- **Glassmorphism**: Subtle transparency and blur effects for a modern feel.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Terminal**: [xterm.js](https://xtermjs.org/) + [@xterm/addon-fit](https://www.npmjs.com/package/@xterm/addon-fit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: GitHub Pages (via GitHub Actions)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thienng-it/ssh_client.git
   cd ssh_client
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Start the SSH backend server** (required for real connections)
   ```bash
   cd server && npm start
   ```

4. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Testing

This project includes comprehensive test coverage:
- **Unit & Component Tests**: 22 tests using Vitest and React Testing Library
- **E2E Tests**: 7 end-to-end tests using Playwright
- **Continuous Integration**: Automated testing on PRs and main branch

### Run Tests

```bash
# Run unit and component tests
npm test

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

For more details, see the [Testing Documentation](./docs/testing.md).

## Documentation

- [Git Setup & Deployment Guide](./docs/git-setup.md): Detailed steps on how this repo was initialized and connected to GitHub.
- [Deployment Info](./docs/deployment.md): Instructions on how the GitHub Actions deployment works.
- [Testing Guide](./docs/testing.md): Comprehensive guide to running and writing tests.

## License

This project is open source and available under the [MIT License](LICENSE).
