
const express = require('express')
const morgan = require('morgan')
const usersRouter = require('./routes/users.routes')
const postsRouter = require('./routes/posts.routes')
const commentsRouter = require('./routes/comments.routes')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/posts', postsRouter)
app.use('/api/v1/comments', commentsRouter)

app.get('/', (req, res) => {
    res.send('Hello World')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

