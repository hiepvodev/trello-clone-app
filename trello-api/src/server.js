import express from 'express'
import { connectDB } from '@/config/mongodb'
import { env } from '@/config/environment'

const app = express()

const port = env.PORT
const hostName = env.HOST

//connect DB
connectDB()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, hostName, () => {
  console.log(`Trello clone app listening at http://${hostName}:${port}`)
})