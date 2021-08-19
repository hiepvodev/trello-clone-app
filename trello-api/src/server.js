import express from 'express'

const app = express()

const port = 8017
const hostName = 'localhost'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, hostName, () => {
  // eslint-disable-next-line no-console
  console.log(`Trello clone app listening at http://${hostName}:${port}`)
})