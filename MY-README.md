# 🧾 Product API – Express Server

A simple **Express.js REST API** for managing products, built with in-memory data and custom error handling.
This project demonstrates middleware usage, error classes, logging, authentication, validation, and query-based filtering.

---

## 🚀 How to Run the Server

### 1. **Install dependencies**

```bash
npm install
```

### 2. **Run the server**

```bash
node server.js
```

### 3. **Access the app**

Open your browser or API client (e.g., Postman) and visit:

```
http://localhost:3000
```

---

## ⚙️ Environment

| Tool        | Version |
| ----------- | ------- |
| Node.js     | ≥ 18.x  |
| Express     | ^4.x    |
| Body-Parser | ^1.x    |
| UUID        | ^9.x    |

---

## 🔐 Authentication

Some routes require an **API key** in the request headers:

```
x-api-key: My-Pass
```

Admin routes also require a **user ID** header of an admin user:

```
x-user-id: 1001
```

---

## 🧩 API Endpoints

### **Root**

`GET /`
→ Returns a simple greeting message.

---

### **1️⃣ Get All Products**

`GET /api/products`

#### Query Parameters (optional)

| Parameter  | Type   | Description                 |
| ---------- | ------ | --------------------------- |
| `category` | string | Filter products by category |
| `search`   | string | Search products by name     |
| `page`     | number | Page number (starting at 1) |
| `limit`    | number | Number of items per page    |

#### Example Request:

```
GET /api/products?category=electronics&search=phone&page=1&limit=5
```

#### Example Response:

```json
{
  "total": 2,
  "page": 1,
  "limit": 5,
  "results": [
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

### **2️⃣ Get Product by ID**

`GET /api/products/:id`

#### Example:

```
GET /api/products/1
```

#### Response:

```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

---

### **3️⃣ Create Product**

`POST /api/products`

> 🔒 Protected – requires both `x-api-key` and `x-user-id` (must be admin).

#### Headers:

```
x-api-key: My-Pass
x-user-id: 1001
```

#### Example Body:

```json
{
  "name": "Tablet",
  "description": "10-inch display tablet",
  "price": 300,
  "category": "electronics",
  "inStock": true
}
```

#### Response:

```json
{
  "message": "Tablet has successfully been created"
}
```

---

### **4️⃣ Update Product**

`PUT /api/products/:id`

> 🔒 Protected – requires valid `x-api-key`.

#### Example:

```
PUT /api/products/2
```

#### Body:

```json
{
  "price": 750,
  "inStock": false
}
```

#### Response:

```json
"Successfully updated"
```

---

### **5️⃣ Delete Product**

`DELETE /api/products/:id`

> 🔒 Protected – requires valid `x-api-key`.

#### Example:

```
DELETE /api/products/3
```

#### Response:

```json
"Product successfully deleted!!!"
```

---

### **6️⃣ Product Statistics**

`GET /api/products/stats`

Returns the number of products in each category.

#### Example Response:

```json
[
  { "category": "electronics", "count": 2 },
  { "category": "kitchen", "count": 1 }
]
```

---

## ⚠️ Error Handling

Custom error classes are defined in **`errors.js`**:

| Error Type            | Status | Example                                |
| --------------------- | ------ | -------------------------------------- |
| `ValidationError`     | 400    | Missing fields when creating a product |
| `ForbiddenError`      | 403    | User not authorized                    |
| `AuthenticationError` | 401    | Invalid API key                        |
| `NotFound`            | 404    | Product not found                      |

Errors are automatically caught and formatted by the **global error handler**.

---

## 🧠 Example Workflow

1. View all products → `GET /api/products`
2. Create a new product → `POST /api/products` with admin headers
3. Update a product → `PUT /api/products/:id`
4. Delete a product → `DELETE /api/products/:id`
5. View stats → `GET /api/products/stats`

---

## 🧰 Example Headers for Protected Routes

```
x-api-key: My-Pass
x-user-id: 1001
Content-Type: application/json
```



