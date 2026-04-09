# Phase 1 Requirements

## Objective

Deliver a company website platform with three parts:

- public website for brand and content presentation
- admin console for content and account management
- backend service for authentication, content management, and public APIs

## In Scope

### Public Website

- Home
- About Us
- Product Center
- News
- Announcements
- Contact Us

### Admin Console

- Admin login/logout
- Password change
- Admin account management
- Static content management
- News management
- Announcement management
- Product management
- Media upload

### Backend Service

- JWT authentication
- RBAC authorization
- CRUD APIs for phase-1 content models
- Public APIs for website pages
- File upload with validation and URL return

## Out of Scope

- User registration/login for public users
- Inquiry forms, message boards, comments
- Payment, order, or CRM workflows
- Analytics data collection forms
- Multilingual support in phase 1
- Content review workflow in phase 1

## Functional Requirements

### Authentication and Authorization

- Admins sign in with username and password
- Server issues access token and refresh token
- Protected admin APIs require valid JWT
- Role-based permissions control menu access and actions
- Super admin account cannot be disabled or removed by non-super-admin users

### Admin User Management

- List admins with pagination and status
- Create admin account
- Edit admin account information
- Enable or disable admin accounts
- Reset admin password
- Assign roles to admins

### News Management

- Manage news categories
- Create, edit, delete, and view news details
- Support draft and published status
- Support cover image, publish time, top flag, rich text content

### Announcement Management

- Create, edit, delete, and view announcements
- Support draft and published status
- Support publish time and top flag

### Product Management

- Manage product categories
- Create, edit, delete, and view products
- Support publish status
- Support images, parameter fields, and detail content

### Static Content Management

- Maintain about page content
- Maintain contact page content
- Maintain home banners and advantages section
- Maintain site basic information and footer settings
- Reserve SEO fields for future use

### Public Website Display

- Home aggregates banners, company introduction, products, latest news, latest announcements, and contact info
- About page renders maintained content
- Product pages provide list and detail views
- News pages provide list and detail views
- Announcement pages provide list and detail views
- Contact page displays company info, address, phone, email, and map placeholder

## Non-Functional Requirements

- Responsive layout for desktop and mobile
- Basic SEO metadata on public pages
- Passwords stored with secure hashing
- Upload type and size restrictions enforced server-side
- Draft content must not appear in public APIs
- Public site should degrade gracefully when content is empty

## Acceptance Baseline

- Public website pages are accessible on desktop and mobile
- Admin system requires login before access
- Admin can maintain news, announcements, products, and static pages
- Published content is visible on public pages through APIs
- Draft content remains hidden from public access
