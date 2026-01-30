# User Web Application

Next.js web application for customers to book barbers and use AI-powered features.

## Features

- User authentication (register/login)
- Browse and search barbers
- Book appointments
- AI hairstyle recommendations
- AR style preview (Try Before You Cut)
- Chat with barbers
- Loyalty system
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios (API Client)
- React Hook Form
- Socket.IO Client
