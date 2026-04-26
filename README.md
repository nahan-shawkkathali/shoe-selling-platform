\# 👟 Walkaholic – Full Stack Ecommerce Shoe Store



\## 📖 Description

Walkaholic is a full-stack ecommerce web application built using Next.js and MongoDB.  

It provides a complete online shopping experience for shoes, including product browsing, variant selection (color \& size), cart management, and order placement.



The project also includes a separate admin panel for managing products, variants, and customer orders.



\---



\## 🚀 Features



\### 🛍️ Customer (Client App)

\- View all products  

\- Product details with:

&#x20; - Color selection  

&#x20; - Size selection  

&#x20; - Variant-based image switching  

\- Unique image per color (no duplicate thumbnails)  

\- Add to cart  

\- Checkout \& place orders  

\- Order tracking system  

\- Wishlist (localStorage)  

\- User authentication (Signup / Login)  

\- View personal orders  



\---



\### 🛠️ Admin Panel

\- Add new products  

\- Edit products  

\- Manage variants:

&#x20; - Color  

&#x20; - Size  

&#x20; - Stock  

&#x20; - Image per variant  

\- Upload product images  

\- View all orders  

\- Update order status:

&#x20; - Pending  

&#x20; - Confirmed  

&#x20; - Shipped  

&#x20; - Delivered  

&#x20; - Cancelled  



\---



\## 🧰 Tech Stack



Frontend:

\- Next.js (App Router)  

\- React.js  

\- Tailwind CSS  



Backend:

\- Next.js API Routes  

\- Node.js  



Database:

\- MongoDB (Mongoose)  



State Management:

\- React Context API  



Authentication:

\- JWT  

\- localStorage (temporary)  



\---



\## 📁 Project Structure



EStore/

├── client/   → Customer-facing ecommerce app  

├── admin/    → Admin dashboard  



\---



\## ⚙️ Installation



Clone Repository:



git clone https://github.com/nahan-shawkkathali/shoe-selling-platform.git  

cd EStore  



Run Client:



cd client  

npm install  

npm run dev  



Run Admin:



cd ../admin  

npm install  

npm run dev  



\---



\## ▶️ Usage



Customer App:

http://localhost:3000  



Steps:

1\. Browse products  

2\. Select color \& size  

3\. Add to cart  

4\. Checkout  

5\. Place order  

6\. View orders  



Admin Panel:

http://localhost:3000/admin  



\---



\## 📸 Screenshots



(Add screenshots here after uploading images)



client/public/screenshots/home.jpg.png  

client/public/screenshots/product.jpg.png  

client/public/screenshots/orders.jpg.png  

admin/public/ad minscreenshots/AdminPanel.jpg.png

admin/public/ad minscreenshots/adproduct.jpg.png

admin/public/ad minscreenshots/adorder.jpg.png



&#x20; 



\---



\## 🔐 Authentication



\- Users can sign up and log in  

\- JWT token is generated  

\- Stored in localStorage (not production-ready)  



\---



\## 🗄️ Database Schema



Products:

\- name  

\- brand  

\- basePrice  

\- variants:

&#x20; - color  

&#x20; - size  

&#x20; - stock  

&#x20; - sku  

&#x20; - imageUrl  



Orders:

\- productId  

\- productName  

\- quantity  

\- totalPrice  

\- imageUrl  

\- status  

\- color  

\- size  

\- sku  

\- address details  



Users:

\- name  

\- email  

\- password (hashed)  

\- role (admin / customer)  



\---



\## ⚠️ Limitations



\- Authentication is basic  

\- No payment integration  

\- No role protection  

\- Orders not fully linked to users  

\- No email system  



\---



\## 📌 Future Improvements



\- Payment integration (Stripe / Razorpay)  

\- Secure authentication (NextAuth)  

\- Admin route protection  

\- Order history per user  

\- Email notifications  

\- Inventory alerts  

\- Reviews \& ratings  



\---



\## 🚀 Deployment



\- Frontend: Vercel  

\- Database: MongoDB Atlas  



\---



\## 🤝 Contributing



1\. Fork the repo  

2\. Create a new branch  

3\. Make changes  

4\. Submit a pull request  



\---



\## 👨‍💻 Author



Nahan Shawkkathali  

GitHub: https://github.com/nahan-shawkkathali

