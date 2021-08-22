const Joi = require('joi')
import { getDB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

//Define card collection
const cardCollectionName = 'cards'
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(),
  columnId: Joi.string().required(),
  title: Joi.string().required().min(3).max(20),
  cover: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, { abortEarly: false})
}

const createNew = async (data) => {
  try {
    const value = await validateSchema(data)
    const insertValue = {
      ...value,
      boardId: ObjectId(value.boardId),
      columnId: ObjectId(value.columnId)
    }
    const result = await getDB().collection(cardCollectionName).insertOne(insertValue)
    const lastResult = await getDB().collection(cardCollectionName).findOne({ _id: result.insertedId })
    return lastResult || {}
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    if (data.boardId) updateData.boardId = ObjectId(data.boardId)
    if (data.columnId) updateData.columnId = ObjectId(data.columnId)
    const result = await getDB().collection(cardCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnDocument : 'after' } //return new document
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

/**
 *
 * @param {Array of string card id} ids
 */
const deleteMany = async (ids) => {
  try {
    const transformIds = ids.map( i => ObjectId(i))
    const result = await getDB().collection(cardCollectionName).updateMany(
      { _id: { $in: transformIds } },
      { $set: { _destroy: true } }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const CardModel = {
  cardCollectionName,
  createNew,
  deleteMany,
  update
}