import fs from 'fs/promises'
import { json } from 'stream/consumers'
export async function readOrder() {
        const data = await fs.readFile("./data/order.json", "utf-8")
        return JSON.parse(data)   
}

export async function writeOrder(data) {
        await fs.writeFile("./data/order.json",JSON.stringify(data), "utf-8")  
}