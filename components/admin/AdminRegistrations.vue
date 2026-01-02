<template>
  <div class="admin-registrations">
    <!-- Filters -->
    <div class="filters-section">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="8" :md="6">
          <a-select
            v-model:value="filters.activityType"
            placeholder="Filtrează după tip activitate"
            allow-clear
            @change="loadRegistrations"
          >
            <a-select-option value="">Toate Tipurile</a-select-option>
            <a-select-option value="camp">Tabără</a-select-option>
            <a-select-option value="hike">Drumeție</a-select-option>
            <a-select-option value="trip">Excursie</a-select-option>
            <a-select-option value="ski">Ski</a-select-option>
            <a-select-option value="swimming">Înot</a-select-option>
            <a-select-option value="afterschool">Centru Afterschool</a-select-option>
            <a-select-option value="school-offer">Ofertă Școlară</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8" :md="6">
          <a-select
            v-model:value="filters.status"
            placeholder="Filtrează după status"
            allow-clear
            @change="loadRegistrations"
          >
            <a-select-option value="">Toate Statusurile</a-select-option>
            <a-select-option value="pending">În așteptare</a-select-option>
            <a-select-option value="confirmed">Confirmat</a-select-option>
            <a-select-option value="cancelled">Anulat</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8" :md="6">
          <a-input
            v-model:value="filters.search"
            placeholder="Caută după nume..."
            @input="loadRegistrations"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-button type="primary" @click="exportToExcel">
            <DownloadOutlined />
            Exportă Excel
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- Desktop Table -->
    <div class="table-section desktop-table">
      <a-spin :spinning="loading">
        <div class="table-wrapper">
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
                // Only allow expansion for registrations with multiple children
                // Make sure this is a parent registration, not a child
                const childrenData = record._childrenData || record.children
                const canExpand = !!(record.id && record.parent && childrenData && Array.isArray(childrenData) && childrenData.length > 1)
                console.log('Row expandable check:', { id: record.id, hasParent: !!record.parent, childrenCount: childrenData?.length, canExpand })
                return canExpand
              },
              expandedRowKeys: expandedRowKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  // Only allow one row to be expanded at a time
                  expandedRowKeys.value = [String(record.id)]
                } else {
                  expandedRowKeys.value = []
                }
              },
              // Prevent nested expansion - children should not be expandable
              childrenColumnName: undefined,
              // Ensure no child rows are created
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
                  <div style="margin-bottom: 4px;" v-if="child.skiLevel"><strong>Nivel Ski:</strong> {{ child.skiLevel }}</div>
                  <div style="margin-bottom: 4px;" v-if="child.skiEquipment && child.skiEquipment.length > 0"><strong>Echipament Ski:</strong> {{ child.skiEquipment.join(', ') }}</div>
                  <div style="margin-bottom: 4px;" v-if="child.swimmingLevel"><strong>Nivel Înot:</strong> {{ child.swimmingLevel }}</div>
                  <div style="margin-bottom: 4px;" v-if="child.medical?.allergies"><strong>Alergii:</strong> {{ child.medical.allergies }}</div>
                  <div style="margin-bottom: 4px;" v-if="child.medical?.conditions"><strong>Afecțiuni Medicale:</strong> {{ child.medical.conditions }}</div>
                  <div style="margin-bottom: 4px;" v-if="child.medical?.medications"><strong>Medicamente:</strong> {{ child.medical.medications }}</div>
                  <div style="margin-bottom: 4px;" v-if="child.otherInfo"><strong>Alte Informații:</strong> {{ child.otherInfo }}</div>
                </div>
              </div>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'childName'">
                <template v-if="(record._childrenData || record.children) && (record._childrenData || record.children).length > 0">
                  <template v-if="(record._childrenData || record.children).length === 1">
                    <template v-if="(record._childrenData || record.children)[0].firstName || (record._childrenData || record.children)[0].lastName">
                      {{ ((record._childrenData || record.children)[0].firstName || '').trim() }} {{ ((record._childrenData || record.children)[0].lastName || '').trim() }}
                    </template>
                    <template v-else>
                      -
                    </template>
                  </template>
                  <template v-else>
                    <a-tag color="blue">{{ (record._childrenData || record.children).length }} copii</a-tag>
                  </template>
                </template>
                <template v-else-if="record.child && ((record.child.firstName && record.child.firstName.trim()) || (record.child.lastName && record.child.lastName.trim()))">
                  {{ (record.child.firstName || '').trim() }} {{ (record.child.lastName || '').trim() }}
                </template>
                <template v-else>
                  -
                </template>
              </template>
              <template v-if="column.key === 'age'">
                <template v-if="(record._childrenData || record.children) && (record._childrenData || record.children).length > 0">
                  <template v-if="(record._childrenData || record.children).length === 1">
                    <template v-if="(record._childrenData || record.children)[0].age">
                      {{ (record._childrenData || record.children)[0].age }} ani
                    </template>
                    <template v-else>
                      -
                    </template>
                  </template>
                  <template v-else>
                    <!-- Pentru mai mulți copii, vârsta apare doar în secțiunea expandată - nu se afișează nimic -->
                  </template>
                </template>
                <template v-else-if="record.child && record.child.age">
                  {{ record.child.age }} ani
                </template>
                <template v-else>
                  -
                </template>
              </template>
              <template v-if="column.key === 'parentName'">
                <template v-if="record.parent && ((record.parent.firstName && record.parent.firstName.trim()) || (record.parent.lastName && record.parent.lastName.trim()))">
                  {{ (record.parent.firstName || '').trim() }} {{ (record.parent.lastName || '').trim() }}
                  <span v-if="record.parent.relationship" style="color: #8c8c8c; font-size: 12px; margin-left: 4px;">
                    ({{ getRelationshipLabel(record.parent.relationship) }})
                  </span>
                </template>
                <template v-else>
                  -
                </template>
              </template>
              <template v-if="column.key === 'phone'">
                <template v-if="record.parent && record.parent.phone">
                  {{ record.parent.phone }}
                </template>
                <template v-else>
                  -
                </template>
              </template>
              <template v-if="column.key === 'activityType'">
                {{ getActivityTypeLabel(record.activityType) }}
              </template>
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusLabel(record.status) }}
                </a-tag>
              </template>
              <template v-if="column.key === 'actions'">
                <a-space>
                  <a-button size="small" @click="viewRegistration(record)">
                    <EyeOutlined />
                  </a-button>
                  <a-button size="small" @click="editRegistration(record)">
                    <EditOutlined />
                  </a-button>
                  <a-popconfirm
                    title="Ești sigur că vrei să ștergi această înscriere?"
                    @confirm="deleteRegistration(record.id)"
                  >
                    <a-button size="small" danger>
                      <DeleteOutlined />
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
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
                    {{ (record._childrenData || record.children).length }} copil{{ (record._childrenData || record.children).length > 1 ? 'i' : '' }}
                  </template>
                  <template v-else-if="record.child">
                    {{ record.child.firstName }} {{ record.child.lastName }}
                  </template>
                  <template v-else>
                    N/A
                  </template>
                </h3>
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusLabel(record.status) }}
                </a-tag>
              </div>
              <div class="card-content">
                <template v-if="(record._childrenData || record.children) && (record._childrenData || record.children).length > 0">
                  <div v-for="(child, index) in (record._childrenData || record.children)" :key="index" class="card-item">
                    <strong>Copil {{ index + 1 }}:</strong> {{ child.firstName }} {{ child.lastName }} 
                    <span v-if="child.age">({{ child.age }} ani)</span>
                  </div>
                </template>
                <template v-else-if="record.child">
                  <div class="card-item">
                    <strong>Vârstă:</strong> {{ record.child.age }} ani
                  </div>
                </template>
                <div class="card-item" v-if="record.parent">
                  <strong>Părinte:</strong> {{ record.parent.firstName }} {{ record.parent.lastName }}
                </div>
                <div class="card-item" v-if="record.parent && record.parent.phone">
                  <strong>Telefon:</strong> 
                  <a :href="`tel:${record.parent.phone}`">{{ record.parent.phone }}</a>
                </div>
                <div class="card-item">
                  <strong>Tip Activitate:</strong> {{ getActivityTypeLabel(record.activityType) }}
                </div>
              </div>
              <div class="card-actions">
                <a-button size="small" @click="viewRegistration(record)">
                  <EyeOutlined />
                  Vezi
                </a-button>
                <a-button size="small" @click="editRegistration(record)">
                  <EditOutlined />
                  Editează
                </a-button>
                <a-popconfirm
                  title="Ești sigur că vrei să ștergi?"
                  @confirm="deleteRegistration(record.id)"
                >
                  <a-button size="small" danger>
                    <DeleteOutlined />
                    Șterge
                  </a-button>
                </a-popconfirm>
              </div>
            </a-card>
          </div>
        </div>
      </a-spin>
    </div>

    <!-- View/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEditing ? 'Editează Înscrierea' : 'Vezi Înscrierea'"
      :width="modalWidth"
      :footer="null"
      :wrap-class-name="'registration-modal admin-modal-wrapper'"
      :class="'registration-modal-wrapper'"
      :body-style="{ maxHeight: isMobile ? '70vh' : 'none', overflowY: 'auto', padding: isMobile ? '16px' : '24px' }"
      @cancel="handleModalCancel"
    >
      <div v-if="selectedRegistration" class="registration-details">
        <!-- View Mode -->
        <template v-if="!isEditing">
          <a-descriptions :column="descriptionColumns" bordered>
            <template v-if="selectedRegistration.children && selectedRegistration.children.length > 0">
              <template v-for="(child, index) in selectedRegistration.children" :key="index">
                <a-descriptions-item :label="`Copil ${index + 1} - Nume Complet`">
                  {{ child.firstName }} {{ child.lastName }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Vârstă`" v-if="child.age">
                  {{ child.age }} ani
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Data Nașterii`" v-if="child.birthDate">
                  {{ child.birthDate }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Gen`" v-if="child.gender">
                  {{ child.gender === 'male' ? 'Băiat' : 'Fată' }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Nivel Ski`" v-if="child.skiLevel">
                  {{ child.skiLevel }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Echipament Ski`" v-if="child.skiEquipment && child.skiEquipment.length > 0">
                  {{ child.skiEquipment.join(', ') }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Nivel Înot`" v-if="child.swimmingLevel">
                  {{ child.swimmingLevel }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Alergii`" v-if="child.medical?.allergies">
                  {{ child.medical.allergies }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Afecțiuni Medicale`" v-if="child.medical?.conditions">
                  {{ child.medical.conditions }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Medicamente`" v-if="child.medical?.medications">
                  {{ child.medical.medications }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Note`" v-if="child.medical?.notes">
                  {{ child.medical.notes }}
                </a-descriptions-item>
                <a-descriptions-item :label="`Copil ${index + 1} - Alte Informații`" v-if="child.otherInfo">
                  {{ child.otherInfo }}
                </a-descriptions-item>
              </template>
            </template>
            <template v-else-if="selectedRegistration.child">
              <a-descriptions-item label="Copil - Nume Complet">
                {{ selectedRegistration.child.firstName }} {{ selectedRegistration.child.lastName }}
              </a-descriptions-item>
              <a-descriptions-item label="Copil - Vârstă" v-if="selectedRegistration.child.age">
                {{ selectedRegistration.child.age }} ani
              </a-descriptions-item>
            </template>
            <a-descriptions-item v-if="selectedRegistration.parent" label="Părinte">
              {{ selectedRegistration.parent.firstName }} {{ selectedRegistration.parent.lastName }}
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedRegistration.parent && selectedRegistration.parent.phone" label="Telefon">
              <a :href="`tel:${selectedRegistration.parent.phone}`" class="contact-link">
                {{ selectedRegistration.parent.phone }}
              </a>
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedRegistration.parent && selectedRegistration.parent.email" label="Email">
              <a :href="`mailto:${selectedRegistration.parent.email}`" class="contact-link">
                {{ selectedRegistration.parent.email }}
              </a>
            </a-descriptions-item>
          <a-descriptions-item label="Tip Activitate">
            {{ getActivityTypeLabel(selectedRegistration.activityType) }}
          </a-descriptions-item>
          <!-- Afterschool Program Details -->
          <template v-if="selectedRegistration.afterschool">
            <a-descriptions-item label="Program">
              {{ getScheduleLabel(selectedRegistration.afterschool.schedule) }}
            </a-descriptions-item>
            <a-descriptions-item label="Zile pe Săptămână">
              {{ selectedRegistration.afterschool.daysPerWeek }} {{ selectedRegistration.afterschool.daysPerWeek === '5' ? 'zile' : 'zi' }}/săptămână
            </a-descriptions-item>
            <a-descriptions-item label="Zile Preferate" v-if="selectedRegistration.afterschool.preferredDays && selectedRegistration.afterschool.preferredDays.length > 0">
              {{ getPreferredDaysLabel(selectedRegistration.afterschool.preferredDays) }}
            </a-descriptions-item>
            <a-descriptions-item label="Data Începerii" v-if="selectedRegistration.afterschool.startDate">
              {{ selectedRegistration.afterschool.startDate }}
            </a-descriptions-item>
          </template>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(selectedRegistration.status)">
              {{ getStatusLabel(selectedRegistration.status) }}
            </a-tag>
          </a-descriptions-item>
          </a-descriptions>
          <div class="modal-actions">
            <a-button type="primary" @click="modalVisible = false" block>
              Închide
            </a-button>
          </div>
        </template>

        <!-- Edit Mode -->
        <template v-else>
          <a-form :model="editForm" layout="vertical" @submit.prevent="saveRegistration">
            <!-- Children Information -->
            <template v-if="editForm.children && editForm.children.length > 0">
              <a-divider>Informații Copii</a-divider>
              <div v-for="(child, index) in editForm.children" :key="index" style="margin-bottom: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
                <h4 style="margin-bottom: 16px;">Copil {{ index + 1 }}</h4>
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item :label="`Prenume Copil ${index + 1}`" required>
                      <a-input v-model:value="child.firstName" />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item :label="`Nume Copil ${index + 1}`" required>
                      <a-input v-model:value="child.lastName" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item :label="`Vârstă Copil ${index + 1}`" required>
                      <a-input-number 
                        v-model:value="child.age" 
                        :min="1" 
                        :max="18" 
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </template>
            <template v-else>
              <a-divider>Informații Copil</a-divider>
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
                  <a-form-item label="Vârstă" required>
                    <a-input-number 
                      v-model:value="editForm.child.age" 
                      :min="1" 
                      :max="18" 
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
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
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Relația" required>
                  <a-select v-model:value="editForm.parent.relationship" style="width: 100%">
                    <a-select-option value="mother">Mamă</a-select-option>
                    <a-select-option value="father">Tată</a-select-option>
                    <a-select-option value="guardian">Tutore</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider>Detalii Înscriere</a-divider>
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Tip Activitate" required>
                  <a-select 
                    v-model:value="editForm.activityType" 
                    style="width: 100%"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="camp">Tabără</a-select-option>
                    <a-select-option value="hike">Drumeție</a-select-option>
                    <a-select-option value="trip">Excursie</a-select-option>
                    <a-select-option value="ski">Ski</a-select-option>
                    <a-select-option value="swimming">Înot</a-select-option>
                    <a-select-option value="afterschool">Centru Afterschool</a-select-option>
                    <a-select-option value="school-offer">Ofertă Școlară</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Status" required>
                  <a-select 
                    v-model:value="editForm.status" 
                    style="width: 100%"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="pending">În așteptare</a-select-option>
                    <a-select-option value="confirmed">Confirmat</a-select-option>
                    <a-select-option value="cancelled">Anulat</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <!-- Afterschool Program Fields -->
            <template v-if="editForm.activityType === 'afterschool'">
              <a-divider>Detalii Centru Afterschool</a-divider>
              <a-row :gutter="16">
                <a-col :xs="24" :sm="12">
                  <a-form-item label="Program">
                    <a-select 
                      v-model:value="editForm.afterschool.schedule" 
                      style="width: 100%"
                      :getPopupContainer="getPopupContainer"
                    >
                      <a-select-option value="daily">Zilnic (12:00-17:30)</a-select-option>
                      <a-select-option value="vacation">Vacanță (08:00-17:30)</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12">
                  <a-form-item label="Zile pe Săptămână">
                    <a-select 
                      v-model:value="editForm.afterschool.daysPerWeek" 
                      style="width: 100%"
                      :getPopupContainer="getPopupContainer"
                    >
                      <a-select-option value="1">1 zi/săptămână</a-select-option>
                      <a-select-option value="2">2 zile/săptămână</a-select-option>
                      <a-select-option value="3">3 zile/săptămână</a-select-option>
                      <a-select-option value="4">4 zile/săptămână</a-select-option>
                      <a-select-option value="5">5 zile/săptămână (Luni-Vineri)</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :xs="24">
                  <a-form-item label="Zile Preferate">
                    <a-checkbox-group v-model:value="editForm.afterschool.preferredDays">
                      <a-space>
                        <a-checkbox value="monday">Luni</a-checkbox>
                        <a-checkbox value="tuesday">Marți</a-checkbox>
                        <a-checkbox value="wednesday">Miercuri</a-checkbox>
                        <a-checkbox value="thursday">Joi</a-checkbox>
                        <a-checkbox value="friday">Vineri</a-checkbox>
                      </a-space>
                    </a-checkbox-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :xs="24" :sm="12">
                  <a-form-item label="Data Începerii">
                    <a-date-picker
                      v-model:value="editForm.afterschool.startDate"
                      style="width: 100%"
                      format="YYYY-MM-DD"
                      :getPopupContainer="getPopupContainer"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
            <div class="modal-actions">
              <a-space>
                <a-button @click="handleModalCancel">
                  Anulează
                </a-button>
                <a-button type="primary" @click="saveRegistration" :loading="saving">
                  Salvează
                </a-button>
              </a-space>
            </div>
          </a-form>
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { message, Table } from 'ant-design-vue'
import * as XLSX from 'xlsx'
import dayjs, { type Dayjs } from 'dayjs'

const loading = ref(false)
const registrations = ref<any[]>([])
const expandedRowKeys = ref<(string | number)[]>([])
const filters = ref({
  activityType: '',
  status: '',
  search: ''
})
const modalVisible = ref(false)
const selectedRegistration = ref<any>(null)
const isEditing = ref(false)
const saving = ref(false)

const editForm = ref({
  child: {
    firstName: '',
    lastName: '',
    age: 0
  },
  parent: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    relationship: ''
  },
  activityType: '',
  status: '',
  afterschool: {
    schedule: '',
    daysPerWeek: '',
    preferredDays: [] as string[],
    startDate: null as any
  }
})

const columns = [
  Table.EXPAND_COLUMN,
  { title: 'Copil', key: 'childName' },
  { title: 'Vârstă', key: 'age', width: 100 },
  { title: 'Părinte', key: 'parentName' },
  { title: 'Telefon', key: 'phone' },
  { title: 'Tip Activitate', key: 'activityType' },
  { title: 'Status', key: 'status' },
  { title: 'Acțiuni', key: 'actions', width: 150 }
]

const mobilePage = ref(1)
const mobilePageSize = ref(5)

// Detect mobile device
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth <= 768
  }
  return false
})

// Helper pentru getPopupContainer - pe mobile folosește document.body
const getPopupContainer = (trigger: HTMLElement) => {
  if (!process.client || !document || !document.body) {
    // Fallback pentru SSR sau când document nu e disponibil
    return trigger?.parentElement || (process.client && document?.body ? document.body : document?.documentElement)
  }
  if (isMobile.value) {
    return document.body
  }
  return trigger?.parentElement || document.body
}

const modalWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768 ? '95%' : 800
  }
  return 800
})

const descriptionColumns = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768 ? 1 : 2
  }
  return 2
})

const paginatedMobileRegistrations = computed(() => {
  const start = (mobilePage.value - 1) * mobilePageSize.value
  const end = start + mobilePageSize.value
  return filteredRegistrations.value.slice(start, end)
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'În așteptare',
    'confirmed': 'Confirmat',
    'cancelled': 'Anulat'
  }
  return labels[status?.toLowerCase()] || 'Nespecificat'
}

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'camp': 'Tabără',
    'hike': 'Drumeție',
    'trip': 'Excursie',
    'ski': 'Ski',
    'swimming': 'Înot',
    'afterschool': 'Centru Afterschool',
    'school-offer': 'Ofertă Școlară'
  }
  return labels[type] || type
}

const getRelationshipLabel = (relationship: string) => {
  const labels: Record<string, string> = {
    'mother': 'Mamă',
    'father': 'Tată',
    'guardian': 'Tutore'
  }
  return labels[relationship?.toLowerCase()] || relationship || 'Părinte'
}

const filteredRegistrations = computed(() => {
  let filtered = registrations.value

  if (filters.value.activityType) {
    filtered = filtered.filter(r => r.activityType === filters.value.activityType)
  }

  if (filters.value.status) {
    filtered = filtered.filter(r => r.status === filters.value.status)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(r => {
      const parentMatch = r.parent?.firstName?.toLowerCase().includes(search) ||
                         r.parent?.lastName?.toLowerCase().includes(search)
      
      if (parentMatch) return true
      
      // Check children array
      if (r.children && r.children.length > 0) {
        return r.children.some(child => 
          child.firstName?.toLowerCase().includes(search) ||
          child.lastName?.toLowerCase().includes(search)
        )
      }
      
      // Fallback to old structure
      if (r.child) {
        return r.child.firstName?.toLowerCase().includes(search) ||
               r.child.lastName?.toLowerCase().includes(search)
      }
      
      return false
    })
  }

  // Filter out empty registrations and ensure each registration has a unique ID
  // CRITICAL: Only return parent registrations, never individual children as rows
  filtered = filtered.filter((r, index, self) => {
    if (!r || !r.id) return false
    // Remove duplicates based on ID
    const firstIndex = self.findIndex(reg => reg.id === r.id)
    if (firstIndex !== index) return false
    // Ensure this is a parent registration object, not a child object
    // A parent registration should have either 'children' array or 'parent' object
    // A child object would not have these properties
    const isParentRegistration = !!(r.children || r.parent || r.child)
    // Additional check: if it has children array, make sure children are not being treated as rows
    if (r.children && Array.isArray(r.children)) {
      // Ensure children don't have 'id' that matches parent registrations
      // This prevents children from being treated as separate rows
      return isParentRegistration && !r.children.some((child: any) => child.id && self.some(reg => reg.id === child.id))
    }
    return isParentRegistration
  })

  // Return only parent registrations - children should only appear in expandedRowRender
  // Make absolutely sure we're not returning children as separate rows
  const finalFiltered = filtered.filter(r => {
    // Double check: ensure this is not a child object
    // Children should not have 'parent' or 'children' properties in a way that makes them look like registrations
    // Also ensure the registration has a valid status (not undefined/null)
    const isValid = !!(r.id && (r.parent || r.children || r.child) && r.status)
    if (!isValid) {
      console.log('Filtered out invalid registration:', r)
    }
    return isValid
  })
  
  // CRITICAL: Transform data to prevent Ant Design from creating rows for children
  // Remove children property temporarily and store it separately, or ensure children is not treated as nested rows
  const transformedData = finalFiltered.map(r => {
    // Create a copy without the children property that Ant Design might interpret as nested rows
    const { children, ...rest } = r
    // Store children in a different property name that Ant Design won't recognize
    return {
      ...rest,
      _childrenData: children, // Store children data separately
      // Explicitly set children to undefined to prevent Ant Design from creating nested rows
      children: undefined
    }
  })
  
  console.log('Filtered registrations count:', finalFiltered.length)
  console.log('Transformed data sample:', transformedData.slice(0, 2))
  console.log('First registration children:', finalFiltered[0]?.children)
  
  return transformedData
})

const loadRegistrations = async () => {
  loading.value = true
  try {
    const query: any = {}
    if (filters.value.activityType) query.activityType = filters.value.activityType
    if (filters.value.status) query.status = filters.value.status

    const response = await $fetch('/api/registrations', { query })
    // Filter out any empty or invalid registrations
    // CRITICAL: Only keep parent registrations, never individual children
    registrations.value = (Array.isArray(response) ? response : []).filter(r => {
      if (!r || !r.id) return false
      // Only keep registrations that have parent info (these are parent registrations)
      // Children should not have parent info, so they won't be included
      // Also ensure it has a valid status
      const hasParent = !!(r.parent || (r.children && r.children.length > 0) || r.child)
      const hasStatus = !!(r.status && r.status !== 'Nespecificat')
      return hasParent && hasStatus
    })
  } catch (error) {
    console.error('Failed to load registrations:', error)
    registrations.value = []
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'orange',
    'confirmed': 'green',
    'cancelled': 'red'
  }
  return colors[status] || 'default'
}

const viewRegistration = (registration: any) => {
  selectedRegistration.value = { ...registration }
  isEditing.value = false
  modalVisible.value = true
}

const editRegistration = (registration: any) => {
  selectedRegistration.value = { ...registration }
  // Initialize edit form with current values
  // Support both old (child) and new (children) structure
  const children = registration.children || (registration.child ? [registration.child] : [])
  const firstChild = registration.child || (children && children.length > 0 ? children[0] : { firstName: '', lastName: '', age: 0 })
  
  editForm.value = {
    children: children,
    child: firstChild, // Keep for backward compatibility
    parent: {
      firstName: registration.parent?.firstName || '',
      lastName: registration.parent?.lastName || '',
      phone: registration.parent?.phone || '',
      email: registration.parent?.email || '',
      relationship: registration.parent?.relationship || ''
    },
    activityType: registration.activityType || '',
    status: registration.status || 'pending',
    afterschool: {
      schedule: registration.afterschool?.schedule || '',
      daysPerWeek: registration.afterschool?.daysPerWeek || '',
      preferredDays: registration.afterschool?.preferredDays || [],
      startDate: registration.afterschool?.startDate ? dayjs(registration.afterschool.startDate) : null
    }
  }
  isEditing.value = true
  modalVisible.value = true
}

const handleModalCancel = () => {
  modalVisible.value = false
  isEditing.value = false
  // Reset form
  editForm.value = {
    children: [],
    child: { firstName: '', lastName: '', age: 0 },
    parent: { firstName: '', lastName: '', phone: '', email: '', relationship: '' },
    activityType: '',
    status: '',
    afterschool: {
      schedule: '',
      daysPerWeek: '',
      preferredDays: [],
      startDate: null
    }
  }
}

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
  if (!days || days.length === 0) return 'Nespecificat'
  const dayLabels: Record<string, string> = {
    'monday': 'Luni',
    'tuesday': 'Marți',
    'wednesday': 'Miercuri',
    'thursday': 'Joi',
    'friday': 'Vineri'
  }
  return days.map(day => dayLabels[day] || day).join(', ')
}

const saveRegistration = async () => {
  if (!selectedRegistration.value) return

  // Validation - support both children array and single child
  if (editForm.value.children && editForm.value.children.length > 0) {
    for (let i = 0; i < editForm.value.children.length; i++) {
      const child = editForm.value.children[i]
      if (!child.firstName || !child.lastName) {
        message.warning(`Te rog completează numele copilului ${i + 1}`)
        return
      }
    }
  } else if (editForm.value.child) {
    if (!editForm.value.child.firstName || !editForm.value.child.lastName) {
      message.warning('Te rog completează numele copilului')
      return
    }
    if (!editForm.value.child.age || editForm.value.child.age < 1) {
      message.warning('Te rog introdu o vârstă validă')
      return
    }
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
    const updateData: any = {
      // Support both structures
      children: editForm.value.children || (editForm.value.child ? [editForm.value.child] : []),
      child: editForm.value.child, // Keep for backward compatibility
      parent: editForm.value.parent,
      activityType: editForm.value.activityType,
      status: editForm.value.status
    }

    // Include afterschool data if applicable
    if (editForm.value.activityType === 'afterschool') {
      updateData.afterschool = {
        ...editForm.value.afterschool,
        startDate: editForm.value.afterschool.startDate
          ? (dayjs.isDayjs(editForm.value.afterschool.startDate) 
              ? editForm.value.afterschool.startDate.format('YYYY-MM-DD')
              : editForm.value.afterschool.startDate)
          : null
      }
    }

    await $fetch(`/api/registrations/${selectedRegistration.value.id}`, {
      method: 'PATCH',
      body: updateData
    })
    message.success('Înscrierea a fost actualizată cu succes')
    await loadRegistrations()
    modalVisible.value = false
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update registration:', error)
    message.error('Eroare la actualizarea înscrierii')
  } finally {
    saving.value = false
  }
}

const deleteRegistration = async (id: string) => {
  try {
    await $fetch(`/api/registrations/${id}`, { method: 'DELETE' })
    await loadRegistrations()
  } catch (error) {
    console.error('Failed to delete registration:', error)
  }
}

const exportToExcel = () => {
  const data = filteredRegistrations.value.map(reg => ({
    'Copii': reg.children && reg.children.length > 0 
      ? reg.children.map((c: any, i: number) => `${i + 1}. ${c.firstName} ${c.lastName} (${c.age || 'N/A'} ani)`).join('; ')
      : reg.child 
        ? `${reg.child.firstName} ${reg.child.lastName}`
        : 'N/A',
    'Număr Copii': reg.children ? reg.children.length : (reg.child ? 1 : 0),
    'Nume Părinte': reg.parent ? `${reg.parent.firstName || ''} ${reg.parent.lastName || ''}`.trim() : 'N/A',
    'Telefon': reg.parent?.phone || 'N/A',
    'Email': reg.parent?.email || 'N/A',
    'Tip Activitate': getActivityTypeLabel(reg.activityType),
    'Status': getStatusLabel(reg.status)
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Înscrieri')
  XLSX.writeFile(wb, `inscrieri_${dayjs().format('YYYY-MM-DD')}.xlsx`)
}

onMounted(() => {
  loadRegistrations()
})
</script>

<style scoped>
.admin-registrations {
  padding: 24px;
}

.filters-section {
  background: #fafafa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.table-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.mobile-cards {
  display: none;
}

.registration-details {
  max-height: 70vh;
  overflow-y: auto;
  padding: 8px 0;
}

.registration-details :deep(.ant-descriptions-item-label) {
  font-weight: 600;
  background: #fafafa;
  width: 40%;
}

.registration-details :deep(.ant-descriptions-item-content) {
  width: 60%;
}

.contact-link {
  color: #1890ff;
  text-decoration: none;
  word-break: break-all;
}

.contact-link:hover {
  text-decoration: underline;
}

.modal-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* Mobile Modal Styles */
:deep(.registration-modal) {
  top: 20px;
}

:deep(.registration-modal-wrapper) {
  padding: 0;
}

@media (max-width: 768px) {
  .registration-details {
    max-height: calc(100vh - 120px);
    padding: 4px 0;
  }

  .registration-details :deep(.ant-descriptions-item-label) {
    width: 35%;
    font-size: 14px;
    padding: 8px 12px;
  }

  .registration-details :deep(.ant-descriptions-item-content) {
    width: 65%;
    font-size: 14px;
    padding: 8px 12px;
  }

  .registration-details :deep(.ant-descriptions-row) {
    display: flex;
    flex-direction: column;
  }

  .registration-details :deep(.ant-descriptions-item) {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  .registration-details :deep(.ant-descriptions-item-label) {
    width: 100%;
    margin-bottom: 4px;
    font-weight: 600;
    color: #666;
  }

  .registration-details :deep(.ant-descriptions-item-content) {
    width: 100%;
  }

  :deep(.registration-modal .ant-modal) {
    margin: 10px auto;
    max-width: 95%;
  }

  :deep(.registration-modal .ant-modal-content) {
    border-radius: 12px;
  }

  :deep(.registration-modal .ant-modal-header) {
    padding: 16px;
    border-radius: 12px 12px 0 0;
  }

  :deep(.registration-modal .ant-modal-title) {
    font-size: 18px;
  }

  :deep(.registration-modal .ant-modal-body) {
    padding: 16px;
    max-height: calc(100vh - 150px);
    overflow-y: auto;
  }

  :deep(.registration-modal .ant-modal-close) {
    top: 16px;
    right: 16px;
  }
}

/* Mobile Cards Styles */
.registration-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-content {
  margin-bottom: 16px;
}

.card-item {
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.card-item:last-child {
  border-bottom: none;
}

.card-item strong {
  display: inline-block;
  min-width: 120px;
  color: #666;
  font-weight: 500;
}

.card-item a {
  color: #1890ff;
  text-decoration: none;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mobile-pagination {
  margin-bottom: 16px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-registrations {
    padding: 12px;
  }

  .filters-section {
    padding: 16px;
  }

  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .table-section {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-cards {
    display: none;
  }
}
</style>



