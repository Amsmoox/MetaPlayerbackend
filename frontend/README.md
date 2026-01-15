# MetaPlayer Backend Frontend

React frontend application for MetaPlayer backend admin panel.

## Tech Stack

- **React** 19.2.0
- **Vite** 7.2.4
- **Tailwind CSS** 3.4.1 (stable version)
- **PostCSS** 8.4.35
- **Autoprefixer** 10.4.17

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind CSS imports
├── public/              # Static assets
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vite.config.js       # Vite configuration
```

## Tailwind CSS

Tailwind CSS is configured and ready to use. All utility classes are available.

Example:
```jsx
<div className="bg-gray-900 text-white p-4">
  Content here
</div>
```

## API Integration

To connect with the Django backend API, update the API base URL in your components or create an API service file.

Default backend URL: `http://localhost:8000/api/`
