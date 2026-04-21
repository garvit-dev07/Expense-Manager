# Personal Expense Management System

A MERN Stack application for registering users, logging in with JWT, and managing daily expenses.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication middleware
- Protected expense creation and listing
- Category filtering
- Total expense amount

## Backend API

- `POST /api/register`
- `POST /api/login`
- `POST /api/expense`
- `GET /api/expenses`

## Run

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.
Frontend runs on `http://localhost:5173`.

## MongoDB Atlas

Update `backend/.env` with your Atlas URI. This project includes `DNS_SERVERS=8.8.8.8,1.1.1.1` so Node can resolve Atlas `mongodb+srv` records even when Windows reports a local DNS resolver like `127.0.0.1`.

In MongoDB Atlas, open **Network Access** and add your current IP address. For classroom/demo use only, you can temporarily add `0.0.0.0/0`, but remove it before real deployment.
