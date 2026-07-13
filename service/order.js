import { z } from 'zod'
import { readOrder, writeOrder } from '../dal/order.js'

const Order = z.object({
    username: z.string().min(1),
    table: z.number().int(),
})

export async function createOrder(body) {
    const parsed = Order.safeParse(body)
    if (!parsed.success)
        return { status: 400, data: { message: 'invalid body' } }

    const data = await readOrder()
    data.sort((a, b) => a.id - b.i
    d)
    const lastOrder = data[data.length - 1]
    body.id = lastOrder ? lastOrder.id + 1 : 1
    body.status = 'NEW'
    data.push(body)
    await writeOrder(data)
    return { status: 201, data: body }
}

export async function getOrder(qp) {
    let data = await readOrder()
    if (Object.keys(qp).length === 0)
        return { status: 200, data }

    const { status, customer, table } = qp
    if (status)
        data = data.filter(val => val.status === status)
    if (customer)
        data = data.filter(val => val.username === customer)
    if (table)
        data = data.filter(val => val.table === Number(table))
    return { status: 200, data }
}

export async function getOrderByID(id) {
    const data = await readOrder()
    const order = data.find(val => val.id === id)
    if (!order)
        return { status: 404, data: { message: 'order not found' } }
    return { status: 200, data: order }
}

const UpdateOrder = z.object({
    username: z.string().min(1),
    table: z.number().int(),
    status: z.enum(['NEW', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']),
})

export async function updateOrder(id, body) {
    const parsed = UpdateOrder.safeParse(body)
    if (!parsed.success)
        return { status: 400, data: { message: 'invalid body' } }

    const data = await readOrder()
    const index = data.findIndex(val => val.id === id)
    if (index === -1)
        return { status: 404, data: { message: 'order not found' } }

    body.id = id
    data.splice(index, 1, body)
    await writeOrder(data)
    return { status: 200, data: body }
}

export async function deleteOrder(id) {
    const data = await readOrder()
    const index = data.findIndex(val => val.id === id)
    if (index === -1)
        return { status: 404, data: { message: 'order not found' } }

    const [deleted] = data.splice(index, 1)
    await writeOrder(data)
    return { status: 200, data: deleted }
}

const VALID_STATUSES = ['NEW', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']

const allowedTransitions = {
    NEW: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['DELIVERED'],
}

export async function changeStatus(id, body) {
    const { status } = body
    if (!status)
        return { status: 400, data: { message: 'missing required fields' } }
    if (!VALID_STATUSES.includes(status))
        return { status: 400, data: { message: 'invalid status' } }

    const data = await readOrder()
    const index = data.findIndex(val => val.id === id)
    if (index === -1)
        return { status: 404, data: { message: 'order not found' } }

    const currentStatus = data[index].status
    const nextStatuses = allowedTransitions[currentStatus] || []
    if (!nextStatuses.includes(status))
        return { status: 400, data: { message: `invalid status transition from ${currentStatus} to ${status}` } }

    data[index].status = status
    await writeOrder(data)
    return { status: 200, data: data[index] }
}
