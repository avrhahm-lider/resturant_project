import fs from 'fs/promises'

const FILE_PATH = './data/order.json'

export async function readOrder() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8')
        return JSON.parse(data)
    } catch (e) {
        throw { status: 500, message: 'File read error' }
    }
}

export async function writeOrder(data) {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
        throw { status: 500, message: 'File write error' }
    }
}
