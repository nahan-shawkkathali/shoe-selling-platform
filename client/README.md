# Shoe Selling Platform

## Project Overview

This project is a full-stack shoe selling platform with an admin panel and customer-facing store.

The admin panel allows administrators to manage products, users, and orders. The system supports product variants such as size, color, stock, SKU, and product images.

## Features

### Product Management
- Add products
- Edit products
- Delete products
- Manage variants:
  - Size
  - Color
  - Stock
  - SKU
  - Image URL

### User Management
- Add users
- View users
- Delete users

### Orders Management
- Place orders
- View orders
- Update order status
- Reduce product stock after order

### Dashboard
- Total users
- Total products
- Total orders

## Tech Stack

- Next.js App Router
- Next.js API Routes
- MongoDB Atlas
- Mongoose
- Tailwind CSS
- Cloudinary

## Installation

```bash
git clone https://github.com/nahan-shawkkathali/shoe-selling-platform.git
cd shoe-selling-platform
npm install
npm run dev