import express from 'express'
import { mapOrder } from '@/utilities/sorts'

const app = express()

const port = 3000
const hostName = 'localhost'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, hostName, () => {
  // eslint-disable-next-line no-console
  console.log(`Trello clone app listening at http://${hostName}:${port}`)
})