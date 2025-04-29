import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { getSupabaseClient, initializeSupabase } from './db'

// Define the expected structure for environment variables
interface Env {
  SUPABASE_KEY: string
}

const app = new Hono<{ Bindings: Env }>()

app.use(logger())

// Middleware to initialize Supabase
app.use(async (c, next) => {
  try {
    initializeSupabase(c.env)
  }
  catch (e) {
    console.error('Failed to initialize Supabase:', e)
    throw new HTTPException(500, { message: 'Internal Server Error: Database initialization failed' })
  }
  await next()
})

app.get('/', (c) => {
  return c.text('Hello!')
})

app.get('/todos', async (c) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('todo').select().order('created_at', { ascending: false })

  if (error) {
    throw new HTTPException(500, { message: error.message })
  }

  return c.json(data)
})

app.post('/todo', async (c) => {
  const supabase = getSupabaseClient()
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
  const supabase = getSupabaseClient()
  const { id } = c.req.param()
  const { error } = await supabase.from('todo').delete().eq('id', id)

  if (error) {
    throw new HTTPException(500, { message: error.message })
  }

  return c.json({ success: true })
})

export default app
