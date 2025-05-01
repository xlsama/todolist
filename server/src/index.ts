import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { logger as rslog } from 'rslog'

const app = new Hono()

app.use(logger((log) => {
  rslog.info(log)
}))

app.get('/', (c) => {
  return c.text('Hello!')
})

const supabase: any = null

app.get('/todos', async (c) => {
  const { data, error } = await supabase.from('todo').select().order('created_at', { ascending: false })

  if (error) {
    throw new HTTPException(500, { message: error.message })
  }

  return c.json(data)
})

app.post('/todo', async (c) => {
  const { content } = await c.req.json()
  const { data, error } = await supabase
    .from('todo')
    .insert({ content })
    .select()
    .single()

  if (error) {
    throw new HTTPException(500, { message: error.message })
  }

  return c.json(data)
})

app.delete('/todo/:id', async (c) => {
  const { id } = c.req.param()
  const { error } = await supabase.from('todo').delete().eq('id', id)

  if (error) {
    throw new HTTPException(500, { message: error.message })
  }

  return c.json({ success: true })
})

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  rslog.success(`Server is running on http://localhost:${info.port}`)
})
