import { Hono } from 'hono'
import { logger } from 'hono/logger'
import supabase from './db'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.use(logger())

app.get('/', c => {
  return c.text('Hello Hono!')
})

app.get('/todos', async c => {
  const { data, error } = await supabase.from('todo').select()

  if (error) {
    throw new HTTPException(500, error)
  }

  return c.json(data)
})

app.post('/todo', async c => {
  const { content } = await c.req.json()
  const { data, error } = await supabase
    .from('todo')
    .insert({ content })
    .select()
    .single()

  if (error) {
    throw new HTTPException(500, error)
  }

  return c.json(data)
})

app.delete('/todo/:id', async c => {
  const { id } = c.req.param()
  const { data, error } = await supabase.from('todo').delete().eq('id', id)

  if (error) {
    throw new HTTPException(500, error)
  }

  return c.json(data)
})

export default app
