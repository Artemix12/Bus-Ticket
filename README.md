# Bus-Ticket - MVP

A modern bus ticket booking platform that allows users to search routes, reserve seats, and receive digital QR-code tickets instantly.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## ✨ Features

### User Features
- **Route Search**: Browse available bus routes with real-time seat availability
- **Seat Reservation**: Select and reserve specific seats
- **Digital Tickets**: Instant QR-code generation for booked tickets
- **Email Notifications**: Confirmation emails with booking details
- **Booking Management**: View all personal bookings in the dashboard
- **Authentication**: Secure login and account creation with better-auth

### Admin Features
- **Trip Management**: Create, update, and manage bus routes
- **Dashboard Analytics**: View booking statistics and trip information
- **Admin Panel**: Dedicated admin dashboard for system management

### Additional Capabilities
- **QR Code Scanning**: Validate tickets via QR code scan page
- **Error Tracking**: Sentry integration for monitoring and debugging
- **Security**: Arcjet protection against malicious requests
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16.2.5
- **UI Library**: React 19.2.4
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: better-auth 1.6.9
- **Styling**: Tailwind CSS 4.0 + shadcn/ui
- **Email Service**: Brevo API + Nodemailer + Mailgen
- **QR Codes**: qrcode 1.5.4
- **Monitoring**: Sentry 10.52.0
- **Security**: Arcjet 1.4.0
- **Charts**: Recharts 3.8.0
- **Data Tables**: TanStack React Table 8.21.3
- **UI Components**: Radix UI, Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm/yarn
- MongoDB instance (local or cloud)
- Brevo account for email services (optional)
- Sentry account for error tracking (optional)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bus-ticket
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>

# Brevo Email Service
BREVO_API_KEY=<your_brevo_api_key>

# Application
DOMAIN=http://localhost:3000 or https://yourdomain.com

# Sentry (optional - for error tracking)
NEXT_PUBLIC_SENTRY_AUTH_TOKEN=<your_sentry_token>

# Better Auth
BETTER_AUTH_SECRET=<generate_secure_random_string>
BETTER_AUTH_URL=<your_app_url>
```

**Note**: Generate a secure secret for `BETTER_AUTH_SECRET` using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Usage

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

### Key Routes

- **Home**: `/` - Landing page with booking CTA
- **Login**: `/(auth)/login` - User authentication
- **Sign Up**: `/(auth)/signup` - Create new account
- **Dashboard**: `/dashboard` - User bookings and profile
- **Admin Dashboard**: `/admin_dashboard` - Admin management panel
- **Trip Search**: `/dashboard/trips` - Browse available trips
- **Scan QR**: `/scan` - QR code validation page

## 📁 Project Structure

```
bus-ticket/
├── app/                       # Next.js app directory
│   ├── (auth)/               # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── logout/
│   ├── api/v1/               # REST API endpoints
│   │   ├── trip/             # Trip management
│   │   ├── bookings/         # Booking management
│   │   └── admin/            # Admin operations
│   ├── dashboard/            # User dashboard
│   ├── admin_dashboard/      # Admin management
│   ├── scan/                 # QR code scanner
│   ├── _components/          # Shared components
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── models/                    # Mongoose schemas
│   ├── user.model.ts
│   ├── trip.model.ts
│   └── booking.model.ts
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI components
│   ├── app-sidebar.tsx
│   ├── nav-main.tsx
│   └── ...
├── dbconfig/                 # Database configuration
│   └── mongoose.ts
├── helper/                   # Helper utilities
│   └── mail.ts              # Email service
├── lib/                      # Utility functions
├── utils/                    # Auth and misc utilities
│   └── auth.ts              # better-auth setup
└── public/                   # Static assets
```

## 🔗 API Endpoints

### Trips
- `GET /api/v1/trip` - Get all available trips
- `POST /api/v1/trip` - Create a new trip (admin)
- `GET /api/v1/trip/[id]` - Get trip details
- `PUT /api/v1/trip/[id]` - Update trip (admin)

### Bookings
- `GET /api/v1/bookings` - Get user's bookings
- `POST /api/v1/bookings` - Create a new booking
- `GET /api/v1/bookings/[id]` - Get booking details
- `PUT /api/v1/bookings/[id]` - Update booking

### Admin
- `GET /api/v1/admin/stats` - Get dashboard statistics

## 🔐 Authentication & Security

- **better-auth**: Handles user authentication and session management
- **Arcjet**: Protects against malicious requests and bot attacks
- **Sentry**: Monitors errors and performance issues
- **Environment Variables**: Sensitive data is kept secure via `.env.local`

## 📧 Email Notifications

Users receive email confirmations for:
- Booking confirmation with QR code ticket
- Account registration
- Important booking updates

Powered by:
- **Brevo API** for SMTP delivery
- **Nodemailer** for email handling
- **Mailgen** for HTML template generation

## 🎨 Styling & UI

- **Tailwind CSS 4.0**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Unstyled, accessible primitives
- **Lucide React**: Beautiful icon library

## 📊 Database Schema

### User
- Basic authentication and profile information
- Tracks user bookings

### Trip
- `from`: Departure location
- `to`: Destination
- `departureDate` & `departureTime`: Schedule
- `price`: Ticket price
- `remainingSeat`: Available seats
- `totalSeat`: Total capacity
- `status`: Trip availability (available/cancelled)

### Booking
- Links users to trips
- `seatNumber`: Reserved seat
- `passengerCount`: Number of passengers
- `isUsed`: QR code validation status
- `isGift`: Option to gift the ticket
- `giftRecipient`: Name of gift recipient
- Timestamps for audit

---

**Note**: This is an MVP. Focus is on core functionality: booking trips, generating QR tickets, and managing reservations.
