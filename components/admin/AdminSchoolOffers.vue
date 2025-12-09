<template>
  <div class="admin-school-offers">
    <div class="actions-section">
      <a-button type="primary" @click="showAddModal">
        <PlusOutlined />
        Add School Offer
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="offer in offers" :key="offer.id">
          <a-card class="offer-card" hoverable>
            <a-card-meta>
              <template #title>
                <h3>{{ offer.title }}</h3>
              </template>
              <template #description>
                <p v-if="offer.price">{{ offer.price }} RON</p>
                <p v-else>Custom Price</p>
              </template>
            </a-card-meta>

            <template #actions>
              <a-button @click="editOffer(offer)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="Are you sure you want to delete this offer?"
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
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const offers = ref<any[]>([])

const loadOffers = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/school-offers')
    offers.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to load school offers:', error)
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  // Implement add modal
}

const editOffer = (offer: any) => {
  // Implement edit modal
}

const deleteOffer = async (id: string) => {
  try {
    await $fetch(`/api/school-offers/${id}`, { method: 'DELETE' })
    await loadOffers()
  } catch (error) {
    console.error('Failed to delete offer:', error)
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
</style>



