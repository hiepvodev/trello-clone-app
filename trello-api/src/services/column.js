import { ColumnModel } from '@/models/column'
import { BoardModel } from '@/models/board'
import { CardModel } from '@/models/card'

const createNew = async (data) => {
  try {
    const newColumn = await ColumnModel.createNew(data)
    newColumn.cards = []
    //update columnOrder array in board collection
    await BoardModel.pushColumnOrder(newColumn.boardId.toString(), newColumn._id.toString())
    return newColumn
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
    if (updateData._id) delete updateData._id
    if (updateData.cards) delete updateData.cards
    const updatedColumn = await ColumnModel.update(id, updateData)
    // console.log(updatedColumn);
    if (updatedColumn._destroy) {
      //delete many cards
      CardModel.deleteMany(updatedColumn.cardOrder)
    }
    return updatedColumn
  } catch (error) {
    throw new Error(error)
  }
}

export const ColumnService = {
  createNew,
  update
}