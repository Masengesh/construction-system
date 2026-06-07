# Construction Management Platform

A modern Next.js application for construction project tracking and management.

## Project Structure

```
constrtuction/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── globals.css               # Global styles
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard
│   ├── projects/
│   │   └── page.tsx              # Project listing
│   ├── tasks/
│   │   └── page.tsx              # Task management (Kanban-style)
│   ├── users/
│   │   └── page.tsx              # User roles management
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   └── api/
│       ├── auth/
│       │   └── login/
│       │       └── route.ts      # Authentication endpoint
│       ├── projects/
│       │   └── route.ts          # Project CRUD API
│       ├── tasks/
│       │   └── route.ts          # Task CRUD API
│       └── users/
│           └── route.ts          # User CRUD API
├── components/
│   ├── layout/
│   │   └── sidebar.tsx           # Sidebar and header components
│   └── ui/
│       ├── badge.tsx             # Status badges
│       ├── card.tsx              # Card components
│       └── progress-bar.tsx      # Project progress bars
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # Utility functions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Features

- **Project Tracking**: Monitor project progress, budget, and timelines
- **Task Management**: Kanban-style task board with status columns
- **User Roles**: Admin, Manager, Worker, and Client roles
- **Dashboard UI**: Statistics cards, project progress overview
- **Responsive Design**: Mobile-friendly using Tailwind CSS

## Setup

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to view the application."# construction-system" 
