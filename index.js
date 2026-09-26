import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

function isPositive() {
  // Fake sentiment for demo purposes: random true/false.
  return Math.random() >= 0.5
}

app.use(express.json())

app.post("/api/sentiment", (req, res) => {
  const { tweet } = req.body

  

  setTimeout(() => {
    if (typeof tweet !== 'string' || tweet.trim() === '') {
      console.log("Tweet Required")
      return res.status(400).json({ error: 'tweet is required' })
    }
    if (Math.random() < 0.1) {
      console.log("Tweet Error")
      return res.status(500).json({ error: 'sentiment analysis failed' })
    }
    const sentiment=isPositive()
    console.log({"tweet":tweet,"sentiment":sentiment})
    res.json({
      tweet,
      sentiment: sentiment,
    })
  },5_000)
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
