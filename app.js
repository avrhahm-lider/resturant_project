import express from 'express'
import { Logger, checkId, errorHandler, routeNotFound } from './utils/middleware.js'
import orderRouter from './routers/order.js'

const app = express()

app.use(express.json(), Logger)
app.use('/orders/:id', checkId)
app.use('/orders', orderRouter)

app.use(routeNotFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

export default app
