# Laundry Order Management System

A lightweight system for dry cleaning stores to manage daily orders, track status, calculate billing, and view dashboard stats.

---

## Setup Instructions

### Prerequisites
- Node.js v16 or higher

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/laundry-order-management.git
cd laundry-order-management

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open your browser at **http://localhost:3000**

For development with auto-restart:
```bash
npm run dev
```

> **Note:** Data is stored in-memory. It resets when the server restarts.

---

## Features Implemented

### Core
- **Create Order** — customer name, phone, garments with quantity, auto price calculation, unique Order ID, estimated delivery date
- **Order Status Management** — update status through: `RECEIVED → PROCESSING → READY → DELIVERED`
- **View & Filter Orders** — filter by status, customer name, phone number, garment type
- **Dashboard** — total orders, total revenue, orders count per status, 5 recent orders

### Bonus
- Simple frontend UI (HTML + vanilla JS) — no build step needed
- Estimated delivery date (3 days from order creation)
- Search by garment type

---

## API Reference

### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "customer_name": "Ali Khan",
  "phone": "03001234567",
  "items": [
    { "garment": "shirt", "quantity": 2 },
    { "garment": "pants", "quantity": 1 }
  ]
}
```

### List Orders (with optional filters)
```
GET /api/orders
GET /api/orders?status=READY
GET /api/orders?customer_name=Ali
GET /api/orders?phone=0300
GET /api/orders?garment=shirt
```

### Update Order Status
```
PATCH /api/orders/:id/status
Content-Type: application/json

{ "status": "PROCESSING" }
```

### Get Single Order
```
GET /api/orders/:id
```

### Dashboard Stats
```
GET /api/dashboard
```

---

## Garment Prices (PKR)

| Garment  | Price |
|----------|-------|
| Shirt    | 150   |
| Pants    | 180   |
| Saree    | 350   |
| Jacket   | 300   |
| Dress    | 250   |
| Suit     | 500   |
| Coat     | 400   |
| Sweater  | 200   |
| Jeans    | 180   |
| Kurta    | 120   |

---

## AI Usage Report

### Tools Used
- **Claude (claude.ai)** — primary tool for scaffolding the entire project

---

### Sample Prompts Used

**1. Project structure**
> "I need to build a mini laundry order management system using Node.js and Express with in-memory storage. Help me design the folder structure and core files."

**2. Orders API**
> "Write an Express router for orders. It needs: POST to create an order with garment items and auto price calculation, GET with filters for status/name/phone/garment, PATCH to update status. Use in-memory array as storage."

**3. Dashboard route**
> "Write a GET /api/dashboard endpoint that returns total orders, total revenue, count of orders by each status, and 5 most recent orders."

**4. Frontend**
> "Build a single HTML page with vanilla JS for this laundry system. It needs 3 tabs: Dashboard (stats cards + recent orders table), Orders (filterable table with inline status update), New Order (form to create an order). No external CSS frameworks."

---

### What AI Got Right
- Express server setup and middleware wiring
- In-memory filter logic with multiple query params
- Dashboard aggregation logic
- Overall HTML structure and tab navigation
- Status badge color coding

### What I Had to Fix / Improve
- AI initially used `uuid` package for Order IDs — replaced with a custom `ORD-YYYYMMDD-XXXX` format that is more readable and human-friendly
- AI generated overly complex error handling with try/catch everywhere — simplified since this is in-memory and can't fail at the DB level
- Frontend status update dropdown was resetting the whole page on change — fixed by only reloading the orders table, not the full page
- AI used `fetch` without awaiting properly in one place — fixed async/await chain
- Garment prices were in USD — changed to PKR to match local context

---

## Tradeoffs

### What I skipped
- **Authentication** — no login system; kept it open for simplicity
- **Persistent database** — in-memory only; data resets on server restart
- **Input sanitization** — minimal validation, not production-hardened
- **Pagination** — all orders load at once; fine for demo scale

### What I'd improve with more time
- Add MongoDB for persistent storage
- Add JWT-based authentication (admin login)
- Add pagination and sorting to orders list
- Deploy to Railway or Render with a live URL
- Add order edit/delete functionality
- Export orders to CSV
