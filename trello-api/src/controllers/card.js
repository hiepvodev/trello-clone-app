import { cardService } from '@/services/card'
import { HttpStatusCode } from '@/utilities/constants'

const createNew = async (req, res) => {
  try {
    const result = await cardService.createNew(req.body)
    console.log(result)
    res.status(HttpStatusCode.OK).json({ result })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const result = await cardService.update(id, req.body)
    res.status(HttpStatusCode.OK).json({ result })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const CardController = {
  createNew,
  update
}