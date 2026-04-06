# E-Commerce API (Node.js)

A full-featured backend for an e-commerce platform built with Node.js and Express. Includes product catalog, shopping cart, order management, JWT authentication with email verification, Cloudinary image uploads, and an HR management module for staff, attendance, deductions, and salary. Real-time admin offers are delivered to all connected clients via Socket.io.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Socket.io Events](#socketio-events)

---

## Tech Stack

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| Runtime          | Node.js (ES Modules)                 |
| Framework        | Express 5                            |
| Database         | MongoDB via Mongoose                 |
| Cache            | Redis (OTP storage, attendance keys) |
| Auth             | JWT with role-specific secrets       |
| File Uploads     | Multer + Cloudinary                  |
| Email            | Nodemailer (Gmail SMTP)              |
| Real-time        | Socket.io                            |
| Validation       | Joi                                  |
| Password Hashing | bcrypt                               |

---

## Project Structure

```
E-Commerce using node.js/
├── config/
│   ├── cloudinary.config.js
│   ├── env.service.js
│   └── .env
├── src/
│   ├── main.js
│   ├── app.controller.js
│   ├── common/
│   │   └── email/
│   │       └── sendEmail.js
│   ├── database/
│   │   ├── connection.js
│   │   ├── redis.connection.js
│   │   └── model/
│   │       ├── user.model.js
│   │       ├── product.model.js
│   │       ├── category.model.js
│   │       ├── subcategory.model.js
│   │       ├── cart.model.js
│   │       ├── order.model.js
│   │       ├── message.model.js
│   │       ├── staff.model.js
│   │       └── deduction.model.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── checkDeleteAccount.js
│   │   └── multer.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── category/
│   │   ├── subcategory/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── order/
│   │   └── hrManagementSystem/
│   │       ├── staffMange/
│   │       ├── attendance/
│   │       ├── deduction/
│   │       └── salary/
│   └── utils/
│       └── validation.js
├── frontend/
│   ├── index.html
│   └── js/
│       └── index.js
├── package.json
└── README.md
```

---

## Installation

### Prerequisites

- Node.js v18+
- MongoDB instance
- Redis instance
- Cloudinary account
- Gmail account with an app password (for email sending)

### Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd "E-Commerce using node.js"
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

Create `config/.env` and fill in all required variables — see [Environment Variables](#environment-variables).

4. **Start the server**

```bash
npm run start:dev
```

---

## Environment Variables

Create a `config/.env` file with the following:

```env
# Server
PORT=3000
BASE_URL=http://localhost:3000

# Database
MONGO_URL=mongodb://localhost:27017/ecommerce

# JWT
ADMIN_SIGNATURE=your_admin_secret
USER_SIGNATURE=your_user_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_NAME=Your App Name

# Auth
SALT_ROUND=10
VERIFY_EMAILSECRET=your_email_verification_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

| Variable                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `PORT`                  | HTTP server port                             |
| `BASE_URL`              | Public base URL (used in verification links) |
| `MONGO_URL`             | MongoDB connection string                    |
| `ADMIN_SIGNATURE`       | JWT secret for admin tokens                  |
| `USER_SIGNATURE`        | JWT secret for user tokens                   |
| `EMAIL_USER`            | Gmail address for sending emails             |
| `EMAIL_PASS`            | Gmail app password                           |
| `EMAIL_NAME`            | Display name in the From header              |
| `SALT_ROUND`            | bcrypt cost factor                           |
| `VERIFY_EMAILSECRET`    | Secret for email verification JWTs           |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                        |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                           |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                        |

> **Note:** The Redis connection URL is currently hardcoded in `src/database/redis.connection.js`. Move it to `.env` before deploying to production.

---

## Running the Application

**Development** (with hot reload):

```bash
npm run start:dev
```

Uses Node's built-in `--watch` flag: `node --watch src/main.js`.

**Production:**

```bash
node src/main.js
```

---

## Authentication

All protected routes require this header:

```http
Authorization: <bearer> <token>
```

`<bearer>` must be one of:

- `admin` — for admin routes
- `user` — for customer routes
- `staff` — for attendance routes

**Example:**

```http
Authorization: user eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Endpoints

Base path: `/api/v1`

### Auth — `/api/v1/auth`

| Method | Endpoint               | Auth | Description                       |
| ------ | ---------------------- | ---- | --------------------------------- |
| POST   | `/signup`              | No   | Register (optional `avatar` file) |
| GET    | `/verify-email/:token` | No   | Verify email address              |
| POST   | `/resend-verification` | No   | Resend verification email         |
| POST   | `/login`               | No   | Login                             |
| POST   | `/forget-password`     | No   | Request password reset OTP        |
| POST   | `/reset-password`      | No   | Reset password with OTP           |

### Users — `/api/v1/users`

| Method | Endpoint         | Auth | Description                             |
| ------ | ---------------- | ---- | --------------------------------------- |
| GET    | `/profile`       | user | Get profile                             |
| PUT    | `/profile`       | user | Update profile (optional `avatar` file) |
| DELETE | `/profile`       | user | Soft-delete account                     |
| POST   | `/upload-avatar` | user | Upload avatar                           |

### Categories — `/api/v1/categories`

| Method | Endpoint             | Auth  | Description                             |
| ------ | -------------------- | ----- | --------------------------------------- |
| POST   | `/`                  | admin | Create category (requires `image` file) |
| PUT    | `/:id`               | admin | Update category                         |
| DELETE | `/:id`               | admin | Soft-delete category                    |
| GET    | `/`                  | admin | List all categories                     |
| GET    | `/all`               | No    | List active categories (public)         |
| GET    | `/:id/subcategories` | No    | Get subcategories for a category        |

### Subcategories — `/api/v1/subcategories`

| Method | Endpoint | Auth  | Description             |
| ------ | -------- | ----- | ----------------------- |
| POST   | `/`      | admin | Create subcategory      |
| PUT    | `/:id`   | admin | Update subcategory      |
| DELETE | `/:id`   | admin | Soft-delete subcategory |
| GET    | `/:id`   | user  | Get subcategory by ID   |

### Products — `/api/v1`

| Method | Endpoint                            | Auth  | Description                              |
| ------ | ----------------------------------- | ----- | ---------------------------------------- |
| POST   | `/admin/products`                   | admin | Create product (multiple `images` files) |
| PUT    | `/admin/products/:id`               | admin | Update product                           |
| DELETE | `/admin/products/:id`               | admin | Soft-delete product                      |
| PUT    | `/admin/products/:id/stock`         | admin | Update stock                             |
| GET    | `/products`                         | No    | List all products                        |
| GET    | `/products/:id`                     | No    | Get product by ID                        |
| GET    | `/products/category/:categoryId`    | No    | Products by category                     |
| GET    | `/products/subcategory/:categoryId` | No    | Products by subcategory                  |

### Cart — `/api/v1/cart`

| Method | Endpoint      | Auth | Description          |
| ------ | ------------- | ---- | -------------------- |
| POST   | `/`           | user | Add item to cart     |
| GET    | `/`           | user | View cart            |
| PUT    | `/:productId` | user | Update item quantity |
| DELETE | `/:productId` | user | Remove item          |
| DELETE | `/`           | user | Clear cart           |

### Orders — `/api/v1`

| Method | Endpoint                   | Auth  | Description         |
| ------ | -------------------------- | ----- | ------------------- |
| POST   | `/orders/checkout`         | user  | Checkout from cart  |
| GET    | `/orders`                  | user  | View my orders      |
| GET    | `/orders/:id`              | user  | View order details  |
| GET    | `/admin/orders`            | admin | View all orders     |
| PATCH  | `/admin/orders/:id/status` | admin | Update order status |

### HR — Staff — `/api/v1/admin`

| Method | Endpoint     | Auth  | Description       |
| ------ | ------------ | ----- | ----------------- |
| POST   | `/staff`     | admin | Add staff member  |
| GET    | `/staff`     | admin | List all staff    |
| GET    | `/staff/:id` | admin | Get staff details |
| PUT    | `/staff/:id` | admin | Update staff info |
| DELETE | `/staff/:id` | admin | Soft-delete staff |

### HR — Attendance — `/api/v1/staff`

| Method | Endpoint     | Auth  | Description           |
| ------ | ------------ | ----- | --------------------- |
| POST   | `/check-in`  | staff | Check in for the day  |
| POST   | `/check-out` | staff | Check out for the day |

Check-in marks late if after 9:00 AM. Check-out calculates hours worked and creates deductions for incomplete hours or late arrival. Uses Redis with a 48-hour TTL. If staff checked in yesterday but never checked out, they are automatically marked absent on their next check-in.

### HR — Deductions — `/api/v1/admin/staff`

| Method | Endpoint                       | Auth  | Description             |
| ------ | ------------------------------ | ----- | ----------------------- |
| POST   | `/:id/deductions`              | admin | Add deduction for staff |
| GET    | `/:id/deductions`              | admin | List staff deductions   |
| PUT    | `/:id/deductions/:deductionId` | admin | Update deduction        |
| DELETE | `/:id/deductions/:deductionId` | admin | Remove deduction        |

### HR — Salary — `/api/v1/admin/staff`

| Method | Endpoint                    | Auth  | Description              |
| ------ | --------------------------- | ----- | ------------------------ |
| GET    | `/:id/salary/:month`        | admin | Calculate monthly salary |
| POST   | `/:id/salary/:month/pay`    | admin | Mark salary as paid      |
| PUT    | `/:id/salary/:month/adjust` | admin | Add salary adjustment    |

**Salary formula:**

```
Base Salary      = Daily Salary × Days Worked
Deductions       = Late deductions + Incomplete hours deductions + Manual deductions
Final Salary     = Base Salary - Deductions + Adjustments
```

Month format: `YYYY-MM` (e.g. `2024-03`)

---

## Socket.io Events

Socket.io is mounted on the same HTTP server. CORS is currently set to `http://127.0.0.1:5500` — update `app.controller.js` for your frontend URL.

### Connection Authentication

Clients must authenticate on connect using one of:

**Option 1 — Header:**

```javascript
const socket = io("http://localhost:3000", {
  extraHeaders: { authorization: "user YOUR_TOKEN" },
});
```

**Option 2 — Auth object:**

```javascript
const socket = io("http://localhost:3000", {
  auth: { token: "user YOUR_TOKEN" },
});
```

`bearer` must be `admin` or `user`. The server verifies the JWT and attaches `socket.user` with `id` and `role`.

### Events

| Direction       | Event                | Auth Required | Description                               |
| --------------- | -------------------- | ------------- | ----------------------------------------- |
| Client → Server | `admin:send-offer`   | admin         | Broadcast an offer to all connected users |
| Server → Client | `user:receive-offer` | —             | Offer payload sent to all clients         |
| Server → Client | `error`              | —             | Error message string                      |

**`admin:send-offer` payload:**

```javascript
{
  type: "offer" | "announcement",
  title: "Summer Sale",
  message: "30% off everything this weekend",
  discountCode: "SUMMER30",   // optional
  expiresAt: "2024-08-31T23:59:59Z"
}
```

Offers are persisted to MongoDB before being broadcast. Non-admin users who emit this event receive an `error` event.

### Client Example

```javascript
// User — receive offers
const socket = io("http://localhost:3000", {
  auth: { token: "user YOUR_JWT_TOKEN" },
});

socket.on("user:receive-offer", (offer) => {
  console.log("New offer:", offer);
});

// Admin — send offer
const adminSocket = io("http://localhost:3000", {
  auth: { token: "admin YOUR_ADMIN_JWT_TOKEN" },
});

adminSocket.emit("admin:send-offer", {
  type: "offer",
  title: "Flash Sale",
  message: "50% off for the next 2 hours",
  discountCode: "FLASH50",
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
});
```

---
## Postman Collection

Import `docs/postman_collection.json` into Postman to test all API endpoints.


## License

ISC
