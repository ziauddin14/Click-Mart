# Overview

Click Mart is a full-stack e-commerce web application built with a React frontend and Express.js backend. The application provides a complete online shopping experience with user authentication, product browsing, shopping cart functionality, wishlist management, and order processing. It features both customer-facing functionality and admin capabilities for managing products and categories.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite as the build tool
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **Component Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **State Management**: Redux Toolkit for global state (cart and wishlist), React Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect and Passport.js
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple
- **API Design**: RESTful API endpoints with proper error handling and logging

## Database Schema
- **Users**: Profile information with admin flags for role-based access
- **Products**: Full product catalog with categories, pricing, and inventory
- **Categories**: Hierarchical product organization with icons and descriptions
- **Shopping Cart**: User-specific cart items with quantity management
- **Wishlist**: User favorites and saved items
- **Orders**: Complete order history with line items and status tracking
- **Reviews**: Product ratings and feedback system
- **Sessions**: Secure session storage for authentication persistence

## Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect for secure user authentication
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Role-Based Access**: Admin users have elevated permissions for product/category management
- **Security**: HTTPOnly cookies, CSRF protection, and secure session configuration

## Key Features
- **Product Management**: Full CRUD operations for products and categories (admin only)
- **Shopping Experience**: Product browsing with search, filtering, and sorting capabilities
- **Cart & Checkout**: Persistent shopping cart with quantity management and order processing
- **User Profiles**: Personal dashboards with order history and account management
- **Responsive Design**: Mobile-first responsive design with consistent UI components

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with migration support
- **Drizzle Kit**: Database schema management and migration tooling

## Authentication
- **Replit Auth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **Express Session**: Session management with PostgreSQL store

## UI & Styling
- **Radix UI**: Headless UI primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library for UI elements

## Development Tools
- **Vite**: Fast development server and build tool with HMR
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## State Management
- **React Query (TanStack Query)**: Server state management with caching
- **Redux Toolkit**: Global client state for cart and wishlist
- **React Hook Form**: Form state management with validation

## Validation & Types
- **Zod**: Runtime type validation for API requests and forms
- **Drizzle Zod**: Database schema to Zod schema conversion for validation