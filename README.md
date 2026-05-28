#  Loan Portfolio Portal

This is a frontend dashboard application for managing an enterprise loan portfolio. It is designed for lenders, loan officers, and credit managers to track loans, borrowers, and lifecycle pipelines in a single clean web interface.

## Live Demo
**Live Link**: [loan-portfolio-portal.vercel.app](https://loan-portfolio-portal.vercel.app/)

## Key Features

- **Dashboard:** Overview of core portfolio metrics like total portfolio value, active loan accounts, and default rates with interactive charts.
- **Kanban Board Pipeline:** A visual board to manage loan application workflows. It groups loans by status (Pending, Active, Closed, Defaulted) and allows you to transition their states (e.g. approve a pending loan, mark an active loan as paid, or flag defaults).
- **EMI & Amortization Calculator:** A simulation worksheet where loan officers can drag sliders to adjust principal, interest rates, and tenure to calculate monthly EMIs and view month-on-month amortization tables.
- **Alert Notifications:** A notification popover in the navigation header that flags overdue loans and pending reviews for immediate attention.
- **Theme Switcher:** Toggles the interface between Light and Dark mode, persisting the user's preference using local storage.

## Tech Stack

- **Frontend Core:** React, Vite
- **State Management:** Redux Toolkit
- **Styles:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React

d

To build the project for production:
```bash
npm run build
```
This compiles the files and outputs static assets to the `dist` directory, which can be deployed to static hosting platforms like Vercel or Netlify.
