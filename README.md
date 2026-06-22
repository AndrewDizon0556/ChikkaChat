# ChikkaChat

A real-time messaging platform built with React, Node.js, Socket.IO, MongoDB, and Firebase Authentication.

**Live Demo:** [chikkachat.vercel.app](https://chikkachat.vercel.app) *(update with your actual URL)*

---

## Features

### Core Messaging
- **Real-Time Chat** — Instant message delivery via Socket.IO (< 500ms latency)
- **Private Conversations** — One-on-one messaging between users
- **Group Chats** — Create groups, add/remove members, rename groups, admin controls
- **Message History** — Paginated loading (30 messages per batch, scroll up for more)
- **Message Search** — Search messages within conversations by content
- **Reply to Messages** — Reply context displayed in message bubbles
- **Message Deletion** — Delete your own messages

### Real-Time Features
- **Online Presence** — See who's online with green status indicators
- **Typing Indicators** — Animated "X is typing..." display
- **Live Updates** — New messages, status changes, and typing events pushed instantly

### Authentication
- **Email & Password** — Register and login with email
- **Google OAuth** — One-click Google sign-in
- **Session Persistence** — Stay logged in across browser sessions
- **Protected Routes** — Unauthorized users redirected to login

### File Sharing
- **Image Uploads** — Share images rendered inline in chat (jpg, png, gif, webp)
- **File Uploads** — Share documents with download links (pdf, docx, txt)
- **Upload Progress** — Real-time progress bar during uploads
- **Firebase Storage** — Secure cloud file storage

### User Experience
- **Profile Management** — Edit display name and profile photo
- **User Search** — Find users by name or email to start conversations
- **Responsive Design** — Mobile-friendly layout with slide-out sidebar
- **Toast Notifications** — Non-intrusive success/error/info alerts
- **Landing Page** — Clean marketing page for new visitors

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite |
| **State Management** | Zustand |
| **Backend** | Node.js, Express.js, TypeScript |
| **Real-Time** | Socket.IO |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | Firebase Auth (Email/Password + Google OAuth) |
| **File Storage** | Firebase Storage |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Project Structure

```
ChikkaChat/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/                     # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── chat/                # Chat UI components
│   │   │   │   ├── ChatHeader       # Conversation header + search
│   │   │   │   ├── ConversationSidebar  # Conversation list + filters
│   │   │   │   ├── MessageArea      # Scrollable message list + pagination
│   │   │   │   ├── MessageBubble    # Message display + actions
│   │   │   │   ├── MessageComposer  # Text input + file upload + reply
│   │   │   │   ├── TypingIndicator  # "X is typing..." animation
│   │   │   │   ├── UserSearchModal  # Find users for new conversations
│   │   │   │   ├── CreateGroupModal # Group creation wizard
│   │   │   │   ├── GroupManageModal # Group settings (rename, members)
│   │   │   │   └── MessageSearch    # Search messages in conversation
│   │   │   └── shared/              # Reusable UI (Avatar, Modal, Toast)
│   │   ├── firebase/                # Firebase client config
│   │   ├── pages/                   # Landing, Login, Register, Chat, Profile
│   │   ├── services/                # File upload service
│   │   ├── socket/                  # Socket.IO client connection
│   │   ├── store/                   # Zustand stores (auth, chat, socket, user)
│   │   └── types/                   # TypeScript interfaces
│   └── vite.config.ts
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── config/                  # MongoDB + Firebase Admin setup
│   │   ├── controllers/             # Route handlers
│   │   ├── middleware/              # Firebase token verification
│   │   ├── models/                  # Mongoose schemas (User, Conversation, Message)
│   │   ├── routes/                  # REST API routes
│   │   ├── socket/                  # Socket.IO event handlers
│   │   └── server.ts               # Express + Socket.IO entry point
│   └── tsconfig.json
```

---

## API Endpoints

### Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/profile` | Create or update user profile |
| `GET` | `/api/users/search?q=` | Search users by name/email |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user profile |

### Conversations
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/conversations` | Create conversation (private/group) |
| `GET` | `/api/conversations` | List user's conversations |
| `GET` | `/api/conversations/:id` | Get conversation details |
| `PUT` | `/api/conversations/:id` | Update conversation (rename, members) |
| `DELETE` | `/api/conversations/:id` | Delete conversation |

### Messages
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/messages` | Send a message |
| `GET` | `/api/messages/:conversationId` | Get messages (paginated) |
| `GET` | `/api/messages/search?q=` | Search messages |
| `DELETE` | `/api/messages/:id` | Delete a message |

### Socket.IO Events
| Event | Direction | Description |
|---|---|---|
| `message:send` | Client → Server | Send a message |
| `message:receive` | Server → Client | Receive a message |
| `conversation:join` | Client → Server | Join conversation room |
| `conversation:leave` | Client → Server | Leave conversation room |
| `typing:start` | Client → Server | User started typing |
| `typing:stop` | Client → Server | User stopped typing |
| `typing:update` | Server → Client | Typing status broadcast |
| `user:status` | Server → Client | Online/offline status update |

---

## Database Schema

### Users
| Field | Type | Description |
|---|---|---|
| `firebase_uid` | String | Firebase authentication UID |
| `display_name` | String | User's display name |
| `email` | String | Email address |
| `photo_url` | String | Profile photo URL |
| `status` | String | `online` or `offline` |
| `last_seen` | Date | Last activity timestamp |

### Conversations
| Field | Type | Description |
|---|---|---|
| `type` | String | `private` or `group` |
| `name` | String | Group name (groups only) |
| `members` | ObjectId[] | Array of user references |
| `admin_id` | ObjectId | Group admin (groups only) |
| `last_message` | Object | Preview of latest message |

### Messages
| Field | Type | Description |
|---|---|---|
| `conversation_id` | ObjectId | Parent conversation |
| `sender_id` | ObjectId | Message author |
| `content` | String | Message text |
| `message_type` | String | `text`, `image`, or `file` |
| `file_url` | String | Firebase Storage URL |
| `reply_to` | ObjectId | Referenced message (replies) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Auth enabled
- MongoDB Atlas cluster (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ChikkaChat-1.git
cd ChikkaChat-1

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/chikkachat
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@email.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_URL=http://localhost:5000
```

### Running Locally

```bash
# Terminal 1 — Start the server
cd server && npm run dev

# Terminal 2 — Start the client
cd client && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deployment

| Service | Platform | Plan |
|---|---|---|
| Frontend | Vercel | Free |
| Backend | Render | Free |
| Database | MongoDB Atlas | Free (M0) |
| Auth & Storage | Firebase | Free (Spark) |

---

## Architecture

```
┌──────────────────┐     WebSocket      ┌──────────────────┐
│                  │◄──────────────────►│                  │
│   React Client   │     REST API       │  Express Server  │
│   (Vercel)       │◄──────────────────►│  (Render)        │
│                  │                    │                  │
└────────┬─────────┘                    └────────┬─────────┘
         │                                       │
         │ Firebase Auth                         │ Mongoose
         │ Firebase Storage                      │
         ▼                                       ▼
┌──────────────────┐                    ┌──────────────────┐
│    Firebase      │                    │   MongoDB Atlas   │
│  (Auth + Storage)│                    │   (Database)      │
└──────────────────┘                    └──────────────────┘
```

---

## Author

**Vic Andrew A. Dizon**

Built as a fullstack real-time messaging platform demonstrating Socket.IO, Firebase Authentication, MongoDB, and React with TypeScript.
