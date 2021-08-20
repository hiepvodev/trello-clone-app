import express from 'express'
import { connectDB } from '@/config/mongodb'
import { env } from '@/config/environment'


const port = env.APP_PORT
const hostName = env.APP_HOST

//connect DB
connectDB()
  .then(() => console.log('Connected succesfully to database server!'))
  .then(() => bootServer())
  .catch(err => {
    console.log(err)
    process.exit()
  })


const bootServer = () => {
  const app = express()

  app.get('/', async (req, res) => {
    res.send('Hello World!')
  })

  //
  app.listen(port, hostName, () => {
    console.log(`Trello clone app listening at http://${hostName}:${port}`)
  })
}