# Real Estate Listing Platform

A comprehensive real estate listing platform built with Node.js, React, and PostgreSQL.

## Features

- User authentication and authorization (Buyers, Sellers, Agents, Admins)
- Property listings with detailed information and image galleries
- Property search and filtering
- Contact forms and inquiry system
- User dashboard for managing properties and inquiries
- Responsive design for all devices

## Technology Stack

- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/real-estate-platform.git
   cd real-estate-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

The application uses PostgreSQL with Drizzle ORM. The schema is defined in `shared/schema.ts`.

To set up the database:

1. Make sure your PostgreSQL database is running
2. Ensure your DATABASE_URL environment variable is set
3. Run the database setup script:
   ```bash
   node db-setup.js
   ```

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Troubleshooting

### Common Issues

- **"DATABASE_URL must be set"**: Ensure the environment variable is correctly set
- **Database connection issues**: Verify your PostgreSQL credentials and connection string
- **Tables don't exist**: Run the `db-setup.js` script to initialize your database

## License

This project is licensed under the MIT License - see the LICENSE file for details.