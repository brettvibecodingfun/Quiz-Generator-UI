# Quiz Generator Server

An Express server that generates trivia questions using OpenAI's GPT-4 API.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your API key from: https://platform.openai.com/api-keys

3. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Health check: http://localhost:3000/health

## API Endpoints

### POST /generate
Generates trivia questions based on user input.

**Request body:**
```json
{
  "count": "20",
  "difficulty": "hard",
  "category": "Sports",
  "subcategories": ["NBA", "NFL"]
}
```

**Response:**
```json
[
  {
    "question": "What year did Michael Jordan win his first NBA championship?",
    "answer": "1991"
  },
  {
    "question": "Which NFL team has won the most Super Bowls?",
    "answer": "New England Patriots"
  }
]
```

## Features

- ✅ Express server with CORS enabled
- ✅ OpenAI GPT-4 integration
- ✅ Static file serving for frontend
- ✅ Error handling and validation
- ✅ Environment variable configuration
- ✅ Health check endpoint 