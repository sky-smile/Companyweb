# Site Map

## Public Website Structure

- `/`
- `/about`
- `/products`
- `/products/[id]`
- `/news`
- `/news/[id]`
- `/announcements`
- `/announcements/[id]`
- `/contact`

## Public Website Page Blocks

### Home

- Header navigation
- Hero banner
- Company intro
- Product entry section
- Enterprise advantages
- Latest news
- Latest announcements
- Contact information
- Footer

### About

- Banner or page heading
- Breadcrumb
- Company profile rich text
- Culture or development section

### Products

- Page heading
- Category filters
- Product card list
- Pagination

### Product Detail

- Product gallery
- Basic information
- Parameter table
- Rich text details
- Related products placeholder

### News / Announcements

- List page with pagination
- Detail page with title, publish time, and content
- Top item styling where applicable

### Contact

- Company name
- Address
- Phone
- Email
- Map placeholder
- Branch office placeholder

## Admin Console Menu Structure

- Login
- Dashboard
- Account Management
  - Admin Users
  - Roles and Permissions
- Content Management
  - News
  - News Categories
  - Announcements
  - Products
  - Product Categories
- Site Management
  - Home Banners
  - About Content
  - Contact Content
  - Enterprise Advantages
  - Site Settings
- Media Center
  - Uploads
- Personal Center
  - Profile
  - Change Password

## Route Planning Notes

- Public website uses app-router based static and dynamic routes
- Admin console uses protected routes with permission-aware menus
- Server splits admin APIs and public APIs for clear access boundaries
