# ShieldPay Backend API

## Overview

A backend API for managing users and their wallets, built with Express.js, TypeScript, PostgreSQL, Sequelize, and Docker.

## Features

- User registration and authentication (JWT)
- CRUD operations for wallets
- PostgreSQL with Sequelize ORM
- Swagger API docs at `/docs`
- Docker and docker-compose support

## Setup

### 1. Clone the repository

```bash
git clone <https://github.com/Skpow1234/ShieldPay-Challenge>
cd ShieldPay-Challenge
```

### 2. Environment Variables

Create a `.env` file (optional for local dev):

```bash
PORT=3000
DATABASE_URL=postgres://postgres:postgres@db:5432/shieldpay
JWT_SECRET=your_jwt_secret
```

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

- App: <http://localhost:3000>
- Swagger docs: <http://localhost:3000/docs>
- DB: localhost:5432 (user: postgres, pass: postgres, db: shieldpay)

### 4. Run Locally (without Docker)

- Install dependencies: `npm install`
- Start PostgreSQL locally
- Set environment variables in `.env`
- Run: `npx ts-node src/index.ts`

## API Endpoints

### Auth

- `POST /users` — Register user `{ email, password }`
- `POST /signin` — Sign in `{ email, password }` → `{ token }`
- `POST /signout` — Sign out (client deletes token)

### Wallets (JWT required)

- `GET /wallets` — List wallets
- `POST /wallets` — Create wallet `{ tag?, chain, address }`
- `GET /wallets/:id` — Get wallet by id
- `PUT /wallets/:id` — Update wallet
- `DELETE /wallets/:id` — Delete wallet

## Database Schema

- **users**: id (UUID), email (unique), password (hashed)
- **wallets**: id (UUID), user_id (FK), tag, chain, address (unique)

## Notes

- Passwords are hashed with bcrypt.
- JWT is used for authentication.
- Only authenticated users can manage their wallets.
- Error handling and validation included.

---
