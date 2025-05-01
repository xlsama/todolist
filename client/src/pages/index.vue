<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { request } from '@/utils'
import { useQuery } from '@pinia/colada'
import dayjs from 'dayjs'
import { Loader, Plus, Trash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

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
  if (!content.value) {
    toast.error('Please input content')
    return
  }

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

async function handleUpdate(id: number, data: any) {
  await request(`/api/todo/${id}`, {
    method: 'PUT',
    body: data,
  })
  toast.success('Update success')

  refetch()
}
</script>

<template>
  <div class="flex flex-col pt-20 gap-5 h-screen w-100 mx-auto">
    <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
      {{ welcome }}
    </h3>
    <div class="flex gap-2">
      <Input v-model="content" type="text" placeholder="please input content" @keyup.enter="handleAdd" />
      <Button variant="outline" size="icon" :disabled="adding" @click="handleAdd">
        <Plus class="w-4 h-4" />
      </Button>
    </div>
    <div class="flex flex-col gap-2 items-center">
      <Loader v-if="isLoading" class="animate-spin mt-20" />
      <Card v-for="todo in todos" v-else :key="todo.id" class="w-full">
        <CardContent class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <Checkbox
                :model-value="todo.isDone"
                @update:model-value="handleUpdate(todo.id, { isDone: !todo.isDone })"
              />
              <span>{{ todo.content }}</span>
            </div>
            <Button
              variant="outline" size="icon"
              @click="async () => {
                await request(`/api/todo/${todo.id}`, {
                  method: 'DELETE',
                })
                toast.success('Delete success')

                refetch()
              }"
            >
              <Trash class="w-4 h-4" />
            </Button>
          </div>
          <div class="text-xs text-muted-foreground text-right">
            {{ dayjs(todo.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <Toaster position="top-right" rich-colors />
</template>
