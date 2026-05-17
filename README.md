---
title: LeTraducteur
emoji: 🌐
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# LeTraducteur 🌐

## Translate & Learn — 🇫🇷 French | 🇩🇪 German | 🇪🇸 Spanish | 🇮🇹 Italian

A full-stack language learning application that combines translation, phrase learning, and AI-powered conversation practice. Built with React, Flask, and OpenAI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

### 🔄 Translate
Instant English to French, German, Spanish, or Italian translation using Helsinki-NLP's Opus-MT models running locally.

### 📖 Learn
Key phrases for real-world scenarios — greetings, restaurant, directions, shopping, hotel, and emergencies. Each phrase includes:
- Native pronunciation via OpenAI TTS
- Hidden English translations (reveal on click)
- Quiz mode with scoring

### 💬 Practice
AI conversation practice powered by GPT-4o-mini:
- 5 scenarios (Restaurant, Directions, Job Interview, Shopping, Hotel)
- 3 difficulty levels (Beginner, Intermediate, Advanced)
- Grammar corrections with explanations
- Quality feedback on naturalness and fluency
- English translation toggle on each message
- Speech-to-text microphone input
- Natural TTS pronunciation via OpenAI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Flask, Gunicorn |
| Translation | Helsinki-NLP/opus-mt (local models) |
| Conversation | OpenAI GPT-4o-mini |
| Pronunciation | OpenAI TTS (tts-1) |
| Deployment | Docker, Hugging Face Spaces |

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- An OpenAI API key (for Practice and TTS features)

### Setup

```bash
git clone https://github.com/AlanaBF/LLM
cd LLM
```

**Backend:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```
OPENAI_API_KEY=sk-your-key-here
```

**Frontend:**

```bash
cd frontend/LeTraducteur
npm install
```

### Running Locally

Start both servers:

```bash
# Terminal 1: Backend (port 7860)
cd backend && source venv/bin/activate && python app.py

# Terminal 2: Frontend (port 5173)
cd frontend/LeTraducteur && npx vite
```

Open http://localhost:5173

### Docker

```bash
docker build -t letraducteur .
docker run -e OPENAI_API_KEY=sk-your-key -p 7860:7860 letraducteur
```

## Deployment

Deployed on [Hugging Face Spaces](https://huggingface.co/spaces/AlanaBF/LeTraducteur) using Docker.

To deploy your own:
1. Create a Docker Space on Hugging Face
2. Add `OPENAI_API_KEY` as a Space secret
3. Push the code — it builds automatically

## Architecture

```
frontend/LeTraducteur/src/
├── constants.ts          # Shared language config
├── App.tsx               # Router (Translate | Learn | Practice)
└── components/
    ├── Navbar.tsx         # Navigation with active tab indicators
    ├── Chatbot.tsx        # Translation interface
    ├── Learn.tsx          # Phrase learning + quiz mode
    ├── Practice.tsx       # AI conversation practice
    └── Footer.tsx         # Links and credits

backend/
├── app.py                # Flask API (translation, conversation, TTS)
└── requirements.txt      # Python dependencies
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chatbot` | POST | Translate English text to target language |
| `/conversation` | POST | AI conversation with corrections and feedback |
| `/speak` | POST | Text-to-speech audio generation |

## License

MIT — see [LICENSE](LICENSE) for details.

## Author

**Alana Barrett-Frew**
- Website: [alanabarrettfrew.com](https://www.alanabarrettfrew.com)
- GitHub: [AlanaBF](https://github.com/AlanaBF)
