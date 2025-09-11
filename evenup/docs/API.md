# EvenUp API Documentation

## Overview

The EvenUp API is a RESTful service built with Node.js and Express that powers the bill-splitting mobile application. It provides endpoints for user authentication, restaurant management, menu browsing, order processing, and group bill management.

## Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://api.evenup.app/v1`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Restaurants

#### GET /restaurants
Get list of restaurants with optional filtering.

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of items per page (default: 10)
- `search` (string): Search by restaurant name or description
- `cuisine_type` (string): Filter by cuisine type

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": 1,
        "name": "The Hussar Grill",
        "address": "12 Dorp Street, Stellenbosch, 7600",
        "phone": "+27 21 887 4444",
        "cuisine_type": "Steakhouse",
        "description": "Premium steakhouse offering the finest cuts of meat",
        "latitude": -33.9321,
        "longitude": 18.8602,
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### GET /restaurants/{id}
Get specific restaurant details.

#### POST /restaurants
Create new restaurant (admin only).

#### PUT /restaurants/{id}
Update restaurant (admin only).

#### DELETE /restaurants/{id}
Delete restaurant (admin only).

### Menu Items

#### GET /menus/restaurant/{restaurantId}
Get menu items for a specific restaurant.

**Response:**
```json
{
  "success": true,
  "data": {
    "menuItems": [
      {
        "id": 1,
        "restaurant_id": 1,
        "name": "Ribeye Steak 300g",
        "description": "Prime ribeye steak grilled to perfection",
        "price": 285.00,
        "category": "Mains",
        "dietary_info": ["gluten-free"],
        "image_url": null,
        "is_available": true,
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Groups

#### POST /groups
Create a new dining group.

**Request Body:**
```json
{
  "name": "Friday Night Dinner",
  "restaurant_id": 1,
  "table_number": "A12"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "group": {
      "id": 1,
      "name": "Friday Night Dinner",
      "restaurant_id": 1,
      "creator_id": 1,
      "group_code": "ABC123",
      "table_number": "A12",
      "status": "active",
      "total_amount": 0.00,
      "tip_amount": 0.00,
      "tax_amount": 0.00,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /groups/join
Join an existing group using a group code.

**Request Body:**
```json
{
  "group_code": "ABC123"
}
```

#### GET /groups/{id}
Get group details including members and orders.

#### GET /groups
Get user's groups.

### Orders

#### POST /orders
Add an item to your order within a group.

**Request Body:**
```json
{
  "group_id": 1,
  "menu_item_id": 5,
  "quantity": 2,
  "special_instructions": "Medium rare, no sauce"
}
```

#### GET /orders
Get user's orders.

#### PUT /orders/{id}
Update an order (before it's confirmed).

## Real-time Features

The API supports real-time updates using Socket.IO for:

- Group bill updates
- Order status changes
- New members joining groups
- Payment notifications

### Socket Events

- `join-group`: Join a group room for real-time updates
- `leave-group`: Leave a group room
- `order-update`: Receive order status updates
- `bill-update`: Receive bill total updates
- `member-joined`: Notification when someone joins the group

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Access denied
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `500` - Internal Server Error: Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per 15-minute window per IP address
- Authentication endpoints: 5 requests per 15-minute window per IP

## Data Validation

All request data is validated using Joi schema validation. Common validation rules:

- Email addresses must be valid format
- Passwords must be at least 6 characters
- Required fields must be present
- Numeric values must be positive where applicable

## Interactive Documentation

When running the development server, interactive API documentation is available at:
`http://localhost:3000/api/docs`

This Swagger UI interface allows you to test API endpoints directly from your browser.