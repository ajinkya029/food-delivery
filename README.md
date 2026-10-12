# 🍔 Food Delivery Backend — MERN Stack

A RESTful API backend for a food delivery application built using **Node.js, Express.js, MongoDB, and Mongoose**. It provides secure authentication, restaurant and menu management, order processing, and delivery status tracking, ready to integrate with a React frontend.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Example API Requests](#-example-api-requests)
- [Authentication](#-authentication)
- [Database Models](#-database-models)
- [Order Lifecycle](#-order-lifecycle)
- [Security](#-security)
- [Future Improvements](#-future-improvements)
- [License](#-license)

## ✨ Features

### 🔐 Authentication and Authorization
- Customer registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based access control for customers and administrators.
- Protected API routes.

### 🍽️ Restaurant and Menu Management
- Browse available restaurants.
- Search restaurants by name, description, and cuisine.
- Filter restaurants by city and availability.
- Pagination for restaurant listings.
- View restaurant details and menus.
- Admin-only restaurant creation, updating, and deletion.
- Manage menu items, prices, and availability.

### 🛒 Order Management
- Place food orders.
- Calculate order totals on the server.
- Validate menu items and quantities.
- Store delivery addresses and order notes.
- View order history and individual order details.
- Cancel eligible orders.
- Restrict customers to their own orders.

### 🚚 Delivery Tracking
- Manage order statuses throughout the delivery process.
- Allow administrators to update order progress.
- Track order and payment status.

### 🛡️ Security and Reliability
- Helmet security headers.
- Configurable CORS.
- API rate limiting.
- Centralized error handling.
- MongoDB schema validation.
- Duplicate email protection.

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JavaScript | Backend programming language |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Helmet | HTTP security headers |
| CORS | Cross-origin request configuration |
| express-rate-limit | API rate limiting |
| Morgan | HTTP request logging |
| dotenv | Environment variable management |
| Nodemon | Development server auto-restart |

## 📁 Project Structure

```text
food-delivery/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── utils/
│   │   └── token.js
│   │
│   └── app.js
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js:** Version 18 or later
- **npm:** Included with Node.js
- **MongoDB:** Local MongoDB installation or MongoDB Atlas account
- **Git:** For version control
- **Postman:** Recommended for API testing

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/food-delivery-backend.git
```

Navigate into the project directory:

```bash
cd food-delivery
```

Alternatively, extract the downloaded ZIP file and open the extracted folder in VS Code.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file from the provided example.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure your settings:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/food_delivery
JWT_SECRET=your_generated_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Replace `JWT_SECRET` with a securely generated random secret. For production, use a managed database connection string and separate production secrets.

### 4. Start MongoDB

If you're using MongoDB locally, make sure the MongoDB service is running.

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string and ensure your database user and network access are configured correctly.

### 5. Start the development server

```bash
npm run dev
```

For production-style startup:

```bash
npm start
```

Expected output:

```text
MongoDB connected: 127.0.0.1
API running on http://localhost:5000
```

The exact MongoDB host in the output depends on your connection configuration.

### 6. Verify the API

Open this endpoint in your browser or API client:

```http
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "food-delivery-api"
}
```

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express server |
| `NODE_ENV` | Environment, such as development or production |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | Token expiration duration |
| `CLIENT_URL` | Allowed frontend origin or comma-separated origins |

**Important:** Never commit your `.env` file or expose your JWT secret. The project `.gitignore` excludes `.env` by default.

## 📡 API Documentation

Base URL:

```text
http://localhost:5000/api
```

### Authentication APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a customer |
| POST | `/auth/login` | Public | Authenticate a customer |
| GET | `/auth/me` | Authenticated | Retrieve the current user |

### Restaurant APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/restaurants` | Public | List restaurants |
| GET | `/restaurants/:id` | Public | Retrieve restaurant details and menu |
| POST | `/restaurants` | Admin | Create a restaurant |
| PATCH | `/restaurants/:id` | Admin | Update restaurant details or menu |
| DELETE | `/restaurants/:id` | Admin | Delete a restaurant |

Restaurant listing supports query parameters:

```http
GET /api/restaurants?city=Pune&search=pizza&open=true&page=1&limit=12
```

### Order APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/orders` | Authenticated | Place an order |
| GET | `/orders` | Authenticated | Retrieve orders |
| GET | `/orders/:id` | Owner/Admin | Retrieve a specific order |
| PATCH | `/orders/:id/status` | Owner/Admin | Cancel or update order status |
| PATCH | `/orders/:id/payment` | Admin | Update payment status |

Customers can access their own orders. Administrators can view all orders and manage order and payment statuses.

## 🧪 Example API Requests

### 1. Register a Customer

**POST** `/api/auth/register`

```json
{
  "name": "Asha Patil",
  "email": "asha@example.com",
  "password": "StrongPassword123",
  "phone": "9999999999"
}
```

The response contains a JWT token and basic user details.

### 2. Login

**POST** `/api/auth/login`

```json
{
  "email": "asha@example.com",
  "password": "StrongPassword123"
}
```

Use the returned token when calling protected endpoints.

### 3. Create a Restaurant

**POST** `/api/restaurants`

Requires an administrator token.

```json
{
  "name": "Pune Spice Kitchen",
  "description": "Indian comfort food",
  "cuisine": ["Indian", "North Indian"],
  "address": {
    "line1": "FC Road",
    "city": "Pune",
    "postalCode": "411004"
  },
  "deliveryFee": 35,
  "estimatedDeliveryMinutes": 30,
  "isOpen": true,
  "menu": [
    {
      "name": "Paneer Tikka Wrap",
      "description": "Paneer with mint chutney",
      "price": 180,
      "category": "Wraps",
      "isVegetarian": true
    },
    {
      "name": "Masala Fries",
      "price": 90,
      "category": "Sides",
      "isVegetarian": true
    }
  ]
}
```

### 4. Place an Order

**POST** `/api/orders`

```json
{
  "restaurantId": "RESTAURANT_ID",
  "items": [
    {
      "menuItemId": "MENU_ITEM_ID",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "line1": "12 Example Road",
    "city": "Pune",
    "postalCode": "411001"
  },
  "paymentMethod": "cash",
  "notes": "Please call on arrival"
}
```

Replace `RESTAURANT_ID` and `MENU_ITEM_ID` with actual MongoDB IDs returned by the restaurant endpoints.

The server retrieves the menu prices from MongoDB and calculates the subtotal, delivery fee, and total. It does not rely on prices submitted by the client.

### 5. Update Order Status

**PATCH** `/api/orders/ORDER_ID/status`

Administrator request:

```json
{
  "status": "preparing"
}
```

Supported statuses:

- `placed`
- `confirmed`
- `preparing`
- `out_for_delivery`
- `delivered`
- `cancelled`

Customers may only cancel their own orders while their status is `placed` or `confirmed`.

## 🔐 Authentication

Protected endpoints require a Bearer token in the HTTP `Authorization` header.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Creating an Administrator

Registration creates customer accounts only. To promote a trusted account to administrator, register normally and update its role directly in MongoDB using MongoDB Compass or `mongosh`.

```javascript
use food_delivery

db.users.updateOne(
  { email: "your-admin@example.com" },
  { $set: { role: "admin" } }
)
```

Log in again to obtain a token containing the administrator role.

Never expose an unrestricted admin-promotion endpoint in a public application.

## 🗄️ Database Models

### User

Stores customer and administrator information.

- Name, email, and hashed password
- Role and phone number
- Saved delivery addresses
- Created and updated timestamps

### Restaurant

Stores restaurant details and embedded menu items.

- Restaurant name and description
- Cuisine categories and image URL
- Address and city
- Delivery fee and estimated delivery time
- Open/closed status
- Menu items, prices, categories, and availability

### Order

Stores order and delivery information.

- Customer and restaurant references
- Ordered menu items and quantities
- Server-calculated prices and totals
- Delivery address and notes
- Payment method and payment status
- Order lifecycle status
- Created and updated timestamps

## 📦 Order Lifecycle

```text
Placed
  |
  v
Confirmed
  |
  v
Preparing
  |
  v
Out for Delivery
  |
  v
Delivered
```

Orders may be cancelled when permitted by the application's cancellation rules. Administrators can update order statuses through the protected API.

## 🛡️ Security Considerations

- Passwords are hashed using bcrypt before storage.
- JWTs protect authenticated routes.
- Administrative operations require an administrator role.
- Order ownership is checked before customers view or cancel orders.
- Order totals are calculated on the backend.
- Helmet adds HTTP security headers.
- Rate limiting helps reduce excessive API requests.
- Environment variables keep credentials separate from application code.

For a production deployment, add comprehensive request schema validation, stronger operational logging, automated tests, secure token storage, and a real payment gateway with verified webhooks. Online payment status should never be marked as paid solely because a client requests it.

## 🔮 Future Improvements

Potential extensions for the application include:

- React frontend for customers and administrators
- Shopping cart and checkout interface
- Payment gateway integration
- Real-time order tracking using Socket.IO
- Restaurant ratings and reviews
- Coupons, discounts, and promotional offers
- Delivery partner accounts and assignment
- Email and SMS notifications
- Image uploads using cloud storage
- Automated API tests and CI/CD deployment

## 📄 License

This project is available for learning and portfolio development. Add a `LICENSE` file if you intend to distribute it publicly, and choose a license that matches your intended usage.

---

## 👨‍💻 Author

**Ajinkya Dhatrak**

GitHub: [@ajinkya029](https://github.com/ajinkya029)

---

**Built with ❤️ using Node.js, Express.js, MongoDB, and Mongoose.**