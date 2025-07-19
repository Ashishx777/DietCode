require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5000', // Change in production
    'X-Title': 'DietCode',
  },
});

app.post('/rate-product', async (req, res) => {
  const { ingredients, productName } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: 'No ingredients provided' });
  }

  const prompt = `Rate the healthiness of this food product on a scale of 1 to 100 (where 100 is the healthiest) based on its ingredients.
Respond strictly in JSON format: { "score": number, "reason": string }.
Product: ${productName || 'Unnamed'}
Ingredients: ${ingredients}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.2-24b-instruct:free', // fallback model possible
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    // Handle possible response formats
    const content =
      response.choices?.[0]?.message?.content || response.choices?.[0]?.text;

    if (!content) {
      console.error('Empty AI response:', response);
      throw new Error('No content returned from AI');
    }

    // Strip code block formatting
    const cleaned = content.replace(/```json|```/g, '').trim();

    let result;
    try {
      result = JSON.parse(cleaned);
      // eslint-disable-next-line no-unused-vars
    } catch (parseErr) {
      console.error('JSON parse failed:', cleaned);
      return res.status(500).json({ error: 'AI response is not valid JSON' });
    }

    res.json(result);
  } catch (error) {
    console.error('AI error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate AI rating' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
