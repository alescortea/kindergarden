<template>
  <div class="admin-trips">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Add Trip
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="trip in trips" :key="trip.id">
          <a-card class="trip-card" hoverable>
            <a-card-meta>
              <template #title>
                <h3>{{ trip.name }}</h3>
              </template>
              <template #description>
                <p><strong>Destination:</strong> {{ trip.destination }}</p>
                <p><strong>Price:</strong> {{ trip.price }} RON</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editTrip(trip)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Are you sure you want to delete this trip?"
                @confirm="deleteTrip(trip.id)"
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
const trips = ref<any[]>([])

const loadTrips = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/trips')
    trips.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load trips:', error)
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  // Implement add modal
}

const editTrip = (trip: any) => {
  // Implement edit modal
}

const deleteTrip = async (id: string) => {
  try {
    await $fetch(`/api/trips/${id}`, { method: 'DELETE' })
    await loadTrips()
  } catch (error) {
    console.error('Failed to delete trip:', error)
  }
}

onMounted(() => {
  loadTrips()
})
</script>

<style scoped>
.admin-trips {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}
</style>



