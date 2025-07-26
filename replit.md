# Replit Project Guide

## Overview

This is a full-stack web application called "Colonel Boost" - a contact management system designed for WhatsApp marketing. The app allows users to register their contact information and provides an admin panel to manage contacts and export them to VCF/CSV formats for WhatsApp marketing campaigns.

**Status**: ✅ COMPLETED - Application fully functional and deployed

## Recent Changes (January 26, 2025)

✓ Fixed NodeMailer API method (createTransporter → createTransport)
✓ Resolved database storage null handling for row counts 
✓ Updated API request function to support authorization headers
✓ Fixed Tailwind CSS scrollbar styles causing build errors
✓ Resolved country selector duplicate key warnings with unique IDs
✓ Successfully deployed complete dual-site system with all features

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Email Service**: Nodemailer for sending confirmation emails
- **Session Management**: Simple admin session management with database storage

### Project Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared types and schemas
├── migrations/       # Database migration files
└── dist/            # Production build output
```

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon serverless with connection pooling
- **Schema**: Defined in `shared/schema.ts` using Drizzle and Zod
- **Tables**: 
  - `contacts` - stores user registration data
  - `admin_sessions` - manages admin authentication

### API Layer
- **REST Endpoints**:
  - `POST /api/contacts` - Register new contact
  - `GET /api/contacts/recent` - Get recent contacts
  - `GET /api/contacts/count` - Get total contact count
  - `POST /api/admin/login` - Admin authentication
  - `GET /api/admin/contacts` - Get all contacts (admin)
  - `DELETE /api/admin/contacts` - Delete contacts (admin)
  - `GET /api/admin/export/vcf` - Export VCF file
  - `GET /api/admin/export/csv` - Export CSV file

### Frontend Pages
- **Home** (`/`) - Contact registration form with testimonials
- **Admin Login** (`/admin/login`) - Simple password authentication
- **Admin Dashboard** (`/admin`) - Contact management interface

### Services
- **Email Service**: Sends confirmation emails using Gmail SMTP
- **VCF Service**: Generates VCF and CSV files for contact export
- **Storage Service**: Database abstraction layer for contact operations

## Data Flow

1. **User Registration**:
   - User fills contact form on home page
   - Frontend validates data using Zod schema
   - API checks for duplicate WhatsApp numbers
   - Contact saved to database
   - Confirmation email sent if email provided

2. **Admin Management**:
   - Admin logs in with hardcoded password ("kerventz2000")
   - Session stored in database with expiration
   - Admin can view, search, edit, and delete contacts
   - Export functionality generates VCF/CSV files

3. **Data Export**:
   - VCF files include contact names with "BOOST.1🚀🔥🇭🇹" suffix
   - CSV files provide structured data export
   - Files generated on-demand for download

## External Dependencies

### Core Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` and `drizzle-kit` for database operations
- **UI**: `@radix-ui/*` components with `class-variance-authority`
- **Forms**: `react-hook-form` with `@hookform/resolvers`
- **Validation**: `zod` for schema validation
- **HTTP Client**: `@tanstack/react-query` for API calls
- **Email**: `nodemailer` for email delivery
- **Routing**: `wouter` for client-side navigation

### Development Tools
- **Build**: `vite` with React plugin
- **Styling**: `tailwindcss` with `autoprefixer`
- **TypeScript**: Full TypeScript support across frontend and backend
- **Replit Integration**: Special Vite plugins for Replit environment

## Deployment Strategy

### Development
- Vite dev server serves frontend with HMR
- Express server runs with `tsx` for TypeScript execution
- Database migrations handled by Drizzle Kit
- Environment variables required: `DATABASE_URL`, `EMAIL_USER`, `EMAIL_PASSWORD`

### Production
- Frontend built to `dist/public` directory
- Backend bundled with `esbuild` to `dist/index.js`
- Static file serving integrated into Express server
- PostgreSQL database provisioned through Neon
- Email service configured with Gmail SMTP

### Environment Setup
- Database URL must be provided for Neon PostgreSQL
- Email credentials needed for confirmation emails
- Admin password hardcoded as "kerventz2000"
- Session duration set to 24 hours

### Key Features
- Mobile-responsive design with Tailwind breakpoints
- Dark/light theme support with system preference detection
- Real-time contact counting and recent contact display
- Duplicate prevention for WhatsApp numbers
- French language interface targeting Haitian market
- WhatsApp group integration for community building