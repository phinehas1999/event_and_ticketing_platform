# Event & Ticketing Platform

A modern, full-stack event management and ticketing solution built with Next.js 16, TypeScript, and PostgreSQL. This platform serves three distinct user roles: Administrators, Organizers, and Attendees, offering a complete lifecycle for event creation, ticket sales, and management.

![Platform Overview](public/preview/platform_overview.png)
_(Main landing page)_

## 🚀 Features

### For Attendees

- **Browse Events**: Discover events with a clean, responsive interface.
- **Ticket Reservation**: Seamless booking flow for reserving tickets.
- **My Tickets**: Dedicated area to view and manage purchased tickets.
- **Secure Authentication**: Easy sign-up and login process.

### For Organizers

- **Organizer Dashboard**: A central hub to track sales and event performance.
- **Event Management**: Create, edit, and publish events with ease.
- **Sales Tracking**: Real-time insights into ticket sales and revenue.
- **Financial Management**: Manage bank accounts and track payment statuses.

![Organizer Dashboard](public/preview/organizer_dashboard.png)
_(Organizer dashboard)_

### For Administrators

- **Platform Oversight**: Global view of all events, users, and organizers.
- **User Management**: Manage user roles and permissions.
- **Financial Control**: Monitor transactions and payouts.
- **Content Moderation**: Review and approve events/organizers.

![Admin Panel](public/preview/admin_panel.png)
_(Admin dashboard)_

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: NPM

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages and API routes
│   ├── admin/            # Admin-specific pages
│   ├── api/              # Backend API endpoints
│   ├── dashboard/        # User dashboard
│   ├── events/           # Public event listings
│   ├── organizer/        # Organizer-specific pages
│   └── ...
├── components/           # Reusable UI components
├── db/                   # Database configuration and schemas
│   ├── schema/           # Drizzle schema definitions
│   └── index.ts          # DB connection setup
├── drizzle/              # Database migration files
├── lib/                  # Utility functions and shared logic
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## ⚡ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/event-ticketing-platform.git
    cd event-ticketing-platform
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/event_db"
    AUTH_SECRET="your-super-secret-auth-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Database Setup**
    Push the schema to your database:

    ```bash
    npm run db:migrate
    ```

5.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint.
- `npm run db:generate`: Generates Drizzle migrations based on schema changes.
- `npm run db:migrate`: Applies migrations to the database.
- `npm run db:studio`: Opens Drizzle Studio to visualize database data.

## 📷 Gallery

### Event Details

![Event Details](public/preview/event_page.png)
_(Single event page)_

### Ticket Purchase Flow

![Ticket Flow](public/preview/ticket_reservation.png)
_(Ticket reservation modal)_

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
