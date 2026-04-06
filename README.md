# E-Commerce Application

## Project Description
This is an e-commerce application built with Node.js. It allows users to browse products, add them to a shopping cart, and proceed to checkout. The application supports real-time functionalities using Socket.io for interactive user experiences.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Barbarayoussef/E-Commerce-using-node.js.git
   cd E-Commerce-using-node.js
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the root directory and add the following keys:
   ```bash
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Run the application:
   ```bash
   npm start
   ```

## Environment Variables
- `PORT`: The port on which the server will run.
- `MONGODB_URI`: The connection string for MongoDB.
- `JWT_SECRET`: Secret key for JWT authentication.

## API Endpoints Documentation
### User Endpoints
- **POST /api/users/register**: Register a new user.
- **POST /api/users/login**: Log in an existing user.

### Product Endpoints
- **GET /api/products**: Retrieve all products.
- **GET /api/products/:id**: Retrieve a single product by ID.

### Cart Endpoints
- **POST /api/cart**: Add a product to the cart.
- **GET /api/cart**: Retrieve cart items.

### Checkout Endpoints
- **POST /api/checkout**: Process the checkout.

## Socket.io Events Documentation
- **connection**: Fired when a new client connects to the server.
- **disconnection**: Fired when a client disconnects.
- **message**: Event for sending messages between users.
- **cartUpdate**: Event triggered when the cart is updated.

---  
This project includes functionalities to enhance user experience and improve performance. Enjoy browsing and shopping!