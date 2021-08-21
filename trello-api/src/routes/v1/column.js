import express from 'express'
import { ColumnController } from '@/controllers/column'
import { ColumnValidation } from '@/validations/column'
const router = express.Router()

router.route('/')
  // .get((req, res) => console.log('Get boards'))
  .post(ColumnValidation.createNew, ColumnController.createNew)

router.route('/:id')
  // .get((req, res) => console.log('Get boards'))
  .put(ColumnValidation.update, ColumnController.update)

export const ColumnRoutes = router