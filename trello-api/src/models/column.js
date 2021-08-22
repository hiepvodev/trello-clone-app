const Joi = require('joi')
import { getDB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

//Define column collection
const columnCollectionName = 'columns'
const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().required().min(3).max(20).trim(),
  cardOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  return await columnCollectionSchema.validateAsync(data, { abortEarly: false})
}

const createNew = async (data) => {
  try {
    const value = await validateSchema(data)
    const insertValue = {
      ...value,
      boardId: ObjectId(value.boardId)
    }
    const result = await getDB().collection(columnCollectionName).insertOne(insertValue)
    const lastResult = await getDB().collection(columnCollectionName).findOne({ _id: result.insertedId })
    return lastResult || {}
  } catch (error) {
    throw new Error(error)
  }
}

/**
 *
 * @param {string} boardId
 * @param {string} columnId
 */
 const pushCardOrder = async (columnId, cardId) => {
  try {
    const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
      { _id: ObjectId(columnId) },
      { $push: { cardOrder: cardId } },
      { returnNewDocument : true }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    if (data.boardId) updateData.boardId = ObjectId(data.boardId)
    const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnDocument : 'after' } //return new document
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const ColumnModel = {
  columnCollectionName,
  createNew,
  update,
  pushCardOrder
}