<template>
  <div class="admin-school-offers">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Adaugă Ofertă Școlară
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="offer in offers" :key="offer.id">
          <a-card class="offer-card" hoverable>
            <template #cover>
              <div class="offer-image">
                <img v-if="offer.gallery && offer.gallery.length > 0" :src="offer.gallery[0]" :alt="offer.title" />
                <BookOutlined v-else />
              </div>
            </template>
            
            <a-card-meta>
              <template #title>
                <h3>{{ offer.title }}</h3>
              </template>
              <template #description>
                <p v-if="offer.price && !offer.customPrice"><strong>Preț:</strong> {{ offer.price }} RON</p>
                <p v-else-if="offer.customPrice"><strong>Preț:</strong> Personalizat</p>
                <p v-if="offer.maxParticipants"><strong>Participanți Maxim:</strong> {{ offer.maxParticipants }}</p>
                <p><strong>Transport:</strong> {{ offer.transportIncluded ? 'Inclus' : 'Neinclus' }}</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editOffer(offer)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Ești sigur că vrei să ștergi această ofertă?"
                @confirm="deleteOffer(offer.id)"
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
      :title="isEditing ? 'Editează Oferta Școlară' : 'Adaugă Ofertă Școlară'"
      :width="800"
      @ok="saveOffer"
      @cancel="resetForm"
    >
      <a-form :model="offerForm" layout="vertical">
        <a-form-item label="Titlu" required>
          <a-input v-model:value="offerForm.title" placeholder="ex: Excursie Școlară la București" />
        </a-form-item>
        <a-form-item label="Descriere" required>
          <a-textarea v-model:value="offerForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Activități" required>
          <a-select
            v-model:value="offerForm.activities"
            mode="tags"
            placeholder="Adaugă activități (apasă Enter pentru a adăuga)"
            style="width: 100%"
          >
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Preț (RON)" v-if="!offerForm.customPrice">
              <a-input-number v-model:value="offerForm.price" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item>
              <a-checkbox v-model:checked="offerForm.customPrice">
                Preț personalizat
              </a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Participanți Maxim">
              <a-input-number v-model:value="offerForm.maxParticipants" style="width: 100%" :min="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-checkbox v-model:checked="offerForm.transportIncluded">
            Transport inclus
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const offers = ref<any[]>([])
const modalVisible = ref(false)
const isEditing = ref(false)

const offerForm = ref<{
  id?: string
  title: string
  description: string
  activities: string[]
  price?: number
  customPrice: boolean
  transportIncluded: boolean
  maxParticipants?: number
  gallery?: string[]
  videos?: string[]
}>({
  title: '',
  description: '',
  activities: [],
  price: undefined,
  customPrice: false,
  transportIncluded: true,
  maxParticipants: undefined,
  gallery: [],
  videos: []
})

const loadOffers = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/school-offers')
    offers.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load school offers:', error)
    offers.value = []
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  console.log('showAddModal called')
  isEditing.value = false
  resetForm()
  modalVisible.value = true
  console.log('modalVisible set to:', modalVisible.value)
}

const editOffer = (offer: any) => {
  isEditing.value = true
  offerForm.value = {
    ...offer
  }
  modalVisible.value = true
}

const resetForm = () => {
  offerForm.value = {
    id: undefined,
    title: '',
    description: '',
    activities: [],
    price: undefined,
    customPrice: false,
    transportIncluded: true,
    maxParticipants: undefined,
    gallery: [],
    videos: []
  }
}

const saveOffer = async () => {
  if (!offerForm.value.activities || offerForm.value.activities.length === 0) {
    message.warning('Te rog adaugă cel puțin o activitate')
    return
  }

  try {
    const data = {
      ...offerForm.value
    }

    // Remove undefined fields
    delete data.id

    // If customPrice is true, remove price
    if (data.customPrice) {
      delete data.price
    } else if (!data.price) {
      message.warning('Te rog introdu prețul sau bifează "Preț personalizat"')
      return
    }

    if (isEditing.value && offerForm.value.id) {
      await $fetch(`/api/school-offers/${offerForm.value.id}`, {
        method: 'PATCH',
        body: data
      })
      message.success('Oferta a fost actualizată cu succes')
    } else {
      await $fetch('/api/school-offers', {
        method: 'POST',
        body: data
      })
      message.success('Oferta a fost adăugată cu succes')
    }

    modalVisible.value = false
    await loadOffers()
  } catch (error) {
    console.error('Failed to save offer:', error)
    message.error('Eroare la salvarea ofertei')
  }
}

const deleteOffer = async (id: string) => {
  try {
    await $fetch(`/api/school-offers/${id}`, { method: 'DELETE' })
    message.success('Oferta a fost ștearsă cu succes')
    await loadOffers()
  } catch (error) {
    console.error('Failed to delete offer:', error)
    message.error('Eroare la ștergerea ofertei')
  }
}

onMounted(() => {
  loadOffers()
})
</script>

<style scoped>
.admin-school-offers {
  padding: 24px;
}

.actions-section {
  margin-bottom: 24px;
}

.offer-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.offer-image {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.offer-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.offer-image :deep(.anticon) {
  font-size: 3rem;
}

.offer-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}
</style>



