import 'dotenv/config'
import express from 'express'
import OpenAI from 'openai'

const app = express()
const PORT = process.env.PORT || 3001

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function analyzeSentiment(tweet) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          'You classify the sentiment of tweets. Reply with exactly one word: "positive", "negative", or "neutral". No punctuation, no explanation.',
      },
      { role: 'user', content: tweet },
    ],
  })

  const label = response.choices[0].message.content.trim().toLowerCase()
  if (!['positive', 'negative', 'neutral'].includes(label)) {
    throw new Error(`Unexpected sentiment label from model: "${label}"`)
  }
  return label
}

app.use(express.json())

app.post('/api/sentiment', async (req, res) => {
  const { tweet } = req.body

  if (typeof tweet !== 'string' || tweet.trim() === '') {
    return res.status(400).json({ error: 'tweet is required' })
  }

  try {
    const sentiment = await analyzeSentiment(tweet)
    console.log({ tweet, sentiment })
    res.json({ tweet, sentiment })
  } catch (err) {
    console.error('Error analyzing sentiment:', err.message)
    res.status(500).json({ error: 'sentiment analysis failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
