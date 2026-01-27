# The Wild Oasis 🌲

A boutique cabin hotel management application.

> Based on the "The Ultimate React Course 2024: React, Redux & More" by Jonas Schmedtmann.

## Features

- **Dashboard**: Statistics on bookings, sales, check-ins, and occupancy rates.
- **Cabins**: Manage cabin inventory (CRUD), including photos and pricing.
- **Bookings**: Manage guest bookings, status (checked-in/out), and payments.
- **Users**: Hotel employee management and registration.
- **Settings**: Application-wide configurations (breakfast price, min/max nights).

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **State Management**: TanStack Query (React Query) (Setup complete, data fetching pending)
- **Styling**: Styled Components
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form
- **Backend**: Supabase (in progress)

## Getting Started

1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm run dev` to start the local server.

## Project Structure

- `src/features`: Business logic (Cabins, Bookings, etc.)
- `src/pages`: Application routes
- `src/ui`: Reusable UI components
- `src/services`: API services (Supabase)
