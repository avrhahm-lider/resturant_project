import z from 'zod'
import { readOrder, writeOrder} from '../dal/order'
const Order = z.object({
    id : z.int(),
    usernae : z.string().min(1),
    table : z.int()


})
export async function creatOrder(body) {
    const secc = Order.safeParse(body)
    if(!secc.success)
        return {status : 400, data : {message: "invalid body"}}
    const data = await readOrder()
    body.status = "NEW"
    data.push(body)
    await writeOrder(data)
}

export async function getOrder(qp) {
    let data = await readOrder()
    if(Object.keys(qp).length === 0)
        return{status : 200, data : data}
    const {status, customer, table} = qp
    if (status)
        data = data.filter(val => val.status === status)
    if (customer)
        data = data.filter(val => val.customer === customer)
    if (table)
        data = data.filter(val => val.table === table)
    return {status : 200, data : data}
}

export async function getOrderByID(id){
    const data = await readOrder()
    return data.find(val => val.id === id)
}

const updateOrder = z.object({
    usernae : z.string().min(1),
    table : z.int(),
    status : z.enum(["NEW"])


})

export async function changeOrder(id, body) {
    const secc = updateOrder.safeParse(body)
    if(!secc.success)
        return {status : 400, data : {message: "invalid body"}}
    const data = await readOrder()
    body.id = id
    const index = data.findIndex(val => val.id === id)
    data.splice(index, 1, body)
    await writeOrder(data)
}

const changeStatus = {
"NEW" : "PREPARINGCANCELLED",
"PREPARING": "READCANCELLED",
"READY": "DELIVERED"


}