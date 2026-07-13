import express from 'express'
import { Logger, chackId } from './utils/middleware'

const app = express()

app.use(express.json(), Logger)
app.use("/orders/:id", chackId )
app.use("/orders",  )