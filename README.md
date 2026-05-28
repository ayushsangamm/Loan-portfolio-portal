# 💼 Antigravity - Enterprise Loan Portfolio Management System

A high-fidelity, premium credit analytics and loan portfolio management portal designed for modern lenders, banks, and NBFCs. Built with a focus on rich aesthetics, interactive dashboards, and real-time state synchronization.

---

## 🚀 Deployed System Link
👉 **Live Demo**: [Deploy your Vercel link here!]

---

## ✨ Premium Core Features

### 📊 1. Operational Dashboard & Analytics
- **KPI Metrics**: Real-time monitoring of **Total Portfolio Value**, **Active Accounts Count**, **NPA (Non-Performing Assets) Default Rate**, and cumulative portfolios.
- **Interactive Visualizations**: Integrated Recharts trends representing asset growth vectors and active loan status distributions.
- **Transaction Ledger**: Dynamic tracking of recent capital disbursements with immediate detailed audit ledger redirects.

### 📋 2. Credit Lifecycle Pipeline (Kanban Board)
- **Lifecycle Columns**: Visual flow columns tracking loans through **Review Queue** (`Pending`), **Active Portfolio** (`Active`), **Settled Ledger** (`Closed`), and **NPA / High Risk** (`Defaulted`).
- **Quick Actions Decision Engine**: Instant administrative buttons on pipeline cards to transition states:
  - *Pending* ➜ **Disburse Capital** (Activates interest accumulation).
  - *Active* ➜ **Mark Settled** (Closes ledger) or **Flag Default** (Initiates collections).
  - *Defaulted* ➜ **Recover & Close**.
- **Credit Integration**: Maps live borrower profiles and real-time FICO credit scores from the database.

### 🧮 3. Interactive Credit Worksheet (EMI Calculator)
- **Simulators**: Real-time sliding controls for Principal Capital ($P$), Annual Interest Rate ($R$), and Tenure Period ($N$).
- **Amortization Engine**: Computes Monthly EMIs, Cost of Borrowing (Total Interest), and Lifetime Repayments using RBI standard calculations.
- **Granular Ledger Table**: Generates a Month-on-Month amortization sheet outlining principal deduction and interest charge splits with support to print reports.

### 🔔 4. Priority Alert Center
- **Popover Alerts**: Real-time notifications Bell in the Navbar mapping high-priority ledger events.
- **Risk Indicators**: Auto-flags overdue accounts and incoming credit reviews with quick navigational redirects for immediate settlement.

### 🌓 5. Dynamic Theme Engine
- **Persistent Switcher**: Single-click toggles between premium HSL slate light mode and sleek carbon-slate dark mode.
- **Auto-Respect**: Detects system color preferences on first load and persists user settings securely in `localStorage`.

---

## 🛠️ Technology Stack & Architecture

- **Frontend Core**: React 19 (Hooks, Context, Memoized States, Suspense Lazy Routing).
- **Style Architecture**: Tailwind CSS v4 (Class-based dark variant mapping).
- **State Management**: Redux Toolkit (Slices, Async Thunks, global client-side dispatch).
- **Mathematical Rendering**: Recharts (Dynamic Responsive SVG Pie & Area charts).
- **Typography & Icons**: Inter Font Family and custom vector Lucide Icons.

### 💎 Architectural Highlight: Decoupled Persistent Engine
To achieve serverless execution, the portal implements a **Simulated Client-Side API Layer**. All database reads, additions, and updates are persisted securely using browser `localStorage` initialized from a core `db.json` database. This ensures:
- Blazing-fast responsive speeds.
- Serverless static deployment on CDNs like **Vercel** with fully dynamic CRUD interactions.
- Low-latency operations ideal for clean portfolio reviews.

---

## 💻 Local Development Setup

To run this project locally in your workspace:

1. **Clone & Open folder**:
   ```bash
   cd d:\projects
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Launch Application**:
   Navigate to **`http://localhost:5173/`** in your browser to experience the lending platform!

---

## 👥 Administrative System Roles
- **System Role**: Portfolio Officer / Credit Administrator (`Ayush Admin`)
- **Gateway Status**: Online (v3.4.1)
- **Compliance standard**: RBI Amortization Guidelines
