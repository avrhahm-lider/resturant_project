import express from 'express'
import * as service from '../service/order.js'
import { validateOrder } from '../utils/middleware.js'

const router = express.Router()

router.post('/', validateOrder, async (req, res, next) => {
    try {
        const result = await service.createOrder(req.body)
        res.status(result.status).json(result.data)
    } catch (e) {
        next(e)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const result = await service.getOrder(req.query)
        res.status(result.status).json(result.data)
    } catch (e) {
        next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const result = await service.getOrderByID(Number(req.params.id))
        res.status(result.status).json(result.data)
    } catch (e) {
        next(e)
    }
})

router.put('/:id', validateOrder, async (req, res, next) => {
    try {
        const result = await service.updateOrder(Number(req.params.id), req.body)
        res.status(result.status).json(result.data)
    } catch (e) {
        next(e)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const result = await service.deleteOrder(Number(req.params.id))
        res.status(result.status).json(result.data)
    } catch (e) {
        next(e)
    }
})

router.patch('/:id/status', async (req, res, next) => {
    try {
        const result = await service.changeStatus(Number(req.params.id), req.body)
        res.status(result.status).json(result.data)
    } catch (e) {
        next(e)
    }
})

export default router
