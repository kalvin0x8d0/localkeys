# LocalKeys

A modern, zero-knowledge cryptographic application built with React, FastAPI, and MongoDB. LocalKeys provides secure, client-side key management and cryptographic operations with a sleek brutalist UI.

## Features

- **Zero-Knowledge Architecture**: All cryptographic operations happen client-side. The server never sees sensitive data.
- **Modern Tech Stack**: React 19 with Tailwind CSS, FastAPI backend, MongoDB persistence
- **Comprehensive Crypto Support**: Ed25519, Argon2id, Nostr, JWT, and more
- **Docker Support**: Easy deployment with Docker Compose
- **High Contrast UI**: Brutalist design with Swiss typography and high contrast colors
- **TypeScript Ready**: Strong type safety across the frontend

## Quick Start

### Prerequisites

- Docker and Docker Compose (recommended)
- Or: Node.js 20+, Python 3.11+, MongoDB 7.0+

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd localkeys
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp ../.env.example .env
   # Edit .env with your MongoDB connection string
   ```

5. **Run the server**
   ```bash
   uvicorn server:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn start
   ```

## Project Structure

```
localkeys/
├── backend/                 # FastAPI backend server
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Docker configuration for backend
│   └── .env               # Environment variables (create from .env.example)
├── frontend/               # React frontend application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   ├── Dockerfile         # Docker configuration for frontend
│   └── tailwind.config.js # Tailwind CSS configuration
├── docker-compose.yaml     # Multi-container Docker setup
├── .env.example           # Example environment variables
└── design_guidelines.json # UI/UX design specifications
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=localkeys

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Server Configuration
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO
```

**Important**: Never commit `.env` files with sensitive information. Use `.env.example` as a template.

## API Endpoints

### Health Check
- `GET /api/` - Returns hello message

### Status Checks
- `GET /api/status` - Retrieve all status checks
- `POST /api/status` - Create a new status check

### Interactive Documentation
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

## Development

### Code Quality Tools

The backend includes:
- **Black**: Code formatting
- **isort**: Import sorting
- **Flake8**: Linting
- **mypy**: Type checking
- **pytest**: Testing

Format and check code:
```bash
cd backend
black .
isort .
flake8 .
mypy .
pytest
```

### Frontend Development

- **React 19** with modern hooks
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **React Router** for navigation
- **Axios** for HTTP requests
- **Zod** for schema validation

## Security Considerations

- **Zero-Knowledge**: Cryptographic operations never leave the client
- **CORS**: Configured to only allow specified origins
- **Environment Variables**: Sensitive data in `.env` (git-ignored)
- **Input Validation**: Pydantic models validate all requests
- **Error Handling**: Proper error responses without exposing internals

## Docker Deployment

### Build Images
```bash
docker-compose build
```

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Clean Up
```bash
docker-compose down -v  # Also remove volumes
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (or use Docker: `docker-compose up mongodb`)
- Check `MONGO_URL` in `.env`
- Verify credentials if using authentication

### Frontend Can't Connect to Backend
- Check `CORS_ORIGINS` includes your frontend URL
- Ensure backend is running on the configured port
- Check browser console for CORS errors

### Port Already in Use
- Change ports in `docker-compose.yaml` or `.env`
- Or stop conflicting services: `docker-compose down`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Design System

See `design_guidelines.json` for detailed design specifications including:
- Color palette (dark theme with high contrast)
- Typography (Outfit, JetBrains Mono)
- Component styles (brutalist, square edges)
- Layout strategy (Control Room Grid)
- Accessibility guidelines

## License

This project is licensed under the CC0 1.0 Universal (CC0) license. See the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

Built with ❤️ for security-conscious developers.
