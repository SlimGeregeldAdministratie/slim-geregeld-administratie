# Slim Geregeld Administratie

A modern administrative and tax management platform built with React, TypeScript, and Supabase.

## Features

- Tax form generation and management (2024)
- Company administration tools for multiple business types
- Free tools and calculators
- Real-time data synchronization
- Responsive design for all devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/slim-geregeld-administratie.git
cd slim-geregeld-administratie
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Supabase credentials
```

4. Get your Supabase credentials:
   - Visit [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings > API
   - Copy `Project URL` and `anon key`
   - Paste them in your `.env` file

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Create a production build:
```bash
npm run build
```

The optimized build output will be in the `dist` directory.

### Linting

Check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/        # React components
├── main.tsx          # Application entry point
├── App.tsx           # Root component
└── index.css         # Global styles

public/              # Static assets
supabase/           # Supabase edge functions
```

## Environment Variables

The following environment variables are required:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

See `.env.example` for a template.

## Security Notes

- Never commit your `.env` file to version control
- Keep your Supabase credentials private
- Only share the `.env.example` file (with placeholder values) in the repository

## Contributing

Feel free to submit issues and pull requests to improve the project.

## License

This project is proprietary and confidential.
