import { ColumnModel } from '@/models/column'

const createNew = async (data) => {
  try {
    const result = await ColumnModel.createNew(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const BoardService = {
  createNew
}