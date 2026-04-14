# AttendX (QR Event Attendance)

AttendX is a dark-themed QR attendance dashboard built with React + Vite. It includes admin pages for events, attendance, and QR generation, plus a public student scan page.

## Tech Stack
- React + Vite
- React Router DOM
- Axios
- Tailwind CSS
- Framer Motion
- qrcode.react
- html5-qrcode

## Getting Started
1. Install dependencies:
   npm install
2. Configure the environment file:
   - Update `VITE_API_URL` in `.env` to your API base URL.
3. Run the dev server:
   npm run dev

## Backend (Node + MongoDB)
1. Install server dependencies:
   cd server
   npm install
2. Configure server environment:
   - Update `server/.env` with your MongoDB URI and `JWT_SECRET`.
3. Start the API server:
   npm run dev

## Build
- npm run build
- npm run preview

## Notes
- Admin auth uses `localStorage` key `attendx_token`.
- API base URL is read from `VITE_API_URL`.
