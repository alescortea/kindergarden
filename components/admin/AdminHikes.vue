<template>
  <div class="admin-hikes">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Add Hike
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="hike in hikes" :key="hike.id">
          <a-card class="hike-card" hoverable>
            <a-card-meta>
              <template #title>
                <h3>{{ hike.name }}</h3>
              </template>
              <template #description>
                <p><strong>Location:</strong> {{ hike.location }}</p>
                <p><strong>Difficulty:</strong> {{ hike.difficulty }}</p>
                <p><strong>Price:</strong> {{ hike.price }} RON</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editHike(hike)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Are you sure you want to delete this hike?"
                @confirm="deleteHike(hike.id)"
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
const hikes = ref<any[]>([])

const loadHikes = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/hikes')
    hikes.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load hikes:', error)
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  // Implement add modal
}

const editHike = (hike: any) => {
  // Implement edit modal
}

const deleteHike = async (id: string) => {
  try {
    await $fetch(`/api/hikes/${id}`, { method: 'DELETE' })
    await loadHikes()
  } catch (error) {
    console.error('Failed to delete hike:', error)
  }
}

onMounted(() => {
  loadHikes()
})
</script>

<style scoped>
.admin-hikes {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}
</style>



