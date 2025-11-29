# Singlish Chatbot Interface

A minimalist chat interface for a fine-tuned Singlish conversational AI. Built with React (Vite) frontend + FastAPI backend serving trained model with LoRA adapters.

## Tech Stack

**Frontend:** React 18+, Vite, Tailwind CSS, Axios
**Backend:** FastAPI, Uvicorn, Transformers, PEFT
**Runtime:** Python 3.10+, Node 18+

## Features

- 🇸🇬 **Authentic Singlish Responses** - Natural local-style conversations
- 💬 **Minimalist Design** - Clean, focused chat interface
- 📱 **Mobile-Responsive** - Works on all devices
- ⚡ **Fast Performance** - Optimized for quick responses
- 🔧 **Easy Setup** - Simple development workflow
- 🎨 **Beautiful UI** - Custom color scheme and typography

## Quick Start

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "NLP Project Interface"
   ```

2. **Backend Setup**
   ```bash
   cd Backend

   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend

   # Install dependencies
   npm install
   ```

4. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd Backend
   # Make sure virtual environment is activated
   uvicorn app.main:app --reload --port 8000
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Send message, receive response |
| `/api/health` | GET | Health check |

### POST `/api/chat`

**Request:**
```json
{
  "message": "Hello how are you?",
  "conversation_history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "response": "Wah hello bro! I'm doing great lah, you?",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Project Structure

```
NLP Project Interface/
├── Backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration settings
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic models
│   │   ├── routers/
│   │   │   └── chat.py          # API endpoints
│   │   └── services/
│   │       └── model.py         # Model service (placeholder)
│   ├── requirements.txt        # Python dependencies
│   └── .gitignore              # Python ignores
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── InputBar.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js       # Chat state management
│   │   ├── services/
│   │   │   └── api.js           # Backend communication
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── index.html              # HTML template
├── CLAUDE.md                   # Project documentation
├── README.md                   # This file
└── .gitignore                  # Project ignores
```

## Development

### Frontend Development

```bash
cd Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd Backend

# Run with auto-reload
uvicorn app.main:app --reload --port 8000

# Or run the Python file directly
python app/main.py
```

## UI Guidelines

- **Design Philosophy:** Minimalist, clean, ample whitespace
- **Max Width:** 800px centered container
- **Color Scheme:**
  - Background: `#FAFAFA`
  - User bubbles: `#3B82F6` (blue-500)
  - Bot bubbles: `#F3F4F6` (gray-100)
  - Text: `#111827` (gray-900)
- **Typography:** Sans-serif, 16px base
- **Responsive:** Mobile-first with breakpoints at 640px, 768px, 1024px

## Future Extensions

The architecture is designed to accommodate future enhancements:

- 🎥 **Avatar Integration** - TTS and lip sync video generation
- 🔄 **Streaming Responses** - Real-time message streaming
- 💾 **Database Persistence** - Conversation history storage
- 🔐 **Authentication System** - User management
- 🎭 **Multiple Personas** - Different chatbot personalities
- 🌐 **Multi-language Support** - Beyond Singlish

## Contributing

1. Follow the existing code style and conventions
2. Use functional components with hooks (React)
3. Implement proper error handling
4. Add appropriate types and validation
5. Test thoroughly before submitting

## Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure Python 3.10+ is installed
- Check if virtual environment is activated
- Verify all requirements are installed

**Frontend won't start:**
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is available

**CORS errors:**
- Ensure backend is running on port 8000
- Check CORS configuration in `Backend/app/main.py`
- Verify Vite proxy configuration in `Frontend/vite.config.js`

**API connection issues:**
- Check backend health: http://localhost:8000/api/health
- Verify API endpoints in browser
- Check browser console for network errors

## License

This project is part of academic coursework and research purposes.

## Acknowledgments

Built as part of NLP coursework at Singapore University of Technology and Design (SUTD).