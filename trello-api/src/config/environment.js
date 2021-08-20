require('dotenv').config()

export const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  HOST: process.env.HOST,
  PORT: process.env.PORT
}