🛍️ Shoe Selling Platform – Admin Panel
📌 Project Overview

This project is a full-stack admin panel for an online shoe selling platform. It allows administrators to manage products, users, and orders efficiently.

The system is designed with a focus on product variant management, enabling handling of different sizes, colors, and stock levels for each product.

🚀 Features
👟 Product Management
Add new products
Edit existing products
Delete products
Manage product variants:
Size
Color
Stock
SKU
👤 User Management
Add users
View users
Delete users
📦 Orders Management
View all orders
Store order details in database
📊 Dashboard
Total Users
Total Products
Total Orders
🛠️ Tech Stack
Frontend: Next.js (App Router)
Backend: Next.js API Routes (Node.js)
Database: MongoDB Atlas
ODM: Mongoose
Styling: Tailwind CSS / CSS
📁 Project Structure

src/
├── app/ # Next.js routes
├── api/ # Backend APIs
├── components/ # Reusable UI components
├── models/ # MongoDB schemas
├── lib/ # Utilities (DB connection, helpers)
├── screens/ # UI screens/pages

⚙️ Installation & Setup
1. Clone the repository

git clone https://github.com/nahan-shawkkathali/shoe-selling-platform.git
cd shoe-selling-platform/admin

2. Install dependencies

npm install

3. Create environment file

Create a .env.local file and add:

MONGODB_URI=your_mongodb_connection_string

4. Run the project

npm run dev

👉 Open: http://localhost:3000

🔄 API Endpoints
Users

GET /api/users
POST /api/users
DELETE /api/users

Products

GET /api/products
POST /api/products
PUT /api/products
DELETE /api/products

Orders

GET /api/orders
POST /api/orders

Dashboard

GET /api/dashboard

🧠 Key Concepts Implemented
Full-stack development (Frontend + Backend + Database)
CRUD operations
Dynamic routing in Next.js
MongoDB schema design
API integration
State management using React hooks
🚧 Current Status
Admin panel: ✅ Completed
Product CRUD: ✅ Completed
Orders module: ✅ Implemented
Dashboard: ✅ Working
🔜 Future Improvements
User authentication (Login/Signup)
Customer-facing store UI
Order status updates
Image upload support
UI enhancements
🎯 Purpose

This project was built to demonstrate full-stack development skills for internship and portfolio purposes.

👨‍💻 Author

Nahan Shawkkathali