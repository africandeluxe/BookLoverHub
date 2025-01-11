# Book Lovers Hub
<br/>Book Lovers Hub is a full-stack web application where users can share their thoughts on books and engage with a community of book enthusiasts. It includes features such as user authentication, CRUD operations for posts, and a comments system. The application is built with modern web technologies and emphasizes responsive design.

## Features
**User Authentication:**
Powered by Supabase Auth, allowing users to register, log in, and log out securely.

**Posts Management:**
Authenticated users can create, update, and delete their own posts. Each post has a title, content, and is associated with the user who created it.

**Comments System:**
Users can leave comments on posts. Authors can delete comments on their own posts, and authenticated users can delete their own comments.

**Responsive Design:**
Built with Tailwind CSS to ensure a seamless experience on all devices.

**Data Integrity:**
Relational data model linking users, posts, and comments with proper authorization policies.

## Tech Stack
**Frontend:** _Next.js with App Router, React, and Tailwind CSS for styling._ <br/>
**Backend:** _Supabase for database (PostgreSQL), authentication, and API handling._<br/>
**State Management:** _React Hooks and Context API._

### Highlights
**Authentication & Authorization:**
_Integrated using Supabase, ensuring secure handling of user data and role-based permissions._

**CRUD Functionality:**
_Fully implemented create, read, update, and delete features for posts and comments._

**Responsive UI:**
_A modern, clean, and responsive user interface designed for book lovers._

**Optimized Data Fetching:**
_Leveraged Supabase's client libraries for real-time and optimized database interactions._

## Installation
**To run this project locally:**

**Clone the repository:**
```
git clone https://github.com/your-username/book-lovers-hub.git
cd book-lovers-hub
```

**Install dependencies:**
```
npm install
```
**Create a .env.local file and add your Supabase credentials:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Run the development server:**
```
npm run dev
```
