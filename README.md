# The Wild Oasis 🌲

A boutique cabin hotel management application.

> Based on the "The Ultimate React Course 2024: React, Redux & More" by Jonas Schmedtmann.

## Features

- **Dashboard**: Statistics on bookings, sales, check-ins, and occupancy rates (Upcoming).
- **Cabins**: Manage cabin inventory (CRUD), including photo uploads and pricing.
- **Bookings**: Manage guest bookings, including filtering, sorting, and pagination.
- **Check-in & Check-out**: Streamlined process for staff to confirm payments, add optional breakfast, and update booking status.
- **Authentication & Authorization**: Secure user login, account creation, and protected application routes.
- **Settings**: Application-wide configurations (breakfast price, min/max nights).

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **State Management**: TanStack Query (React Query)
- **Styling**: Styled Components
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form
- **Backend**: Supabase (Database, Auth, and Storage)
- **Security**: Row Level Security (RLS) enabled on all database tables.

## Getting Started

1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm run dev` to start the local server.

## Project Structure

- `src/features`: Business logic (Cabins, Bookings, etc.)
- `src/pages`: Application routes
- `src/ui`: Reusable UI components
- `src/services`: API services (Supabase)
