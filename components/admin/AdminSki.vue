<template>
  <div class="admin-ski">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Add Ski Lesson
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="lesson in lessons" :key="lesson.id">
          <a-card class="lesson-card" hoverable>
            <a-card-meta>
              <template #title>
                <h3>{{ lesson.type }} Lesson</h3>
              </template>
              <template #description>
                <p><strong>Duration:</strong> {{ lesson.duration }}</p>
                <p><strong>Price:</strong> {{ lesson.price }} RON</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editLesson(lesson)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Are you sure you want to delete this lesson?"
                @confirm="deleteLesson(lesson.id)"
              >
                <a-button danger>
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const lessons = ref<any[]>([])

const loadLessons = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/ski')
    lessons.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load ski lessons:', error)
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  // Implement add modal
}

const editLesson = (lesson: any) => {
  // Implement edit modal
}

const deleteLesson = async (id: string) => {
  try {
    await $fetch(`/api/ski/${id}`, { method: 'DELETE' })
    await loadLessons()
  } catch (error) {
    console.error('Failed to delete lesson:', error)
  }
}

onMounted(() => {
  loadLessons()
})
</script>

<style scoped>
.admin-ski {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}
</style>



