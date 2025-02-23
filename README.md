# MCP Manager for Claude Desktop

A desktop application to manage Model Context Protocol (MCP) servers for the Claude Desktop app on MacOS. Just follow the instructions and paste a few commands to give your Claude app instant superpowers.

## What is MCP?

The Model Context Protocol (MCP) enables Claude to access private data, APIs, and other services to answer questions and perform actions on your behalf. Learn more about MCP at:

- [modelcontextprotocol.io](https://modelcontextprotocol.io)
- [Anthropic's MCP Announcement](https://www.anthropic.com/news/model-context-protocol)

## Features

- 🚀 Easy-to-use desktop interface for managing MCP servers
- 🔒 Runs locally - your data never leaves your computer
- ⚡️ Quick setup for popular MCP servers:
  - Apple Notes - Access and search your Apple Notes
  - AWS Knowledge Base - Access and query AWS Knowledge Base for information retrieval
  - Brave Search - Search the web with Brave Search API
  - Browserbase - Let Claude explore the web with Browserbase
  - Cloudflare - Manage your Cloudflare workers and account resources
  - Everart - Interface with Everart API for digital art and design tools
  - Exa - Search the web with Exa
  - Filesystem - Access and manage local filesystem
  - GitHub - Access your GitHub repositories
  - GitLab - Manage GitLab repositories and resources
  - Google Drive - Access and search files in your Google Drive
  - Google Maps - Access Google Maps API for location services
  - Memory - Give Claude memory of previous conversations
  - Obsidian - Read and search files in your Obsidian vault
  - Perplexity - Search the web with Perplexity API
  - PostgreSQL - Connect and interact with PostgreSQL databases
  - Puppeteer - Automate browser interactions
  - Sequential Thinking - Enable step-by-step reasoning
  - Slack - Access your Slack workspace
  - SQLite - Manage SQLite databases
  - Todoist - Access and search your Todoist tasks
  - YouTube Transcript - Access and search YouTube transcripts
- 🛠 Simple configuration of environment variables and server settings
- 📋 One-click copying of terminal commands for installation

## Tech Stack

- **Desktop Framework**: 
  - Electron 29.1.4 with React 18.3.1
  - TypeScript 5.6.2
- **Build Tool**: 
  - Vite 6.0.1
  - Electron Builder 25.1.8
- **UI Components**:
  - TailwindCSS 3.4.16
  - DaisyUI 4.12.14
  - Lucide React 0.468.0 for icons
  - Tiempos Font
- **Code Quality**:
  - Biome 1.9.4
  - ESLint 9.15.0
- **Package Manager**: npm

## Project Structure

```plaintext
.
├── electron/ # Electron main process files
│   ├── main.ts # Main process entry point, handles window creation and IPC
│   ├── preload.ts # Preload script for secure renderer process communication
│   └── tsconfig.json # TypeScript configuration for Electron
├── public/ # Static public assets
│   ├── app.png # Application icon
│   ├── claude-logo.svg # Claude branding
│   ├── logo_zue.svg # Additional branding
│   ├── mcp-favicon.ico # Favicon for the application
│   └── mcp-logo.svg # MCP branding
├── src/ # Source code directory
│   ├── assets/ # Application assets
│   │   ├── tiempos-text-web-regular.woff2 # Typography assets
│   │   └── tiempos-text-web-semibold.woff2
│   ├── components/ # React components
│   │   ├── applying-instructions.tsx # Instructions UI component
│   │   ├── loading-instructions.tsx # Loading state component
│   │   ├── mcp-server-card.tsx # Server card component
│   │   ├── mcp-servers.tsx # Servers list component
│   │   ├── terminal-command.tsx # Terminal command display
│   │   └── server-configs/ # Server configuration components
│   │       ├── env-config.tsx # Environment variables config
│   │       ├── filesystem-config.tsx # Filesystem server config
│   │       ├── obsidian-config.tsx # Obsidian server config
│   │       ├── postgres-config.tsx # PostgreSQL server config
│   │       ├── sentry-config.tsx # Sentry server config
│   │       └── sqlite-config.tsx # SQLite server config
│   ├── types/ # TypeScript type definitions
│   │   └── electron.d.ts # Electron-specific types
│   ├── App.tsx # Main application component
│   ├── index.css # Global styles
│   ├── main.tsx # Application entry point
│   ├── server-configs.ts # MCP server configurations
│   ├── utils.ts # Utility functions
│   └── vite-env.d.ts # Vite environment types
├── package.json # Project configuration and dependencies
├── tsconfig.json # TypeScript configuration
├── vite.config.ts # Vite build configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
├── eslint.config.js # ESLint configuration
├── biome.json # Biome configuration
└── .eslintrc.json # Additional ESLint configuration
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development:
   ```bash
   npm run electron:dev
   ```

3. Build for MacOS:
   ```bash
   rm -rf dist dist-electron # When rebuilding
   npm run electron:build # Creates .dmg installer
   ```

4. Additional commands:
   ```bash
   npm run check # Run TypeScript checks and Biome formatting
   npm run lint # Run ESLint
   ```

## Work to be done

Add preset MCPs:
- Fetch 
- Time-related 
- Sentry
