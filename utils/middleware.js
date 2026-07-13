import { readOrder } from "../dal/order";

export function Logger(req, res, next){
    console.log(req.method, req.url, new Date.now());
    next()
}

export async function chackId(req, res, next){
    const {id} = req.parms
    if (!id)
       return next(new  SyntaxError("invalid parm"))
    const data = await readOrder(next)
    const order = data.find(val => val.id === id)
    if (!order)
        return next(new  TypeError("ID not found"))
    next()
    
}

