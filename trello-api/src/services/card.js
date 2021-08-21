import { cardModel } from '@/models/card'
import { ColumnModel } from '@/models/column'

const createNew = async (data) => {
  try {
    const newCard = await cardModel.createNew(data)
    //update columnOrder array in board collection
    await ColumnModel.pushCardOrder(newCard.columnId.toString(), newCard._id.toString())
    return newCard
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

export const CardService = {
  createNew,
  update
}