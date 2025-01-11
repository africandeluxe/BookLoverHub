📚 Book Lovers Hub
Book Lovers Hub is a full-stack web application where users can share their thoughts on books and engage with a community of book enthusiasts. It includes features such as user authentication, CRUD operations for posts, and a comments system. The application is built with modern web technologies and emphasizes responsive design.

🚀 Features
User Authentication:
Powered by Supabase Auth, allowing users to register, log in, and log out securely.

Posts Management:
Authenticated users can create, update, and delete their own posts. Each post has a title, content, and is associated with the user who created it.

Comments System:
Users can leave comments on posts. Authors can delete comments on their own posts, and authenticated users can delete their own comments.

Responsive Design:
Built with Tailwind CSS to ensure a seamless experience on all devices.

Data Integrity:
Relational data model linking users, posts, and comments with proper authorization policies.

🛠️ Tech Stack
Frontend: Next.js with App Router, React, and Tailwind CSS for styling.
Backend: Supabase for database (PostgreSQL), authentication, and API handling.
State Management: React Hooks and Context API.
✨ Highlights
Authentication & Authorization:

Integrated using Supabase, ensuring secure handling of user data and role-based permissions.
CRUD Functionality:

Fully implemented create, read, update, and delete features for posts and comments.
Responsive UI:

A modern, clean, and responsive user interface designed for book lovers.
Optimized Data Fetching:

Leveraged Supabase's client libraries for real-time and optimized database interactions.
📦 Installation
To run this project locally:

Clone the repository:

bash
Kopiera kod
git clone https://github.com/your-username/book-lovers-hub.git
cd book-lovers-hub
Install dependencies:

bash
Kopiera kod
npm install
Create a .env.local file and add your Supabase credentials:

env
Kopiera kod
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
Run the development server:

bash
Kopiera kod
npm run dev
Open http://localhost:3000 in your browser.

