import express from 'express'
import { HttpStatusCode } from '@/utilities/constants'
import { BoardRoutes } from './board'
import { ColumnRoutes } from './column'
import { CardRoutes } from './card'

const router = express.Router()
/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/** Board APIs */
router.use('/boards', BoardRoutes)

/** Column APIs */
router.use('/columns', ColumnRoutes)

/** Card APIs */
router.use('/cards', CardRoutes)

export const apiV1 = router