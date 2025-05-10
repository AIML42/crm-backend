# Hubly Backend

## Overview
The Hubly backend is a Node.js application built with Express.js, providing RESTful APIs for the Hubly CRM platform. It handles user authentication, team management, chatbot configuration, and chat functionality for both authenticated users and visitors via the landing page chatbot.

## Features
- **Authentication**:
  - Login endpoint with JWT-based authentication.
  - Role-based access control (admin, team).
- **Team Management**:
  - CRUD operations for team members.
  - Admin-only access for managing team members.
- **Chatbot Configuration**:
  - Store and update chatbot settings (welcome message, colors, introduction form, etc.).
- **Chat System**:
  - Create and manage chats for visitors via the landing page chatbot.
  - Support for sending messages and polling chat updates.
  - Store user info (name, phone, email) with each chat.
- **Database**:
  - MongoDB for persistent storage of users, teams, chats, and configurations.

## Tech Stack
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For token-based authentication.
- **Bcrypt**: For password hashing.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone <backend-repo-url>
   cd hubly-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/hubly
   JWT_SECRET=your_jwt_secret_here
   ```
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secret key for signing JWT tokens.
4. Start the MongoDB server (if running locally):
   ```bash
   mongod
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```
   The server will run at `http://localhost:4000`.

## API Endpoints
- **Auth**:
  - `POST /api/auth/login`: Authenticate a user and return a JWT token.
- **Team**:
  - `GET /api/team`: Fetch all team members (admin only).
  - `POST /api/team`: Add a new team member (admin only).
  - `PATCH /api/team/:id`: Update a team member (admin or self).
  - `DELETE /api/team/:id`: Delete a team member (admin only).
- **Chatbot Config**:
  - `GET /api/chatbot`: Fetch chatbot configuration.
  - `PATCH /api/chatbot`: Update chatbot configuration (admin only).
- **Chats**:
  - `POST /api/chats`: Create a new chat (used by the landing page chatbot).
  - `GET /api/chats/:chatId`: Fetch a chat by ID.
  - `POST /api/chats/:chatId/messages`: Send a message to a specific chat.

## Project Structure
- `src/`
  - `models/`: Mongoose schemas (e.g., `User`, `Team`, `Chat`, `ChatbotConfig`).
  - `routes/`: API route handlers (e.g., `authRoutes`, `teamRoutes`, `chatRoutes`).
  - `middleware/`: Middleware functions (e.g., authentication, role-based access).
  - `controllers/`: Business logic for handling requests.
  - `config/`: Configuration files (e.g., database connection).

## Development Notes
- Ensure MongoDB is running and the `MONGODB_URI` is correctly set.
- The `POST /api/chats/:chatId/messages` endpoint is assumed for sending messages; implement it if not already present.
- Add input validation for API requests using a library like Joi or express-validator.
- Consider adding rate limiting for the chat polling endpoint to prevent abuse.

## Future Improvements
- Add Swagger/OpenAPI documentation for the API.
- Implement rate limiting for chat polling.
- Add more robust error handling and logging.
- Support WebSocket for real-time chat updates instead of polling.
