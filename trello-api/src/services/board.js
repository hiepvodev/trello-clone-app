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
    //Add card to each column
    board.columns.forEach(column => {
      column.cards = board.cards.filter(c => c.columnId.toString() === column._id.toString() )
    })
    //sort column by collumn order or sort cards by  cardOrder - reactjs handle
    //delete cards array
    delete board.cards
    console.log(board)
    return board
  } catch (error) {
    throw new Error(error)
  }
}

export const BoardService = {
  createNew,
  getFullBoard
}