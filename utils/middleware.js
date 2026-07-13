import { z } from 'zod'
import { readOrder } from '../dal/order.js'

export function Logger(req, res, next) {
    console.log(req.method, req.url, new Date().toISOString())
    next()
}

export async function checkId(req, res, next) {
    const { id } = req.params
    const orderId = Number(id)
    if (!id || isNaN(orderId))
        return next({ status: 400, message: 'Invalid ID' })

    try {
        const data = await readOrder()
        const order = data.find(val => val.id === orderId)
        if (!order)
            return next({ status: 404, message: 'Order not found' })
        next()
    } catch (e) {
        next(e)
    }
}

const orderSchema = z.object({
    username: z.string().min(1),
    table: z.number().int(),
})

export function validateOrder(req, res, next) {
    const result = orderSchema.safeParse(req.body)
    if (!result.success)
        return next({ status: 400, message: 'Missing required fields' })
    next()
}

export function routeNotFound(req, res, next) {
    res.status(404).json({ error: 'Route not found' })
}

export function errorHandler(err, req, res, next) {
    console.error(err)
    const status = err.status || 500
    const message = err.message || 'Internal server error'
    res.status(status).json({ error: message })
}
