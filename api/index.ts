import process from 'node:process'
import { serve } from '@hono/node-server'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { logger as rslog } from 'rslog'
import { PrismaClient } from './generated/client/index.js'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  rslog.info('main')
  // ... you will write your Prisma ORM queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

const app = new Hono()

app.use(logger((log) => {
  rslog.info(log)
}))

app.get('/', (c) => {
  c.res.headers.set('Content-Type', 'text/plain')
  return c.text('Hello!')
})

app.get('/todos', async (c) => {
  const todos = await prisma.todo.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return c.json(todos)
})

app.post('/todo', async (c) => {
  const { content } = await c.req.json()
  const todo = await prisma.todo.create({
    data: {
      content,
    },
  })

  return c.json(todo)
})

app.put('/todo/:id', async (c) => {
  const { id } = c.req.param()
  const { content, isDone } = await c.req.json()
  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: { content, isDone, updatedAt: new Date() },
  })

  return c.json(todo)
})

app.delete('/todo/:id', async (c) => {
  const { id } = c.req.param()
  await prisma.todo.delete({
    where: {
      id: Number(id),
    },
  })

  return c.json({ success: true })
})

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  rslog.success(`Server is running on http://localhost:${info.port}`)
})
