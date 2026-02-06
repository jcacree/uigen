# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, and the AI generates React code that renders in a live preview iframe.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run test         # Run vitest tests
npm run lint         # ESLint
npm run setup        # Install deps + Prisma setup + migrations
npm run db:reset     # Reset database
```

## Architecture

### Core Flow
1. User sends message via chat interface
2. `/api/chat` streams responses from Claude using Vercel AI SDK
3. Claude uses tools (`str_replace_editor`, `file_manager`) to create/edit files
4. Changes update the virtual file system (in-memory, no disk writes)
5. Preview iframe re-renders the generated React components

### Key Directories
- `src/app/api/chat/route.ts` - Streaming chat endpoint with AI tool integration
- `src/lib/file-system.ts` - Virtual file system implementation
- `src/lib/tools/` - AI agent tools for file operations
- `src/lib/prompts/generation.tsx` - System prompt defining component generation rules
- `src/lib/transform/jsx-transformer.ts` - Transforms JSX for live preview
- `src/lib/contexts/` - React contexts for chat and file system state
- `src/components/preview/PreviewFrame.tsx` - Live preview iframe renderer

### State Management
- **ChatContext**: Manages messages, input, submission via useAIChat hook
- **FileSystemContext**: Manages virtual file system state and operations

### Database (Prisma + SQLite)
- `User`: Authentication with email/password
- `Project`: Stores chat messages and file system state as JSON

### Authentication
JWT-based with HttpOnly cookies, 7-day expiration. Middleware protects `/api/projects` and `/api/filesystem` routes.

## Environment Variables

- `ANTHROPIC_API_KEY` - Optional; without it, a mock model returns static code
- `JWT_SECRET` - Defaults to "development-secret-key" in dev

## Testing

Tests use Vitest with React Testing Library. Run a single test file:
```bash
npx vitest run src/lib/__tests__/file-system.test.ts
```

## AI Tool System

The AI has two tools available:
- `str_replace_editor` - View, create, and edit files with string replacement
- `file_manager` - Rename and delete files/directories

Preview looks for entry points: `/App.jsx`, `/App.tsx`, `/index.jsx`, `/index.tsx`
