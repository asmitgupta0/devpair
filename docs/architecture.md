# DevPair Architecture

Browser A ─┐
├── Socket.io + HTTP ── Express backend ── MongoDB
Browser B ─┘ │
├── Judge0
└── Groq

## Deployment

- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

## Security rule

External API keys, database credentials, and authentication secrets stay only on the backend.
