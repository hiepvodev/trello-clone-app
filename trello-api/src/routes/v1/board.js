import express from 'express'
import { BoardController } from '@/controllers/board'
import { BoardValidation } from '@/validations/board'
const router = express.Router()

router.route('/')
  // .get((req, res) => console.log('Get boards'))
  .post(BoardValidation.createNew, BoardController.createNew)

router.route('/:id')
  .get(BoardController.getFullBoard)
  .put(BoardValidation.update, BoardController.update)

export const BoardRoutes = router