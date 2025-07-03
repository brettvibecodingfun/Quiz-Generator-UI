const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Quiz generation endpoint
app.post("/generate", async (req, res) => {
  try {
    const { count, difficulty, category, subcategories } = req.body;

    // Validate required fields
    if (!count || !difficulty || !category || !subcategories || !Array.isArray(subcategories)) {
      return res.status(400).json({ 
        error: 'Missing required fields: count, difficulty, category, subcategories' 
      });
    }

    const prompt = `Create ${count} ${difficulty} ${category.toLowerCase()} trivia questions about ${subcategories.join(", ")}. 
Format as a JSON array of objects like [{ "question": "...", "answer": "..." }]`;

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    console.log('OpenAI response:', content);

    // Parse the JSON response from OpenAI
    const questions = JSON.parse(content);

    // Increment counter.json
    const counterPath = path.join(__dirname, 'counter.json');
    let counter = { count: 0 };
    try {
      if (fs.existsSync(counterPath)) {
        const data = fs.readFileSync(counterPath, 'utf8');
        counter = JSON.parse(data);
      }
      counter.count += 1;
      fs.writeFileSync(counterPath, JSON.stringify(counter, null, 2));
    } catch (err) {
      console.error('Error updating counter.json:', err);
      // Optionally, you can continue even if the counter fails
    }

    res.json(questions);

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz generator server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Quiz generator server running on http://localhost:${port}`);
  console.log('Make sure to set your OPENAI_API_KEY in the .env file');
}); 