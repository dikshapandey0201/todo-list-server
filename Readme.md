# TODO LIST APP

**Todo List App** is a full-stack web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and integrated with TypeScript.  
It enables users to efficiently create, manage, and organize their tasks with a secure authentication system.

🔗 **Live Demo:** [Todo List App](https://todo-client-pi-ruby.vercel.app/)

---

**Frontend Repository:** [GitHub Link](https://github.com/dikshapandey0201/todo-client)  
**Backend Repository:** [GitHub Link](https://github.com/dikshapandey0201/todo-list-server)

---

## 🔐 Authentication Features

- User registration with name, email, and password
- User login with email and password
- Generates access and refresh tokens
- Secure JWT-based authentication:
  - **Access Token**: short-lived
  - **Refresh Token**: long-lived, stored in HttpOnly cookies
- Logout functionality:
  - Tokens are removed from cookies and MongoDB
- Automatic token refresh on expiration
- Protected routes using middleware

## 📝 To-Do Features

Authenticated users can:

- Create new to-do items with title, description, due date, and status
- View a list of all to-dos associated with their account
- Update to-dos via drag-and-drop or buttons
- Delete unnecessary to-do items
- Filter to-dos by status: **Pending**, **In Progress**, **Completed**
- Mark tasks as completed using drag-and-drop or buttons

## 💻 Frontend (React + TypeScript)

- Authentication pages: login, signup
- To-do dashboard with full CRUD functionality
- Dark mode toggle (theme switcher)
- TailwindCSS and Material UI for styling
- Loading states and error handling
- API integration using `fetch`

## ⚙️ Backend (Express.js + MongoDB)

- RESTful API structure
- Data Models:
  - **User**: name, email, passwordHash, refreshToken
  - **Task**: title, description, status, dueDate, owner (references User)
- Middleware:
  - JWT verification
  - Token revocation
  - Error handling
- Security:
  - Passwords hashed using `bcryptjs`
  - CORS configuration enabled

## ✨ Bonus Features

- Dark mode toggle
- Pagination for to-dos
- Drag-and-drop functionality for updating to-dos
- Redux User and auth state management.
- Redux Toolkit Query for built in cache support.

## 🚀 Dev Environment Setup

1. Clone/download both frontend and backend repositories
2. Run `npm install` in both directories
3. For frontend:
   - Update `baseUrl` in `authApi.ts` and `taskSlice.ts`
   - Set up proxy configuration
4. For backend:
   - Update CORS policy and cookie settings (for dev env.)
   - Configure `.env` variables
5. Start the development servers — you're good to go!

## 🔐 Environment Variables (`.env` Sample)

```env
PORT=3000
MONGO_URI=mongodb+srv://exampleuser:dTnJfJycwRFdV6JY@cluster0.k316tyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=v3ryS3cur3!JWTs3cr3tK3y#2025@TodoApp
JWT_REFRESH_SECRET=R3fr3shT0k3n$Secr3t!2025#Safe&Strong
NODE_ENV=production
