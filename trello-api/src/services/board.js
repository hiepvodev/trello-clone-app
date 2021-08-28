import { BoardModel } from '@/models/board'

const createNew = async (data) => {
  try {
    const result = await BoardModel.createNew(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getFullBoard = async (id) => {
  try {
    const board = await BoardModel.getFullBoard(id)
    if (!board || !board.columns) {
      throw new Error('Board not found!')
    }
    //Add card to each column
    board.columns.forEach(column => {
      column.cards = board.cards.filter(c => c.columnId.toString() === column._id.toString() )
    })
    //sort column by collumn order or sort cards by  cardOrder - reactjs handle
    //delete cards array
    delete board.cards
    return board
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
    if (updateData.columns) delete updateData.columns
    const updatedColumn = await BoardModel.update(id, updateData)
    console.log(updatedColumn);
    return updatedColumn
  } catch (error) {
    throw new Error(error)
  }
}

export const BoardService = {
  createNew,
  getFullBoard,
  update
}