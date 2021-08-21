import express from 'express'
import { CardController } from '@/controllers/card'
import { CardValidation } from '@/validations/card'
const router = express.Router()

router.route('/')
  // .get((req, res) => console.log('Get boards'))
  .post(CardController.createNew, CardValidation.createNew)


export const CardRoutes = router