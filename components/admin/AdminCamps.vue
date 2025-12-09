<template>
  <div class="admin-camps">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Add Camp
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="camp in camps" :key="camp.id">
          <a-card class="camp-card" hoverable>
            <template #cover>
              <div class="camp-image">
                <img v-if="camp.gallery && camp.gallery.length > 0" :src="camp.gallery[0]" :alt="camp.name" />
                <TeamOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ camp.name }}</h3>
              </template>
              <template #description>
                <p><strong>Location:</strong> {{ getLocationLabel(camp.location) }}</p>
                <p><strong>Period:</strong> {{ camp.startDate }} - {{ camp.endDate }}</p>
                <p><strong>Price:</strong> {{ camp.price }} RON</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editCamp(camp)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Are you sure you want to delete this camp?"
                @confirm="deleteCamp(camp.id)"
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

    <!-- Add/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEditing ? 'Edit Camp' : 'Add Camp'"
      :width="800"
      @ok="saveCamp"
      @cancel="resetForm"
    >
      <a-form :model="campForm" layout="vertical">
        <a-form-item label="Name" required>
          <a-input v-model:value="campForm.name" />
        </a-form-item>
        <a-form-item label="Location" required>
          <a-select v-model:value="campForm.location">
            <a-select-option value="straja">Straja</a-select-option>
            <a-select-option value="rafting">Rafting</a-select-option>
            <a-select-option value="danube_delta">Danube Delta</a-select-option>
            <a-select-option value="colibita">Colibita</a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Year" required>
              <a-input-number v-model:value="campForm.year" style="width: 100%" :min="2024" :max="2030" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Price (RON)" required>
              <a-input-number v-model:value="campForm.price" style="width: 100%" :min="0" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Start Date" required>
              <a-date-picker v-model:value="campForm.startDate" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="End Date" required>
              <a-date-picker v-model:value="campForm.endDate" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Description" required>
          <a-textarea v-model:value="campForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Max Participants" required>
          <a-input-number v-model:value="campForm.maxParticipants" style="width: 100%" :min="1" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const loading = ref(false)
const camps = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)
const campForm = ref<{
  id?: string
  name: string
  location: string
  year: number
  startDate: any
  endDate: any
  description: string
  price: number
  maxParticipants: number
}>({
  name: '',
  location: '',
  year: new Date().getFullYear(),
  startDate: null,
  endDate: null,
  description: '',
  price: 0,
  maxParticipants: 0
})

const loadCamps = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/camps')
    // API returns array directly, not wrapped in { data }
    camps.value = Array.isArray(response) ? response : []
    console.log('Loaded camps:', camps.value.length)
  } catch (error) {
    console.error('Failed to load camps:', error)
    camps.value = []
  } finally {
    loading.value = false
  }
}

const getLocationLabel = (location: string) => {
  const labels: Record<string, string> = {
    'straja': 'Straja',
    'rafting': 'Rafting',
    'danube_delta': 'Danube Delta',
    'colibita': 'Colibita'
  }
  return labels[location] || location
}

const showAddModal = () => {
  isEditing.value = false
  resetForm()
  modalVisible.value = true
}

const editCamp = (camp: any) => {
  isEditing.value = true
  campForm.value = {
    ...camp,
    startDate: camp.startDate ? dayjs(camp.startDate) : null,
    endDate: camp.endDate ? dayjs(camp.endDate) : null
  }
  modalVisible.value = true
}

const resetForm = () => {
  campForm.value = {
    id: undefined,
    name: '',
    location: '',
    year: new Date().getFullYear(),
    startDate: null,
    endDate: null,
    description: '',
    price: 0,
    maxParticipants: 0
  }
}

const saveCamp = async () => {
  try {
    const data = {
      ...campForm.value,
      startDate: campForm.value.startDate ? dayjs(campForm.value.startDate).format('YYYY-MM-DD') : null,
      endDate: campForm.value.endDate ? dayjs(campForm.value.endDate).format('YYYY-MM-DD') : null
    }

    if (isEditing.value && campForm.value.id) {
      await $fetch(`/api/camps/${campForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
    } else {
      await $fetch('/api/camps', {
        method: 'POST',
        body: data
      })
    }

    modalVisible.value = false
    await loadCamps()
  } catch (error) {
    console.error('Failed to save camp:', error)
  }
}

const deleteCamp = async (id: string) => {
  try {
    await $fetch(`/api/camps/${id}`, { method: 'DELETE' })
    await loadCamps()
  } catch (error) {
    console.error('Failed to delete camp:', error)
  }
}

onMounted(() => {
  loadCamps()
})
</script>

<style scoped>
.admin-camps {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.camp-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.camp-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.camp-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camp-image :deep(.anticon) {
  font-size: 3rem;
}
</style>



