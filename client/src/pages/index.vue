<script setup lang="ts">
import { request } from '@/utils'
import { useQuery } from '@pinia/colada'
import dayjs from 'dayjs'
import { Loader, Plus, Trash } from 'lucide-vue-next'

const content = ref('')
const adding = ref(false)

const { data: todos, isLoading, refetch } = useQuery({
  key: () => ['todos'],
  query: () => request('/api/todos'),
})

const { data: welcome } = useQuery({
  key: () => ['welcome'],
  query: () => request('/api'),
})

async function handleAdd() {
  adding.value = true
  await request('/api/todo', {
    method: 'POST',
    body: {
      content: content.value,
    },
  }).finally(() => adding.value = false)

  content.value = ''
  refetch()
}
</script>

<template>
  <div class="flex flex-col gap-5 justify-center h-screen w-100 mx-auto">
    <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
      {{ welcome }}
    </h3>

    <div class="flex gap-2">
      <Input v-model="content" type="text" placeholder="content" @keyup.enter="handleAdd" />
      <Button variant="outline" size="icon" :disabled="adding" @click="handleAdd">
        <Plus class="w-4 h-4" />
      </Button>
    </div>
    <div class="flex flex-col gap-2 items-center">
      <Loader v-if="isLoading" class="animate-spin mt-10" />
      <Card v-for="todo in todos" v-else :key="todo.id" class="w-full">
        <CardContent class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <div>{{ todo.content }}</div>
            <Button
              variant="outline" size="icon"
              @click="async () => {
                await request(`/api/todo/${todo.id}`, {
                  method: 'DELETE',
                })

                refetch()
              }"
            >
              <Trash class="w-4 h-4" />
            </Button>
          </div>
          <div class="text-xs text-muted-foreground text-right">
            {{ dayjs(todo.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
