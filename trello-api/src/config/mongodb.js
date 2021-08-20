const { MongoClient } = require('mongodb')
import { env } from '@/config/environment'

let dbInstance = null

export const connectDB = async () => {

  const client = new MongoClient(env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  // Use connect method to connect to the server
  await client.connect()

  //Assign clientDB to dbInstace
  dbInstance = client.db(env.DATABASE_NAME)
}

export const getDB = () => {
  if (!dbInstance) throw new Error('Must connect to Database first!')
  return dbInstance
}

// const listDatabases = async (client) => {
//   const databasesList = await client.db().admin().listDatabases()
//   databasesList.databases.forEach( db => console.log(`Database - ${db.name}`))
// }