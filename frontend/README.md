# LifeHub Frontend

React frontend application for the LifeHub lifestyle management platform.

## Tech Stack

- **React 19**
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── context/        # React context providers
│   ├── services/       # API service layer
│   ├── routes/         # Routing configuration
│   └── assets/         # Images and static assets
├── public/              # Public static files
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # This file
```

## Backend Connection

The frontend connects to the backend API at `http://localhost:8080`.

Make sure the backend is running before starting the frontend.

For backend setup, see `../backend/README.md` or `../docs/essential/RUN_BACKEND.md`.

## Environment Variables (Optional)

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## License

MIT

