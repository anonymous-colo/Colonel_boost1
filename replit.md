# Overview

KERVENTZ STATUS is a professional contact collection and management platform designed for the Haitian business community and diaspora. The application serves as a networking hub where users can register their contact information and gain access to a comprehensive directory of professional contacts through a WhatsApp group integration. The platform features a public registration interface with multi-language support (French, English, Spanish) and a secure administrative dashboard for contact management and data export capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Updates (January 2025)

## Latest Enhancements (January 6, 2025)
- ✅ Added phone number validation by country code with specific length requirements
- ✅ Implemented getLatestContacts method to display 5 most recent registrations on PUBLIC SITE
- ✅ Fixed admin authentication - password must be entered manually (no pre-fill)
- ✅ All contacts now display properly in admin dashboard table  
- ✅ Created floating admin access button for easy dashboard access
- ✅ Added BrilliantFeatures component with AI, predictive analytics, unified communication
- ✅ Added EnhancedFeatures component showcasing professional capabilities
- ✅ Integrated PerformanceOptimizer for image preloading and font optimization
- ✅ Created comprehensive DEPLOYMENT_GUIDE.md for multiple platforms
- ✅ Updated project ZIP with all latest professional enhancements
- ✅ Fixed all LSP diagnostics and code quality issues

## Critical Fixes Completed
- ✅ Latest 5 members now appear on PUBLIC HOME PAGE (not just admin)
- ✅ Admin password authentication requires manual entry (security fix)
- ✅ All registered contacts appear in admin dashboard table
- ✅ Added revolutionary AI-powered features and professional capabilities

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, built using Vite for development and bundling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Theme System**: Dark/light mode support with CSS custom properties
- **Internationalization**: Multi-language support (French, English, Spanish) with translation system
- **Routing**: Wouter for client-side routing with public and admin routes
- **State Management**: TanStack Query for server state and React hooks for local state
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL as the primary database
- **Authentication**: Session-based authentication using express-session with bcrypt for password hashing
- **API Design**: RESTful API endpoints with JSON responses
- **File Structure**: Monorepo structure with shared schemas between client and server
- **Development**: Hot module replacement with Vite middleware in development mode

## Database Design
- **Contacts Table**: Stores user registration data with unique phone number constraints and automatic K.B.S suffix addition
- **Admins Table**: Manages administrator accounts with hashed passwords
- **Sessions Table**: Handles admin authentication sessions with expiration tracking
- **Validation**: Comprehensive input validation with duplicate phone number prevention
- **Data Export**: Support for CSV and VCF formats with proper UTF-8 encoding

## Security Implementation
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Session Management**: 24-hour session expiration with secure cookie configuration
- **Input Validation**: Zod schemas for client and server-side validation
- **CORS Protection**: Express session middleware with secure configuration
- **SQL Injection Prevention**: Parameterized queries through Drizzle ORM

## Contact Management Features
- **Registration Flow**: Multi-step form with country code selection and email validation
- **Duplicate Prevention**: Server-side validation to prevent duplicate phone numbers
- **Data Enrichment**: Automatic suffix addition and phone number formatting
- **Search Functionality**: Admin dashboard with contact search and filtering capabilities
- **Bulk Operations**: Mass export and deletion capabilities for administrators

## External Dependencies

- **Database**: PostgreSQL via Neon serverless with connection pooling
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Validation**: Zod for schema validation across client and server
- **Authentication**: bcrypt for password hashing and express-session for session management
- **File Exports**: Custom VCF generation with proper UTF-8 encoding for contact files
- **Development Tools**: Vite with React plugin, ESBuild for production builds
- **WhatsApp Integration**: Direct links to WhatsApp group for contact sharing
- **Email Services**: Contact form integration for support communications
- **Font Services**: Google Fonts (Inter) for typography
- **Image Hosting**: Unsplash for testimonial profile images