<template>
  <div class="admin-afterschool">
    <div class="info-section">
      <a-card>
        <template #title>
          <div class="card-title-wrapper">
            <h2>📚 Centru Afterschool</h2>
            <a-button @click="editProgramInfo" type="primary" class="edit-info-btn">
              <EditOutlined />
              <span class="edit-btn-text">Editează Informații</span>
            </a-button>
          </div>
        </template>
        <div class="program-info" v-if="!isEditingProgramInfo">
          <p><strong>Program:</strong> {{ programInfo.normalSchedule }}</p>
          <p><strong>Mențiune*:</strong> {{ programInfo.holidaySchedule }}</p>
          <p><strong>Flexibilitate:</strong> {{ programInfo.flexibility }}</p>
        </div>
        <div v-else class="program-info-edit">
          <a-form :model="programInfo" layout="vertical">
            <a-form-item label="Program Normal">
              <a-input v-model:value="programInfo.normalSchedule" placeholder="ex: Luni-Vineri (12:00-17:30)" />
            </a-form-item>
            <a-form-item label="Program Vacanță">
              <a-input v-model:value="programInfo.holidaySchedule" placeholder="ex: În perioada vacanțelor școlare Luni-Vineri 8:00-17:30" />
            </a-form-item>
            <a-form-item label="Flexibilitate">
              <a-textarea v-model:value="programInfo.flexibility" :rows="2" placeholder="ex: Părinții pot alege numărul de zile pe săptămână (1-5 zile) și zilele preferate." />
            </a-form-item>
            <a-form-item label="Imagine pentru Card">
              <a-upload
                v-model:file-list="afterschoolImageFileList"
                :before-upload="beforeUpload"
                :custom-request="handleImageUpload"
            :list-type="isMobile ? 'picture' : 'picture-card'"
            :max-count="1"
            accept="image/*"
            :show-upload-list="true"
          >
            <div v-if="afterschoolImageFileList.length < 1" :class="isMobile ? 'mobile-upload-btn' : ''">
              <PlusOutlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
              <div v-if="programInfo.cardImage" style="margin-top: 16px;">
                <p style="margin-bottom: 8px; color: #666;">Imagine actuală:</p>
                <img :src="programInfo.cardImage" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #d9d9d9;" />
              </div>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button @click="saveProgramInfo" type="primary">Salvează</a-button>
                <a-button @click="cancelEditProgramInfo">Anulează</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </div>

    <div class="registrations-section" style="margin-top: 24px;">
      <a-card>
        <template #title>
          <h3>Înscrieri la Centrul Afterschool</h3>
        </template>
        <div class="actions-section" style="margin-bottom: 16px;">
          <a-button @click="loadRegistrations" :loading="loading">
            <ReloadOutlined />
            Reîncarcă
          </a-button>
          <a-button @click="exportToExcel" type="primary" :loading="exporting">
            <DownloadOutlined />
            Exportă în Excel
          </a-button>
        </div>

        <!-- Desktop Table -->
        <div class="desktop-table">
          <a-spin :spinning="loading">
            <a-table
              :columns="columns"
              :data-source="filteredRegistrations"
              :pagination="{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} din ${total} înscrieri`
              }"
              :scroll="{ x: 'max-content' }"
              :row-key="(record) => String(record.id)"
              :default-expand-all-rows="false"
              :children-column-name="undefined"
              :expandable="{
                rowExpandable: (record) => {
                  const childrenData = record._childrenData || record.children
                  const canExpand = !!(record.id && record.parent && childrenData && Array.isArray(childrenData) && childrenData.length > 1)
                  console.log('Afterschool row expandable check:', { id: record.id, hasParent: !!record.parent, childrenCount: childrenData?.length, canExpand })
                  return canExpand
                },
                expandedRowKeys: expandedRowKeys,
                onExpand: (expanded, record) => {
                  if (expanded) {
                    expandedRowKeys.value = [String(record.id)]
                  } else {
                    expandedRowKeys.value = []
                  }
                },
                childrenColumnName: undefined,
                indentSize: 0
              }"
            >
              <template #expandedRowRender="{ record }">
                <div v-if="(record._childrenData || record.children) && Array.isArray(record._childrenData || record.children) && (record._childrenData || record.children).length > 1" style="padding: 16px; background: #fafafa; border-top: 1px solid #e8e8e8;">
                  <h4 style="margin-bottom: 16px; color: #1890ff;">Detalii Copii</h4>
                  <div v-for="(child, index) in (record._childrenData || record.children)" :key="`child-${record.id}-${index}`" style="margin-bottom: 16px; padding: 12px; background: white; border-radius: 8px; border: 1px solid #e8e8e8;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #1890ff;">Copil {{ index + 1 }}</div>
                    <div style="margin-bottom: 4px;"><strong>Nume:</strong> {{ (child.firstName || '').trim() }} {{ (child.lastName || '').trim() }}</div>
                    <div style="margin-bottom: 4px;" v-if="child.age"><strong>Vârstă:</strong> {{ child.age }} ani</div>
                    <div style="margin-bottom: 4px;" v-if="child.birthDate"><strong>Data Nașterii:</strong> {{ child.birthDate }}</div>
                    <div style="margin-bottom: 4px;" v-if="child.gender"><strong>Gen:</strong> {{ child.gender === 'male' ? 'Băiat' : child.gender === 'female' ? 'Fată' : 'N/A' }}</div>
                    <div style="margin-bottom: 4px;" v-if="child.medical?.allergies"><strong>Alergii:</strong> {{ child.medical.allergies }}</div>
                    <div style="margin-bottom: 4px;" v-if="child.medical?.conditions"><strong>Afecțiuni Medicale:</strong> {{ child.medical.conditions }}</div>
                    <div style="margin-bottom: 4px;" v-if="child.medical?.medications"><strong>Medicamente:</strong> {{ child.medical.medications }}</div>
                    <div style="margin-bottom: 4px;" v-if="child.otherInfo"><strong>Alte Informații:</strong> {{ child.otherInfo }}</div>
                  </div>
                </div>
              </template>
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'child'">
                  <template v-if="(record._childrenData || record.children) && (record._childrenData || record.children).length > 0">
                    <template v-if="(record._childrenData || record.children).length === 1">
                      {{ ((record._childrenData || record.children)[0].firstName || '').trim() }} {{ ((record._childrenData || record.children)[0].lastName || '').trim() }} ({{ (record._childrenData || record.children)[0].age || '-' }} ani)
                    </template>
                    <template v-else>
                      <a-tag color="blue">{{ (record._childrenData || record.children).length }} copii</a-tag>
                    </template>
                  </template>
                  <template v-else-if="record.child && ((record.child.firstName && record.child.firstName.trim()) || (record.child.lastName && record.child.lastName.trim()))">
                    {{ (record.child.firstName || '').trim() }} {{ (record.child.lastName || '').trim() }} ({{ record.child.age || '-' }} ani)
                  </template>
                  <template v-else>
                    {{ record.childFirstName || '' }} {{ record.childLastName || '' }} ({{ record.childAge || '-' }} ani)
                  </template>
                </template>
                <template v-else-if="column.key === 'parent'">
                  {{ record.parent?.firstName || record.parentFirstName }} {{ record.parent?.lastName || record.parentLastName }}<br>
                  <a :href="`tel:${record.parent?.phone || record.parentPhone}`">{{ record.parent?.phone || record.parentPhone }}</a><br>
                  <a :href="`mailto:${record.parent?.email || record.parentEmail}`">{{ record.parent?.email || record.parentEmail }}</a>
                </template>
                <template v-else-if="column.key === 'schedule'">
                  {{ getScheduleLabel(record.afterschool?.schedule) }}
                </template>
                <template v-else-if="column.key === 'days'">
                  {{ record.afterschool?.daysPerWeek }} zile/săptămână<br>
                  <span v-if="record.afterschool?.preferredDays && record.afterschool.preferredDays.length > 0">
                    {{ getPreferredDaysLabel(record.afterschool.preferredDays) }}
                  </span>
                </template>
                <template v-else-if="column.key === 'startDate'">
                  {{ record.afterschool?.startDate ? formatDate(record.afterschool.startDate) : '-' }}
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="getStatusColor(record.status)">
                    {{ getStatusLabel(record.status) }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <a-space>
                    <a-button @click="viewRegistration(record)" size="small">
                      <EyeOutlined />
                      Vezi
                    </a-button>
                    <a-button @click="editRegistration(record)" size="small">
                      <EditOutlined />
                      Editează
                    </a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-spin>
        </div>

        <!-- Mobile Cards -->
        <div class="mobile-cards">
          <a-spin :spinning="loading">
            <div v-if="filteredRegistrations.length === 0" class="empty-state">
              <p>Nu există înscrieri</p>
            </div>
            <div v-else>
              <a-pagination
                v-model:current="mobilePage"
                :total="filteredRegistrations.length"
                :page-size="mobilePageSize"
                :show-size-changer="false"
                simple
                class="mobile-pagination"
              />
              <div class="cards-list">
                <a-card
                  v-for="record in paginatedMobileRegistrations"
                  :key="record.id"
                  class="registration-card"
                >
                  <div class="card-header">
                    <h3>
                      <template v-if="(record._childrenData || record.children) && (record._childrenData || record.children).length > 0">
                        {{ ((record._childrenData || record.children)[0].firstName || '').trim() }} {{ ((record._childrenData || record.children)[0].lastName || '').trim() }}
                      </template>
                      <template v-else>
                        {{ record.child?.firstName || record.childFirstName || '' }} {{ record.child?.lastName || record.childLastName || '' }}
                      </template>
                    </h3>
                    <a-tag :color="getStatusColor(record.status)">
                      {{ getStatusLabel(record.status) }}
                    </a-tag>
                  </div>
                  <div class="card-content">
                    <div class="card-item">
                      <strong>Vârstă:</strong> 
                      <template v-if="(record._childrenData || record.children) && (record._childrenData || record.children).length > 0">
                        {{ (record._childrenData || record.children)[0].age || '-' }} ani
                      </template>
                      <template v-else>
                        {{ record.child?.age || record.childAge || '-' }} ani
                      </template>
                    </div>
                    <div class="card-item">
                      <strong>Părinte:</strong> {{ record.parent?.firstName || record.parentFirstName }} {{ record.parent?.lastName || record.parentLastName }}
                    </div>
                    <div class="card-item">
                      <strong>Telefon:</strong> 
                      <a :href="`tel:${record.parent?.phone || record.parentPhone}`">{{ record.parent?.phone || record.parentPhone }}</a>
                    </div>
                    <div class="card-item">
                      <strong>Email:</strong> 
                      <a :href="`mailto:${record.parent?.email || record.parentEmail}`">{{ record.parent?.email || record.parentEmail }}</a>
                    </div>
                    <div class="card-item">
                      <strong>Program:</strong> {{ getScheduleLabel(record.afterschool?.schedule) }}
                    </div>
                    <div class="card-item">
                      <strong>Zile:</strong> {{ record.afterschool?.daysPerWeek }} zile/săptămână
                    </div>
                    <div class="card-item" v-if="record.afterschool?.preferredDays && record.afterschool.preferredDays.length > 0">
                      <strong>Zile Preferate:</strong> {{ getPreferredDaysLabel(record.afterschool.preferredDays) }}
                    </div>
                    <div class="card-item" v-if="record.afterschool?.startDate">
                      <strong>Data Începerii:</strong> {{ formatDate(record.afterschool.startDate) }}
                    </div>
                  </div>
                  <div class="card-actions">
                    <a-button size="small" @click="viewRegistration(record)" block style="margin-bottom: 8px;">
                      <EyeOutlined />
                      Vezi Detalii
                    </a-button>
                    <a-button size="small" @click="editRegistration(record)" type="primary" block>
                      <EditOutlined />
                      Editează
                    </a-button>
                  </div>
                </a-card>
              </div>
            </div>
          </a-spin>
        </div>
      </a-card>
    </div>

    <!-- View Registration Modal -->
    <a-modal
      v-model:open="viewModalVisible"
      title="Detalii Înscriere"
      :width="800"
      @cancel="closeViewModal"
      :footer="null"
    >
      <div v-if="selectedRegistration">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="Copil">
            <template v-if="(selectedRegistration._childrenData || selectedRegistration.children) && (selectedRegistration._childrenData || selectedRegistration.children).length > 0">
              {{ ((selectedRegistration._childrenData || selectedRegistration.children)[0].firstName || '').trim() }} {{ ((selectedRegistration._childrenData || selectedRegistration.children)[0].lastName || '').trim() }} ({{ (selectedRegistration._childrenData || selectedRegistration.children)[0].age || '-' }} ani)
            </template>
            <template v-else>
              {{ selectedRegistration.child?.firstName || selectedRegistration.childFirstName || '' }} {{ selectedRegistration.child?.lastName || selectedRegistration.childLastName || '' }} ({{ selectedRegistration.child?.age || selectedRegistration.childAge || '-' }} ani)
            </template>
          </a-descriptions-item>
          <a-descriptions-item label="Părinte">
            {{ selectedRegistration.parent?.firstName || selectedRegistration.parentFirstName }} {{ selectedRegistration.parent?.lastName || selectedRegistration.parentLastName }}
          </a-descriptions-item>
          <a-descriptions-item label="Telefon">
            <a :href="`tel:${selectedRegistration.parent?.phone || selectedRegistration.parentPhone}`">{{ selectedRegistration.parent?.phone || selectedRegistration.parentPhone }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            <a :href="`mailto:${selectedRegistration.parent?.email || selectedRegistration.parentEmail}`">{{ selectedRegistration.parent?.email || selectedRegistration.parentEmail }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="Program">
            {{ getScheduleLabel(selectedRegistration.afterschool?.schedule) }}
          </a-descriptions-item>
          <a-descriptions-item label="Zile pe Săptămână">
            {{ selectedRegistration.afterschool?.daysPerWeek }}
          </a-descriptions-item>
          <a-descriptions-item label="Zile Preferate" v-if="selectedRegistration.afterschool?.preferredDays && selectedRegistration.afterschool.preferredDays.length > 0">
            {{ getPreferredDaysLabel(selectedRegistration.afterschool.preferredDays) }}
          </a-descriptions-item>
          <a-descriptions-item label="Data Începerii" v-if="selectedRegistration.afterschool?.startDate">
            {{ formatDate(selectedRegistration.afterschool.startDate) }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(selectedRegistration.status)">
              {{ getStatusLabel(selectedRegistration.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Data Înscrierii">
            {{ formatDate(selectedRegistration.createdAt) }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <!-- Edit Registration Modal -->
    <a-modal
      v-model:open="editModalVisible"
      title="Editează Înscrierea"
      :width="800"
      :confirm-loading="saving"
      @ok="saveRegistration"
      @cancel="handleEditModalCancel"
    >
      <a-form :model="editForm" layout="vertical">
        <a-divider>Date Copil</a-divider>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Prenume Copil" required>
              <a-input v-model:value="editForm.child.firstName" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Nume Copil" required>
              <a-input v-model:value="editForm.child.lastName" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Vârstă">
              <a-input-number v-model:value="editForm.child.age" :min="1" :max="18" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Data Nașterii">
              <a-date-picker
                v-model:value="editForm.child.birthDate"
                style="width: 100%"
                format="DD.MM.YYYY"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Gen">
              <a-select v-model:value="editForm.child.gender" style="width: 100%">
                <a-select-option value="">Selectează</a-select-option>
                <a-select-option value="male">Băiat</a-select-option>
                <a-select-option value="female">Fată</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="CNP">
              <a-input v-model:value="editForm.child.cnp" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Alte Informații">
          <a-textarea v-model:value="editForm.child.otherInfo" :rows="3" placeholder="Alte informații despre copil" />
        </a-form-item>

        <a-divider>Date Părinte</a-divider>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Prenume Părinte" required>
              <a-input v-model:value="editForm.parent.firstName" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Nume Părinte" required>
              <a-input v-model:value="editForm.parent.lastName" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Telefon" required>
              <a-input v-model:value="editForm.parent.phone" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Email" required>
              <a-input v-model:value="editForm.parent.email" type="email" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Relație">
          <a-select v-model:value="editForm.parent.relationship" style="width: 100%">
            <a-select-option value="">Selectează</a-select-option>
            <a-select-option value="mother">Mamă</a-select-option>
            <a-select-option value="father">Tată</a-select-option>
            <a-select-option value="guardian">Tutore</a-select-option>
          </a-select>
        </a-form-item>

        <a-divider>Centru Afterschool</a-divider>
        <a-form-item label="Program">
          <a-select v-model:value="editForm.afterschool.schedule" style="width: 100%">
            <a-select-option value="daily">Zilnic (12:00-17:30)</a-select-option>
            <a-select-option value="vacation">Vacanță (08:00-17:30)</a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16" v-if="editForm.afterschool.schedule === 'custom'">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Ora Începerii">
              <a-time-picker
                v-model:value="editForm.afterschool.startTime"
                style="width: 100%"
                format="HH:mm"
                placeholder="Selectează ora"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Ora Sfârșitului">
              <a-time-picker
                v-model:value="editForm.afterschool.endTime"
                style="width: 100%"
                format="HH:mm"
                placeholder="Selectează ora"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Zile pe Săptămână">
          <a-select v-model:value="editForm.afterschool.daysPerWeek" style="width: 100%">
            <a-select-option value="1">1 zi/săptămână</a-select-option>
            <a-select-option value="2">2 zile/săptămână</a-select-option>
            <a-select-option value="3">3 zile/săptămână</a-select-option>
            <a-select-option value="4">4 zile/săptămână</a-select-option>
            <a-select-option value="5">5 zile/săptămână (Luni-Vineri)</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Zile Preferate">
          <a-checkbox-group v-model:value="editForm.afterschool.preferredDays">
            <a-row>
              <a-col :span="8">
                <a-checkbox value="monday">Luni</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="tuesday">Marți</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="wednesday">Miercuri</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="thursday">Joi</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="friday">Vineri</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="Data Începerii">
          <a-date-picker
            v-model:value="editForm.afterschool.startDate"
            style="width: 100%"
            format="DD.MM.YYYY"
          />
        </a-form-item>

        <a-divider>Status</a-divider>
        <a-form-item label="Status" required>
          <a-select v-model:value="editForm.status" style="width: 100%">
            <a-select-option value="pending">În Așteptare</a-select-option>
            <a-select-option value="confirmed">Confirmată</a-select-option>
            <a-select-option value="cancelled">Anulată</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ReloadOutlined, DownloadOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import type { UploadProps } from 'ant-design-vue'
import { compressImage } from '~/composables/useImageCompression'

const loading = ref(false)
const exporting = ref(false)
const registrations = ref<any[]>([])
const viewModalVisible = ref(false)
const editModalVisible = ref(false)
const selectedRegistration = ref<any>(null)
const isEditing = ref(false)
const saving = ref(false)
const mobilePage = ref(1)
const mobilePageSize = ref(5)
const isEditingProgramInfo = ref(false)

const programInfo = ref({
  normalSchedule: 'Luni-Vineri (12:00-17:30)',
  holidaySchedule: 'În perioada vacanțelor școlare Luni-Vineri 8:00-17:30',
  flexibility: 'Părinții pot alege numărul de zile pe săptămână (1-5 zile) și zilele preferate.',
  cardImage: ''
})

const afterschoolImageFileList = ref<any[]>([])

// Detect mobile device
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth <= 768
  }
  return false
})

const beforeUpload: UploadProps['beforeUpload'] = (file: File) => {
  const isImage = file.type?.startsWith('image/')
  if (!isImage) {
    message.error('Poți încărca doar imagini!')
    return false
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('Imaginea trebuie să fie mai mică de 10MB!')
    return false
  }
  return false
}

const handleImageUpload = async (options: any) => {
  const { file } = options
  // Pe mobile, file poate fi direct File object sau poate fi într-un wrapper
  const fileObj = file.originFileObj || file
  
  afterschoolImageFileList.value = [{
    uid: file.uid || '-1',
    name: file.name || fileObj.name,
    status: 'done',
    url: file.url || (fileObj ? URL.createObjectURL(fileObj) : ''),
    originFileObj: fileObj, // Păstrăm referința la fișierul original
    file: fileObj // Backup pentru mobile
  }]
  message.success('Imaginea a fost selectată! Va fi încărcată la salvare.')
  return false
}

const editForm = ref({
  child: {
    firstName: '',
    lastName: '',
    age: 0 as number | null,
    birthDate: null as any,
    gender: '',
    cnp: '',
    otherInfo: ''
  },
  parent: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    relationship: ''
  },
  status: 'pending',
  afterschool: {
    schedule: '',
    daysPerWeek: '',
    preferredDays: [] as string[],
    startDate: null as any,
    startTime: null as any,
    endTime: null as any
  }
})

const columns = [
  {
    title: 'Copil',
    key: 'child',
    dataIndex: 'childFirstName'
  },
  {
    title: 'Părinte / Contact',
    key: 'parent',
    dataIndex: 'parentFirstName'
  },
  {
    title: 'Program',
    key: 'schedule',
    dataIndex: ['afterschool', 'schedule']
  },
  {
    title: 'Zile',
    key: 'days',
    dataIndex: ['afterschool', 'daysPerWeek']
  },
  {
    title: 'Data Începerii',
    key: 'startDate',
    dataIndex: ['afterschool', 'startDate']
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: 'Acțiuni',
    key: 'actions',
    fixed: 'right',
    width: 150
  }
]

const getScheduleLabel = (schedule: string) => {
  const labels: Record<string, string> = {
    'daily': 'Zilnic (12:00-17:30)',
    'vacation': 'Vacanță (08:00-17:30)',
    // Backward compatibility with old values
    'full': 'Zilnic (12:00-17:30)',
    'full-time': 'Zilnic (12:00-17:30)',
    'morning': 'Zilnic (12:00-17:30)'
  }
  return labels[schedule?.toLowerCase()] || 'Nespecificat'
}

const getPreferredDaysLabel = (days: string[]) => {
  const dayLabels: Record<string, string> = {
    'monday': 'Luni',
    'tuesday': 'Marți',
    'wednesday': 'Miercuri',
    'thursday': 'Joi',
    'friday': 'Vineri'
  }
  return days.map(day => dayLabels[day] || day).join(', ')
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'În Așteptare',
    'confirmed': 'Confirmată',
    'cancelled': 'Anulată'
  }
  return labels[status?.toLowerCase()] || 'Nespecificat'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'orange',
    'confirmed': 'green',
    'cancelled': 'red'
  }
  return colors[status] || 'default'
}

const formatDate = (date: string | Date | any) => {
  if (!date) return '-'
  
  try {
    // Handle Firebase Timestamp (v9+) - has toDate method
    if (date && typeof date === 'object' && typeof date.toDate === 'function') {
      const jsDate = date.toDate()
      if (jsDate instanceof Date && !isNaN(jsDate.getTime())) {
        return dayjs(jsDate).format('DD.MM.YYYY')
      }
    }
    
    // Handle Firebase Timestamp (v8) - has seconds and nanoseconds
    if (date && typeof date === 'object' && 'seconds' in date && typeof date.seconds === 'number') {
      const jsDate = new Date(date.seconds * 1000)
      if (!isNaN(jsDate.getTime())) {
        return dayjs(jsDate).format('DD.MM.YYYY')
      }
    }
    
    // Handle Timestamp object with _seconds property (serialized)
    if (date && typeof date === 'object' && '_seconds' in date) {
      const jsDate = new Date(date._seconds * 1000)
      if (!isNaN(jsDate.getTime())) {
        return dayjs(jsDate).format('DD.MM.YYYY')
      }
    }
    
    // Handle regular Date objects
    if (date instanceof Date) {
      if (!isNaN(date.getTime())) {
        return dayjs(date).format('DD.MM.YYYY')
      }
    }
    
    // Handle date strings (ISO format, etc.)
    if (typeof date === 'string') {
      const parsed = dayjs(date)
      if (parsed.isValid()) {
        return parsed.format('DD.MM.YYYY')
      }
    }
    
    // Last resort: try dayjs directly
    const parsed = dayjs(date)
    if (parsed.isValid()) {
      return parsed.format('DD.MM.YYYY')
    }
    
    console.warn('Could not format date:', date, typeof date)
    return '-'
  } catch (error) {
    console.error('Error formatting date:', date, error)
    return '-'
  }
}

const paginatedMobileRegistrations = computed(() => {
  const start = (mobilePage.value - 1) * mobilePageSize.value
  const end = start + mobilePageSize.value
  return filteredRegistrations.value.slice(start, end)
})

const loadRegistrations = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/registrations', {
      method: 'GET',
      query: {
        activityType: 'afterschool'
      }
    })
    
    console.log('Afterschool raw API response:', response)
    console.log('Afterschool response length:', Array.isArray(response) ? response.length : 0)
    
    // Filter and transform data like in AdminRegistrations
    const filtered = (Array.isArray(response) ? response : []).filter(r => {
      if (!r || !r.id) {
        console.log('Afterschool filtered out - no id:', r)
        return false
      }
      const hasParent = !!(r.parent || (r.children && r.children.length > 0) || r.child)
      const hasStatus = !!(r.status && r.status !== 'Nespecificat')
      if (!hasParent || !hasStatus) {
        console.log('Afterschool filtered out registration:', { id: r.id, hasParent, hasStatus, status: r.status })
      }
      return hasParent && hasStatus
    })
    
    // Transform data to prevent Ant Design from creating rows for children
    registrations.value = filtered.map(r => {
      const { children, ...rest } = r
      return {
        ...rest,
        _childrenData: children,
        children: undefined
      }
    })
    
    console.log('Afterschool filtered registrations count:', registrations.value.length)
    console.log('Afterschool sample registration:', registrations.value[0])
  } catch (error) {
    console.error('Error loading registrations:', error)
    message.error('Eroare la încărcarea înscrierilor')
  } finally {
    loading.value = false
  }
}

const filteredRegistrations = computed(() => {
  console.log('Afterschool filteredRegistrations computed, count:', registrations.value.length)
  return registrations.value
})

const viewRegistration = (registration: any) => {
  selectedRegistration.value = registration
  viewModalVisible.value = true
}

const closeViewModal = () => {
  viewModalVisible.value = false
  selectedRegistration.value = null
}

const editRegistration = (registration: any) => {
  selectedRegistration.value = registration
  // Support both old (child) and new (children) structure
  const childrenData = registration._childrenData || registration.children
  const childData = childrenData && Array.isArray(childrenData) && childrenData.length > 0 
    ? childrenData[0] 
    : (registration.child || {})
  
  editForm.value = {
    child: {
      firstName: childData.firstName || registration.childFirstName || '',
      lastName: childData.lastName || registration.childLastName || '',
      age: childData.age || registration.childAge || null,
      birthDate: childData.birthDate 
        ? (typeof childData.birthDate === 'string' 
            ? dayjs(childData.birthDate) 
            : dayjs(childData.birthDate))
        : null,
      gender: childData.gender || '',
      cnp: childData.cnp || '',
      otherInfo: childData.otherInfo || ''
    },
    parent: {
      firstName: registration.parent?.firstName || registration.parentFirstName || '',
      lastName: registration.parent?.lastName || registration.parentLastName || '',
      phone: registration.parent?.phone || registration.parentPhone || '',
      email: registration.parent?.email || registration.parentEmail || '',
      relationship: registration.parent?.relationship || ''
    },
    status: registration.status || 'pending',
    afterschool: {
      schedule: registration.afterschool?.schedule || '',
      daysPerWeek: registration.afterschool?.daysPerWeek || '',
      preferredDays: registration.afterschool?.preferredDays || [],
      startDate: registration.afterschool?.startDate 
        ? (typeof registration.afterschool.startDate === 'string' 
            ? dayjs(registration.afterschool.startDate) 
            : dayjs(registration.afterschool.startDate))
        : null,
      startTime: registration.afterschool?.startTime 
        ? (typeof registration.afterschool.startTime === 'string' 
            ? dayjs(registration.afterschool.startTime, 'HH:mm') 
            : dayjs(registration.afterschool.startTime))
        : null,
      endTime: registration.afterschool?.endTime 
        ? (typeof registration.afterschool.endTime === 'string' 
            ? dayjs(registration.afterschool.endTime, 'HH:mm') 
            : dayjs(registration.afterschool.endTime))
        : null
    }
  }
  isEditing.value = true
  editModalVisible.value = true
}

const handleEditModalCancel = () => {
  editModalVisible.value = false
  isEditing.value = false
  selectedRegistration.value = null
  editForm.value = {
    child: { 
      firstName: '', 
      lastName: '', 
      age: null,
      birthDate: null,
      gender: '',
      cnp: '',
      otherInfo: ''
    },
    parent: { 
      firstName: '', 
      lastName: '', 
      phone: '', 
      email: '',
      relationship: ''
    },
    status: 'pending',
    afterschool: {
      schedule: '',
      daysPerWeek: '',
      preferredDays: [],
      startDate: null,
      startTime: null,
      endTime: null
    }
  }
}

const saveRegistration = async () => {
  if (!selectedRegistration.value) return

  // Validation
  if (!editForm.value.child.firstName || !editForm.value.child.lastName) {
    message.warning('Te rog completează numele copilului')
    return
  }
  if (!editForm.value.child.age || editForm.value.child.age < 1) {
    message.warning('Te rog introdu o vârstă validă')
    return
  }
  if (!editForm.value.parent.firstName || !editForm.value.parent.lastName) {
    message.warning('Te rog completează numele părintelui')
    return
  }
  if (!editForm.value.parent.phone) {
    message.warning('Te rog introdu numărul de telefon')
    return
  }
  if (!editForm.value.parent.email) {
    message.warning('Te rog introdu adresa de email')
    return
  }

  saving.value = true
  try {
    // Check if original registration has children array structure
    const hasChildrenArray = selectedRegistration.value._childrenData || (selectedRegistration.value.children && Array.isArray(selectedRegistration.value.children))
    
    const updateData: any = {
      parent: editForm.value.parent,
      status: editForm.value.status,
      afterschool: {
        ...editForm.value.afterschool,
        startDate: editForm.value.afterschool.startDate
          ? (dayjs.isDayjs(editForm.value.afterschool.startDate)
              ? editForm.value.afterschool.startDate.format('YYYY-MM-DD')
              : editForm.value.afterschool.startDate)
          : null,
        startTime: editForm.value.afterschool.startTime
          ? (dayjs.isDayjs(editForm.value.afterschool.startTime)
              ? editForm.value.afterschool.startTime.format('HH:mm')
              : editForm.value.afterschool.startTime)
          : null,
        endTime: editForm.value.afterschool.endTime
          ? (dayjs.isDayjs(editForm.value.afterschool.endTime)
              ? editForm.value.afterschool.endTime.format('HH:mm')
              : editForm.value.afterschool.endTime)
          : null
      }
    }
    
    // If original has children array, update as children array, otherwise as child object
    if (hasChildrenArray) {
      const childrenData = selectedRegistration.value._childrenData || selectedRegistration.value.children || []
      // Update the first child with edited data
      const updatedChildren = [...childrenData]
      if (updatedChildren.length > 0) {
        updatedChildren[0] = {
          ...updatedChildren[0],
          ...editForm.value.child,
          birthDate: editForm.value.child.birthDate
            ? (dayjs.isDayjs(editForm.value.child.birthDate)
                ? editForm.value.child.birthDate.format('YYYY-MM-DD')
                : editForm.value.child.birthDate)
            : null
        }
      } else {
        // If no children exist, create one
        updatedChildren.push({
          ...editForm.value.child,
          birthDate: editForm.value.child.birthDate
            ? (dayjs.isDayjs(editForm.value.child.birthDate)
                ? editForm.value.child.birthDate.format('YYYY-MM-DD')
                : editForm.value.child.birthDate)
            : null
        })
      }
      updateData.children = updatedChildren
    } else {
      // Old structure - use child object
      updateData.child = {
        ...editForm.value.child,
        birthDate: editForm.value.child.birthDate
          ? (dayjs.isDayjs(editForm.value.child.birthDate)
              ? editForm.value.child.birthDate.format('YYYY-MM-DD')
              : editForm.value.child.birthDate)
          : null
      }
    }

    await $fetch(`/api/registrations/${selectedRegistration.value.id}`, {
      method: 'PATCH',
      body: updateData
    })
    
    message.success('Înscrierea a fost actualizată cu succes')
    await loadRegistrations()
    editModalVisible.value = false
    isEditing.value = false
    selectedRegistration.value = null
  } catch (error) {
    console.error('Failed to update registration:', error)
    message.error('Eroare la actualizarea înscrierii')
  } finally {
    saving.value = false
  }
}

const exportToExcel = async () => {
  exporting.value = true
  try {
    const data = registrations.value.map(reg => ({
      'Copil (Nume)': reg.child?.firstName || reg.childFirstName || '',
      'Copil (Prenume)': reg.child?.lastName || reg.childLastName || '',
      'Vârstă': reg.child?.age || reg.childAge || '',
      'Părinte (Nume)': reg.parent?.firstName || reg.parentFirstName || '',
      'Părinte (Prenume)': reg.parent?.lastName || reg.parentLastName || '',
      'Telefon': reg.parent?.phone || reg.parentPhone || '',
      'Email': reg.parent?.email || reg.parentEmail || '',
      'Program': getScheduleLabel(reg.afterschool?.schedule),
      'Zile pe Săptămână': reg.afterschool?.daysPerWeek || '',
      'Zile Preferate': reg.afterschool?.preferredDays ? getPreferredDaysLabel(reg.afterschool.preferredDays) : '',
      'Data Începerii': reg.afterschool?.startDate ? formatDate(reg.afterschool.startDate) : '',
      'Status': getStatusLabel(reg.status),
      'Data Înscrierii': formatDate(reg.createdAt)
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Înscrieri Afterschool')
    
    const fileName = `inscrieri_afterschool_${dayjs().format('YYYY-MM-DD')}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    message.success('Export realizat cu succes!')
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    message.error('Eroare la exportul în Excel')
  } finally {
    exporting.value = false
  }
}

const loadProgramInfo = async () => {
  try {
    // Încarcă informațiile despre program din localStorage
    const savedInfo = localStorage.getItem('afterschool-program-info')
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo)
      programInfo.value = {
        normalSchedule: parsed.normalSchedule || 'Luni-Vineri (12:00-17:30)',
        holidaySchedule: parsed.holidaySchedule || 'În perioada vacanțelor școlare Luni-Vineri 8:00-17:30',
        flexibility: parsed.flexibility || 'Părinții pot alege numărul de zile pe săptămână (1-5 zile) și zilele preferate.',
        cardImage: parsed.cardImage || ''
      }
      // Setează file list pentru imaginea existentă
      if (programInfo.value.cardImage) {
        afterschoolImageFileList.value = [{
          uid: '-1',
          name: 'imagine-actuala.jpg',
          status: 'done',
          url: programInfo.value.cardImage
        }]
      } else {
        afterschoolImageFileList.value = []
      }
    }
  } catch (error) {
    console.error('Error loading program info:', error)
  }
}

const editProgramInfo = () => {
  isEditingProgramInfo.value = true
}

const saveProgramInfo = async () => {
  try {
    // Upload image if there's a new file to upload
    let imageUrl = null
    if (afterschoolImageFileList.value.length > 0) {
      const fileItem = afterschoolImageFileList.value[0]
      let f: any = fileItem?.originFileObj || fileItem?.file || fileItem
      
      // Acceptă și Blob (iOS uneori livrează Blob / wrapper)
      const isFileOrBlob = f && (f instanceof File || f instanceof Blob)
      if (!isFileOrBlob) {
        message.error('Fișier invalid pentru upload.')
        return
      }
      
      // iOS/Safari poate da Blob -> îl transformăm în File cu nume
      if (!(f instanceof File)) {
        const ext = (f.type?.split('/')?.[1] || 'jpg').replace('jpeg', 'jpg')
        f = new File([f], `upload_${Date.now()}.${ext}`, { type: f.type || 'image/jpeg' })
      }
      
      try {
        // Comprimă imaginea înainte de upload (reduce dimensiunea pentru a evita 413)
        message.loading({ content: 'Se comprimă imaginea...', key: 'compressing', duration: 0 })
        const compressedFile = await compressImage(f, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
          maxSizeMB: 2
        })
        message.destroy('compressing')
        
        const formData = new FormData()
        // IMPORTANT: filename explicit (fix pentru iOS Safari)
        formData.append('file', compressedFile, compressedFile.name)
        formData.append('folder', 'afterschool')
        
        const uploadResponse: any = await $fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse?.uploads?.length) {
          imageUrl = uploadResponse.uploads[0].url
          console.log('Image uploaded during save, URL:', imageUrl)
        } else {
          message.error('Eroare: nu s-a primit URL după upload.')
          return
        }
      } catch (uploadError: any) {
        console.error('Upload error:', uploadError)
        message.error(`Eroare la încărcarea imaginii: ${uploadError?.message || 'Eroare necunoscută'}`)
        return
      }
    }
    
    // Use uploaded image or existing image
    const finalImageUrl = imageUrl || programInfo.value.cardImage
    
    // Salvează informațiile în localStorage
    const dataToSave = {
      ...programInfo.value,
      cardImage: finalImageUrl
    }
    localStorage.setItem('afterschool-program-info', JSON.stringify(dataToSave))
    programInfo.value.cardImage = finalImageUrl
    message.success('Informațiile au fost salvate cu succes')
    isEditingProgramInfo.value = false
  } catch (error) {
    console.error('Error saving program info:', error)
    message.error('Eroare la salvarea informațiilor')
  }
}

const cancelEditProgramInfo = () => {
  // Reîncarcă informațiile originale
  loadProgramInfo()
  isEditingProgramInfo.value = false
}

onMounted(() => {
  loadRegistrations()
  loadProgramInfo()
})
</script>

<style scoped>
.admin-afterschool {
  padding: 0;
}

.info-section {
  margin-bottom: 24px;
}

.program-info {
  font-size: 16px;
  line-height: 1.8;
}

.program-info p {
  margin-bottom: 12px;
}

.program-info ul {
  margin-left: 24px;
  margin-bottom: 12px;
}

.program-info ul li {
  margin-bottom: 8px;
}

.actions-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

/* Desktop Table */
.desktop-table {
  display: block;
}

/* Mobile Cards */
.mobile-cards {
  display: none;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.mobile-pagination {
  margin-bottom: 16px;
  text-align: center;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.registration-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.card-content {
  margin-bottom: 16px;
}

.card-item {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.card-item strong {
  color: #2c3e50;
  margin-right: 8px;
}

.card-item a {
  color: #1890ff;
  text-decoration: none;
}

.card-item a:hover {
  text-decoration: underline;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.card-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.card-title-wrapper h2 {
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.edit-info-btn {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .card-title-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .card-title-wrapper h2 {
    margin-bottom: 0;
  }
  
  .edit-info-btn {
    width: 100%;
    margin-top: 8px;
  }
  
  .actions-section {
    flex-direction: column;
  }
  
  .actions-section .ant-btn {
    width: 100%;
  }

  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .card-actions .ant-btn {
    width: 100%;
  }
}

/* Mobile upload button styles */
.mobile-upload-btn {
  width: 100% !important;
  min-height: 80px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 16px !important;
  border: 2px dashed #d9d9d9 !important;
  border-radius: 8px !important;
  background: #fafafa !important;
  cursor: pointer !important;
}

.mobile-upload-btn:hover {
  border-color: #1890ff !important;
  background: #f0f7ff !important;
}

/* Ensure upload component is touch-friendly on mobile */
@media (max-width: 768px) {
  .admin-afterschool :deep(.ant-upload-select) {
    width: 100% !important;
    height: auto !important;
    min-height: 80px !important;
  }
  
  .admin-afterschool :deep(.ant-upload-select-picture-card) {
    width: 100% !important;
    height: 80px !important;
  }
  
  .admin-afterschool :deep(.ant-upload-list-picture) {
    width: 100% !important;
  }
  
  .admin-afterschool :deep(.ant-upload-list-item) {
    width: 100% !important;
    margin-top: 16px !important;
  }
}
</style>

