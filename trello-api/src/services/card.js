import { cardModel } from '@/models/card'

const createNew = async (data) => {
  try {
    const result = await cardModel.createNew(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    const result = await cardModel.update(id, updateData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardService = {
  createNew,
  update
}