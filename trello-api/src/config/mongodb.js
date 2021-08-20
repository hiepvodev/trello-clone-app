const { MongoClient } = require('mongodb')
import { env } from '@/config/environment'

const url = env.MONGODB_URL

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export const connectDB = async () => {
  try {
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')

    //list database
    await listDatabases()

    //

  } catch (error) {
    console.log(error)
  } finally {
    //Ensure that the client will close when finish/error
    await client.close()
  }
}

const listDatabases = async () => {
  const databasesList = await client.db().admin().listDatabases()
  databasesList.databases.forEach( db => console.log(`Database - ${db.name}`))
}