<template>
    <div class="registration-page">
      <!-- Mobile Back Button -->
      <div class="mobile-back-button">
        <a-button type="text" @click="goHome" class="back-btn">
          <ArrowLeftOutlined />
          Înapoi la pagina principală
        </a-button>
      </div>

      <div class="page-header">
        <h1>📝 Formular de Înscriere</h1>
        <p>Completați formularul pentru a înregistra copilul la activitățile noastre</p>
      </div>

      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :lg="16">
          <a-card class="form-card" title="Detalii Înscriere">
            <a-form
              ref="formRef"
              :model="formData"
              layout="vertical"
              :validate-trigger="[]"
              @finish="handleSubmit"
            >
              <!-- Activity Selection -->
              <div class="form-section">
                <h3>🎯 Selectare Activitate</h3>
                <a-form-item 
                  label="Tip Activitate" 
                  name="activityType"
                  :rules="[{ required: true, message: 'Selectați tipul de activitate', trigger: 'change' }]"
                >
                  <a-select
                    v-model:value="formData.activityType"
                    placeholder="Selectați tipul de activitate"
                    @change="loadActivities"
                    :loading="loadingActivityTypes"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option v-if="availableActivityTypes.camp" value="camp">Tabără</a-select-option>
                    <a-select-option v-if="availableActivityTypes.hike" value="hike">Drumeție</a-select-option>
                    <a-select-option v-if="availableActivityTypes.trip" value="trip">Excursie</a-select-option>
                    <a-select-option v-if="availableActivityTypes.ski" value="ski">Lecție de Ski</a-select-option>
                    <a-select-option v-if="availableActivityTypes.swimming" value="swimming">Lecție de Înot</a-select-option>
                    <a-select-option v-if="availableActivityTypes.afterschool" value="afterschool">Centru Afterschool</a-select-option>
                    <a-select-option v-if="availableActivityTypes['school-offer']" value="school-offer">Ofertă Școlară</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item 
                  label="Selectați Activitatea" 
                  name="activityId" 
                  v-if="formData.activityType && formData.activityType !== 'afterschool'"
                  :rules="[{ required: true, message: 'Selectați activitatea', trigger: 'change' }]"
                >
                  <a-select
                    v-model:value="formData.activityId"
                    placeholder="Selectați activitatea specifică"
                    :loading="loadingActivities"
                    show-search
                    :filter-option="false"
                    :getPopupContainer="getPopupContainer"
                    @change="() => {}"
                  >
                    <a-select-option
                      v-for="activity in activities"
                      :key="activity.id"
                      :value="activity.id"
                      :label="getActivityName(activity)"
                    >
                      {{ getActivityName(activity) }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <!-- Activity Description Display -->
                <div v-if="selectedActivity && selectedActivity.description" class="activity-description-section">
                  <a-card size="small" class="activity-info-card">
                    <template #title>
                      <span>ℹ️ Despre activitate: {{ getActivityName(selectedActivity) }}</span>
                    </template>
                    <div class="activity-description-text">
                      {{ selectedActivity.description }}
                    </div>
                  </a-card>
                </div>

                <!-- Afterschool Program Specific Fields -->
                <template v-if="formData.activityType === 'afterschool'">
                  <a-form-item label="Program" name="afterschool.schedule">
                    <a-select
                      v-model:value="formData.afterschool.schedule"
                      placeholder="Selectați programul"
                      style="width: 100%"
                      :getPopupContainer="getPopupContainer"
                    >
                      <a-select-option value="daily">Zilnic (12:00-17:30)</a-select-option>
                      <a-select-option value="vacation">Vacanță (08:00-17:30)</a-select-option>
                    </a-select>
                  </a-form-item>
                  
                  <a-form-item label="Zile pe Săptămână" name="afterschool.daysPerWeek">
                    <a-select
                      v-model:value="formData.afterschool.daysPerWeek"
                      placeholder="Selectați numărul de zile"
                      style="width: 100%"
                      @change="onDaysPerWeekChange"
                      :getPopupContainer="getPopupContainer"
                    >
                      <a-select-option value="1">1 zi/săptămână</a-select-option>
                      <a-select-option value="2">2 zile/săptămână</a-select-option>
                      <a-select-option value="3">3 zile/săptămână</a-select-option>
                      <a-select-option value="4">4 zile/săptămână</a-select-option>
                      <a-select-option value="5">5 zile/săptămână (Luni-Vineri)</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item 
                    v-if="formData.afterschool.daysPerWeek !== '5'"
                    label="Zile Preferate" 
                    name="afterschool.preferredDays"
                  >
                    <a-checkbox-group v-model:value="formData.afterschool.preferredDays">
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

                  <a-form-item label="Data Începerii" name="afterschool.startDate">
                    <a-date-picker
                      v-model:value="formData.afterschool.startDate"
                      style="width: 100%"
                      format="DD/MM/YYYY"
                      placeholder="Selectați data începerii"
                      :getPopupContainer="(trigger) => trigger.parentElement"
                      :inputReadOnly="false"
                    />
                  </a-form-item>
                </template>
              </div>

              <!-- Number of Children -->
              <div class="form-section">
                <h3>👶 Informații Copii</h3>
                <a-form-item label="Număr copii" name="numberOfChildren">
                  <a-select
                    v-model:value="formData.numberOfChildren"
                    placeholder="Selectați numărul de copii"
                    style="width: 100%"
                    @change="updateChildrenArray"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option :value="1">1</a-select-option>
                    <a-select-option :value="2">2</a-select-option>
                    <a-select-option :value="3">3</a-select-option>
                    <a-select-option :value="4">4</a-select-option>
                    <a-select-option :value="5">5</a-select-option>
                  </a-select>
                </a-form-item>
              </div>

              <!-- Children Information -->
              <div 
                v-for="(child, index) in formData.children" 
                :key="`child-${index}-${formData.children.length}`"
                class="form-section child-section"
              >
                <div class="child-divider">
                  <span>- Copil {{ index + 1 }} -</span>
                </div>
                
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item 
                      :label="'Prenume' + (index === 0 ? '*' : '')" 
                      :name="['children', index, 'firstName']"
                      :rules="index === 0 ? [{ required: true, message: 'Prenumele este obligatoriu' }] : []"
                    >
                      <a-input 
                        v-model:value="child.firstName" 
                        :placeholder="'Introduceți prenumele copilului ' + (index + 1)" 
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item 
                      :label="'Nume' + (index === 0 ? '*' : '')" 
                      :name="['children', index, 'lastName']"
                      :rules="index === 0 ? [{ required: true, message: 'Numele este obligatoriu' }] : []"
                    >
                      <a-input 
                        v-model:value="child.lastName" 
                        :placeholder="'Introduceți numele copilului ' + (index + 1)" 
                      />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :xs="24" :sm="8">
                    <a-form-item :label="'Data Nașterii' + (index === 0 ? '*' : '')" :name="['children', index, 'birthDate']">
                      <a-date-picker
                        v-model:value="child.birthDate"
                        style="width: 100%"
                        format="DD/MM/YYYY"
                        placeholder="dd.mm.yyyy"
                        @change="() => calculateAge(index)"
                        :getPopupContainer="(trigger) => trigger.parentElement"
                        :inputReadOnly="false"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="8">
                    <a-form-item :label="'Vârstă' + (index === 0 ? '*' : '')" :name="['children', index, 'age']">
                      <a-input-number
                        v-model:value="child.age"
                        style="width: 100%"
                        :min="2"
                        :max="18"
                        placeholder="Vârstă"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="8">
                    <a-form-item label="Gen" :name="['children', index, 'gender']">
                      <a-select 
                        v-model:value="child.gender" 
                        placeholder="Selectați genul"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option value="male">Băiat</a-select-option>
                        <a-select-option value="female">Fată</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="Alte informații" :name="['children', index, 'otherInfo']">
                  <a-input
                    v-model:value="child.otherInfo"
                    placeholder="Informații suplimentare despre copil"
                  />
                </a-form-item>

                <!-- Ski Level (for ski activities) -->
                <template v-if="formData.activityType === 'ski'">
                  <a-form-item label="Nivel de schi" :name="['children', index, 'skiLevel']">
                    <a-radio-group v-model:value="child.skiLevel">
                      <a-radio value="class1">Clasa 1 (nu a schiat niciodată)</a-radio>
                      <a-radio value="class2">Clasa 2 (a schiat puțin)</a-radio>
                      <a-radio value="class3">Clasa 3 (vrea perfecționare)</a-radio>
                      <a-radio value="class4">Clasa 4 (carving)</a-radio>
                    </a-radio-group>
                  </a-form-item>

                  <a-form-item label="Echipament de schi" :name="['children', index, 'skiEquipment']">
                    <p style="margin-bottom: 8px; color: #666;">Vă rugăm să selectați echipamentul de schi existent.</p>
                    <a-checkbox-group v-model:value="child.skiEquipment">
                      <a-row>
                        <a-col :span="12">
                          <a-checkbox value="helmet">Cască schi</a-checkbox>
                        </a-col>
                        <a-col :span="12">
                          <a-checkbox value="goggles">Ochelari</a-checkbox>
                        </a-col>
                        <a-col :span="12">
                          <a-checkbox value="skis">Schiuri</a-checkbox>
                        </a-col>
                        <a-col :span="12">
                          <a-checkbox value="poles">Bețe</a-checkbox>
                        </a-col>
                        <a-col :span="12">
                          <a-checkbox value="boots">Clăpari</a-checkbox>
                        </a-col>
                        <a-col :span="12">
                          <a-checkbox value="gloves">Mănuși</a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-form-item>
                </template>

                <!-- Swimming Level (for swimming activities) -->
                <template v-if="formData.activityType === 'swimming'">
                  <a-form-item label="Nivel de înot" :name="['children', index, 'swimmingLevel']">
                    <a-radio-group v-model:value="child.swimmingLevel">
                      <a-radio value="beginner">Începător</a-radio>
                      <a-radio value="intermediate">Intermediar</a-radio>
                      <a-radio value="advanced">Avansat</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </template>
              </div>

              <!-- Parent Information -->
              <div class="form-section">
                <h3>👨‍👩‍👧‍👦 Informații Părinte/Tutore</h3>
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item 
                      label="Prenume" 
                      :name="['parent', 'firstName']"
                      :rules="[{ required: true, message: 'Prenumele părintelui este obligatoriu' }]"
                    >
                      <a-input v-model:value="formData.parent.firstName" placeholder="Introduceți prenumele" />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item 
                      label="Nume" 
                      :name="['parent', 'lastName']"
                      :rules="[{ required: true, message: 'Numele părintelui este obligatoriu' }]"
                    >
                      <a-input v-model:value="formData.parent.lastName" placeholder="Introduceți numele" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item 
                      label="Telefon" 
                      :name="['parent', 'phone']"
                      :rules="[{ required: true, message: 'Telefonul este obligatoriu' }]"
                    >
                      <a-input
                        v-model:value="formData.parent.phone"
                        placeholder="Introduceți numărul de telefon"
                        :maxlength="10"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item 
                      label="Email" 
                      :name="['parent', 'email']"
                      :rules="[
                        { required: true, message: 'Email-ul este obligatoriu' },
                        { type: 'email', message: 'Email invalid' }
                      ]"
                    >
                      <a-input v-model:value="formData.parent.email" placeholder="Introduceți adresa de email" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item 
                  label="Relația" 
                  :name="['parent', 'relationship']"
                  :rules="[{ required: true, message: 'Selectați relația' }]"
                >
                  <a-select 
                    v-model:value="formData.parent.relationship" 
                    placeholder="Selectați relația"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="mother">Mamă</a-select-option>
                    <a-select-option value="father">Tată</a-select-option>
                    <a-select-option value="guardian">Tutore</a-select-option>
                    <a-select-option value="other">Altul</a-select-option>
                  </a-select>
                </a-form-item>
              </div>

              <!-- Medical Information for each child -->
              <div 
                v-for="(child, index) in formData.children" 
                :key="`medical-${index}-${formData.children.length}`"
                class="form-section medical-section"
                v-if="formData.numberOfChildren > 0"
              >
                <div class="child-divider">
                  <span>🏥 Informații Medicale - Copil {{ index + 1 }}</span>
                </div>
                
                <a-form-item :label="'Alergii Cunoscute'" :name="['children', index, 'medical', 'allergies']">
                  <a-textarea
                    v-model:value="child.medical.allergies"
                    placeholder="Specificați orice alergii (alimente, medicamente, etc.). Lăsați gol dacă nu există."
                    :rows="3"
                  />
                </a-form-item>

                <a-form-item :label="'Afecțiuni Medicale'" :name="['children', index, 'medical', 'conditions']">
                  <a-textarea
                    v-model:value="child.medical.conditions"
                    placeholder="Specificați orice afecțiuni medicale sau tratamente în curs. Lăsați gol dacă nu există."
                    :rows="3"
                  />
                </a-form-item>

                <a-form-item :label="'Medicamente Necesare'" :name="['children', index, 'medical', 'medications']">
                  <a-textarea
                    v-model:value="child.medical.medications"
                    placeholder="Specificați medicamentele pe care copilul trebuie să le ia în timpul activității. Lăsați gol dacă nu există."
                    :rows="2"
                  />
                </a-form-item>

                <a-form-item :label="'Note Speciale'" :name="['children', index, 'medical', 'notes']">
                  <a-textarea
                    v-model:value="child.medical.notes"
                    placeholder="Orice note speciale despre copil (comportament, preferințe, restricții, etc.)"
                    :rows="3"
                  />
                </a-form-item>
              </div>

              <!-- Agreements -->
              <div class="form-section">
                <h3>📋 Acorduri și Autorizații</h3>
                
                <a-form-item 
                  :name="['agreements', 'participation']"
                  :rules="agreementRules.participation"
                >
                  <a-checkbox v-model:checked="formData.agreements.participation">
                    Sunt de acord ca fiul/fiica mea să participe la activitatea menționată
                  </a-checkbox>
                </a-form-item>

                <a-form-item 
                  :name="['agreements', 'medicalTreatment']"
                  :rules="agreementRules.medicalTreatment"
                >
                  <a-checkbox v-model:checked="formData.agreements.medicalTreatment">
                    Sunt de acord cu tratamentul medical de urgență dacă este necesar
                  </a-checkbox>
                </a-form-item>

                <a-form-item 
                  :name="['agreements', 'photos']"
                  :rules="agreementRules.photos"
                >
                  <a-checkbox v-model:checked="formData.agreements.photos">
                    Sunt de acord cu fotografia și utilizarea imaginilor copilului în scopuri educaționale
                  </a-checkbox>
                </a-form-item>

                <a-form-item 
                  :name="['agreements', 'terms']"
                  :rules="agreementRules.terms"
                >
                  <a-checkbox v-model:checked="formData.agreements.terms">
                    Am citit și sunt de acord cu termenii și condițiile
                  </a-checkbox>
                </a-form-item>
              </div>

              <!-- Submit Buttons -->
              <div class="form-actions">
                <a-button size="large" @click="resetForm">
                  <ReloadOutlined />
                  Resetează
                </a-button>
                <a-button type="primary" size="large" html-type="submit" :loading="submitting">
                  <SendOutlined />
                  Trimite Înscrierea
                </a-button>
              </div>
            </a-form>
          </a-card>
        </a-col>

        <!-- Info Panel -->
        <a-col :xs="24" :lg="8">
          <div class="info-panel">
            <a-card title="ℹ️ Informații Importante" class="info-card">
              <div class="info-item">
                <h4>📅 Procesul de Înscriere</h4>
                <p>După trimiterea formularului, veți fi contactat în cel mai scurt timp.</p>
              </div>

              <div class="info-item">
                <h4>💰 Plata</h4>
                <p>Plata se face prin transfer în contul <strong style="color: #667eea; word-break: break-all;">RO94BTRLRONCRT0CP8518801</strong></p>
              </div>

              <div class="info-item">
                <h4>🚫 Anularea</h4>
                <p>Anularea este posibilă cu cel puțin 48h înainte, cu rambursare de 50%.</p>
              </div>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
  </template>

<script setup lang="ts">
// SEO Meta Tags
useHead({
  title: 'Formular de Înscriere | Înscrie-te la Activități | Roseli',
  meta: [
    { name: 'description', content: 'Formular de înscriere pentru activitățile noastre: tabere, drumeții, excursii, lecții de ski și înot, afterschool. Înscrie-te acum!' },
    { name: 'keywords', content: 'înscriere activități copii, formular înscriere, înscriere tabere, înscriere drumeții, înscriere lecții ski' },
    { property: 'og:title', content: 'Formular de Înscriere | Roseli' },
    { property: 'og:description', content: 'Înscrie-te la activitățile noastre: tabere, drumeții, excursii, lecții de ski și înot' },
    { property: 'og:url', content: 'https://activitati-copii-roseli.ro/registration' },
    { name: 'twitter:title', content: 'Formular de Înscriere | Roseli' },
    { name: 'twitter:description', content: 'Înscrie-te la activitățile noastre: tabere, drumeții, excursii, lecții de ski și înot' }
  ],
  link: [
    { rel: 'canonical', href: 'https://activitati-copii-roseli.ro/registration' }
  ]
})
import { ReloadOutlined, SendOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

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

const goHome = () => {
  router.push('/')
}

const formRef = ref()
const submitting = ref(false)
const loadingActivities = ref(false)
const loadingActivityTypes = ref(false)
const activities = ref<any[]>([])
const availableActivityTypes = ref({
  camp: false,
  hike: false,
  trip: false,
  ski: false,
  swimming: false,
  'afterschool': true, // Afterschool este întotdeauna disponibil
  'school-offer': false
})

// Agreement validation rules
const agreementRules = {
  participation: [{
    required: true,
    validator: (_rule: any, value: boolean) => {
      if (!value) {
        return Promise.reject('Trebuie să fiți de acord cu participarea copilului')
      }
      return Promise.resolve()
    }
  }],
  medicalTreatment: [{
    required: true,
    validator: (_rule: any, value: boolean) => {
      if (!value) {
        return Promise.reject('Trebuie să fiți de acord cu tratamentul medical')
      }
      return Promise.resolve()
    }
  }],
  photos: [{
    required: true,
    validator: (_rule: any, value: boolean) => {
      if (!value) {
        return Promise.reject('Trebuie să fiți de acord cu fotografia')
      }
      return Promise.resolve()
    }
  }],
  terms: [{
    required: true,
    validator: (_rule: any, value: boolean) => {
      if (!value) {
        return Promise.reject('Trebuie să fiți de acord cu termenii și condițiile')
      }
      return Promise.resolve()
    }
  }]
}

const formData = ref({
  activityType: '',
  activityId: null as string | null,
  numberOfChildren: 1,
  children: [
    {
      firstName: '',
      lastName: '',
      birthDate: null as any,
      age: null as number | null,
      gender: '',
      cnp: '',
      otherInfo: '',
      skiLevel: '',
      skiEquipment: [] as string[],
      swimmingLevel: '',
      medical: {
        allergies: '',
        conditions: '',
        medications: '',
        notes: ''
      }
    }
  ],
  parent: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    relationship: ''
  },
  agreements: {
    participation: false,
    medicalTreatment: false,
    photos: false,
    transport: false,
    terms: false
  },
  afterschool: {
    schedule: '',
    daysPerWeek: '',
    preferredDays: [] as string[],
    startDate: null as any
  }
})

const updateChildrenArray = () => {
  const newCount = formData.value.numberOfChildren || 1
  const currentCount = formData.value.children.length

  console.log('Updating children array:', { currentCount, newCount })

  if (newCount > currentCount) {
    // Add new children
    for (let i = currentCount; i < newCount; i++) {
      formData.value.children.push({
        firstName: '',
        lastName: '',
        birthDate: null,
        age: null,
        gender: '',
        cnp: '',
        otherInfo: '',
        skiLevel: '',
        skiEquipment: [],
        swimmingLevel: '',
        medical: {
          allergies: '',
          conditions: '',
          medications: '',
          notes: ''
        }
      })
    }
  } else if (newCount < currentCount) {
    // Remove extra children
    formData.value.children = formData.value.children.slice(0, newCount)
  }
  
  console.log('Children array after update:', formData.value.children.length)
}

const loadActivities = async () => {
  if (!formData.value.activityType) {
    activities.value = []
    formData.value.activityId = null
    return
  }

  loadingActivities.value = true
  try {
    let endpoint = ''
    switch (formData.value.activityType) {
      case 'camp':
        endpoint = '/api/camps'
        break
      case 'hike':
        endpoint = '/api/hikes'
        break
      case 'trip':
        endpoint = '/api/trips'
        break
      case 'ski':
        endpoint = '/api/ski'
        break
      case 'swimming':
        endpoint = '/api/swimming'
        break
      case 'afterschool':
        // Afterschool program doesn't need to load activities
        activities.value = []
        formData.value.activityId = 'afterschool-program'
        loadingActivities.value = false
        return
      case 'school-offer':
        endpoint = '/api/school-offers'
        break
    }

    if (endpoint) {
      const response = await $fetch(endpoint)
      activities.value = Array.isArray(response) ? response : []
      console.log('Loaded activities:', activities.value.length, activities.value)
    }
  } catch (error) {
    console.error('Failed to load activities:', error)
    activities.value = []
  } finally {
    loadingActivities.value = false
  }
}

const checkAvailableActivityTypes = async () => {
  loadingActivityTypes.value = true
  try {
    const checks = await Promise.all([
      $fetch('/api/camps').then((r: any) => Array.isArray(r) && r.length > 0).catch(() => false),
      $fetch('/api/hikes').then((r: any) => Array.isArray(r) && r.length > 0).catch(() => false),
      $fetch('/api/trips').then((r: any) => Array.isArray(r) && r.length > 0).catch(() => false),
      $fetch('/api/ski').then((r: any) => Array.isArray(r) && r.length > 0).catch(() => false),
      $fetch('/api/swimming').then((r: any) => Array.isArray(r) && r.length > 0).catch(() => false),
      $fetch('/api/school-offers').then((r: any) => Array.isArray(r) && r.length > 0).catch(() => false)
    ])

    availableActivityTypes.value = {
      camp: checks[0],
      hike: checks[1],
      trip: checks[2],
      ski: checks[3],
      swimming: checks[4],
      'afterschool': true, // Afterschool este întotdeauna disponibil
      'school-offer': checks[5]
    }
  } catch (error) {
    console.error('Failed to check available activity types:', error)
  } finally {
    loadingActivityTypes.value = false
  }
}

// Computed property pentru activitatea selectată
const selectedActivity = computed(() => {
  if (!formData.value.activityId || !formData.value.activityType) {
    return null
  }
  return activities.value.find((a: any) => a.id === formData.value.activityId) || null
})

const getActivityName = (activity: any) => {
  // For camps, trips, hikes - use 'name'
  if (activity.name) {
    return activity.name
  }
  // For ski/swimming lessons - use 'title' or construct from type
  if (activity.title) {
    return activity.title
  }
  // Fallback - translate type to Romanian
  if (activity.type) {
    const typeLabels: Record<string, string> = {
      'individual': 'Individuală',
      'group': 'Grup'
    }
    const translatedType = typeLabels[activity.type?.toLowerCase()] || activity.type
    return `Lecție ${translatedType}`
  }
  // Last resort - return ID if nothing else available
  return activity.id || 'Activitate Necunoscută'
}

const calculateAge = (index: number) => {
  if (formData.value.children[index]?.birthDate) {
    const birthDate = dayjs(formData.value.children[index].birthDate)
    const age = dayjs().diff(birthDate, 'year')
    formData.value.children[index].age = age
  }
}

const onDaysPerWeekChange = (value: string) => {
  // Dacă se selectează 5 zile, resetează zilele preferate (toate zilele sunt incluse)
  if (value === '5') {
    formData.value.afterschool.preferredDays = []
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    activityType: '',
    activityId: null,
    numberOfChildren: 1,
    children: [
      {
        firstName: '',
        lastName: '',
        birthDate: null,
        age: null,
        gender: '',
        cnp: '',
        otherInfo: '',
        skiLevel: '',
        skiEquipment: [],
        swimmingLevel: '',
        medical: {
          allergies: '',
          conditions: '',
          medications: '',
          notes: ''
        }
      }
    ],
    parent: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      relationship: ''
    },
    agreements: {
      participation: false,
      medicalTreatment: false,
      photos: false,
      transport: false,
      terms: false
    },
    afterschool: {
      schedule: '',
      daysPerWeek: '',
      preferredDays: [],
      startDate: null
    }
  }
}

const handleSubmit = async (values: any) => {
  // Validate form manually before submitting
  try {
    await formRef.value?.validate()
  } catch (error) {
    message.error('Completează toate câmpurile obligatorii!', 5)
    return
  }

  submitting.value = true
  try {
    // Format children data with birth dates
    const childrenData = formData.value.children.map(child => ({
      ...child,
      birthDate: child.birthDate
        ? dayjs(child.birthDate).format('YYYY-MM-DD')
        : null
    }))

    const registrationData: any = {
      ...formData.value,
      children: childrenData
    }

    // For afterschool, include the afterschool data
    if (formData.value.activityType === 'afterschool') {
      registrationData.afterschool = {
        ...formData.value.afterschool,
        startDate: formData.value.afterschool.startDate
          ? dayjs(formData.value.afterschool.startDate).format('YYYY-MM-DD')
          : null
      }
      registrationData.activityId = 'afterschool-program'
    }

    await $fetch('/api/registrations', {
      method: 'POST',
      body: registrationData
    })

    // Show success message
    // In a real app, you'd use a notification system
    alert('Înscrierea a fost trimisă cu succes! Veți fi contactat în cel mai scurt timp.')
    
    resetForm()
    router.push('/')
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Display simple validation error message
    if (error.data?.errors && Array.isArray(error.data.errors) && error.data.errors.length > 0) {
      message.error('Completează toate câmpurile!', 5)
    } else if (error.data?.formattedErrors && Array.isArray(error.data.formattedErrors) && error.data.formattedErrors.length > 0) {
      message.error('Completează toate câmpurile!', 5)
    } else if (error.message && error.message.includes('validare')) {
      message.error('Completează toate câmpurile!', 5)
    } else {
      message.error('Trimiterea înscrierii a eșuat. Vă rugăm să încercați din nou.', 5)
    }
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // Check available activity types first
  await checkAvailableActivityTypes()
  
  // Pre-fill from query params if available
  const query = route.query
  if (query.activityType) {
    formData.value.activityType = query.activityType as string
    loadActivities().then(() => {
      if (query.activityId) {
        formData.value.activityId = query.activityId as string
      }
    })
  }
})
</script>

<style scoped>
.registration-page {
  min-height: 100vh;
}

.mobile-back-button {
  display: none;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  margin: 0 -24px 40px -24px;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.form-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;
  padding: 24px;
  background: #fafafa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.child-section {
  margin-top: 24px;
  border-left: 4px solid #48c9b0;
}

.medical-section {
  border-left: 4px solid #f39c12;
}

.child-divider {
  text-align: center;
  margin: -24px -24px 24px -24px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border-radius: 12px 12px 0 0;
}

.child-section .child-divider {
  background: linear-gradient(135deg, #48c9b0 0%, #1abc9c 100%);
}

.medical-section .child-divider {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.form-section h3 {
  color: #2c3e50;
  margin-bottom: 24px;
  margin-top: 8px;
  font-size: 1.2rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 32px;
  margin-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.info-panel {
  position: sticky;
  top: 24px;
}

.info-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-item h4 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 8px;
}

.info-item p {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 992px) {
  .page-header {
    padding: 35px 0;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .info-panel {
    position: static;
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .mobile-back-button {
    display: block;
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    padding: 8px 0;
    margin: -12px -12px 16px -12px;
    padding-left: 12px;
    padding-right: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .back-btn {
    width: 100%;
    text-align: left;
    padding: 8px 16px;
    font-size: 14px;
    min-height: 44px;
  }

  .page-header {
    padding: 30px 20px;
    margin: 0 -16px 30px -16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .form-section {
    padding: 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .ant-btn {
    width: 100%;
    min-height: 44px;
    font-size: 16px;
  }
  
  /* Input-uri și select-uri touch-friendly pe mobile */
  .registration-page :deep(.ant-input),
  .registration-page :deep(.ant-input-number),
  .registration-page :deep(.ant-select-selector),
  .registration-page :deep(.ant-picker),
  .registration-page :deep(.ant-input-number-input) {
    min-height: 44px !important;
    font-size: 16px !important;
    padding: 8px 12px !important;
  }
  
  /* Textarea touch-friendly */
  .registration-page :deep(.ant-input) {
    font-size: 16px !important;
  }
  
  /* Select dropdown touch-friendly */
  .registration-page :deep(.ant-select) {
    font-size: 16px !important;
  }
  
  /* Fix pentru select - aliniere corectă a textului */
  .registration-page :deep(.ant-select-selector) {
    display: flex !important;
    align-items: center !important;
    padding: 4px 11px !important;
  }
  
  .registration-page :deep(.ant-select-selection-item) {
    line-height: normal !important;
    font-size: 16px !important;
    display: flex !important;
    align-items: center !important;
    height: auto !important;
  }
  
  .registration-page :deep(.ant-select-selection-placeholder) {
    line-height: normal !important;
    font-size: 16px !important;
    display: flex !important;
    align-items: center !important;
    height: auto !important;
  }
  
  .registration-page :deep(.ant-select-selection-search) {
    display: flex !important;
    align-items: center !important;
  }
  
  .registration-page :deep(.ant-select-selection-search-input) {
    height: auto !important;
    line-height: normal !important;
  }
  
  /* Date picker touch-friendly */
  .registration-page :deep(.ant-picker-input > input) {
    font-size: 16px !important;
    min-height: 44px !important;
  }
  
  /* Checkbox și radio touch-friendly */
  .registration-page :deep(.ant-checkbox-wrapper),
  .registration-page :deep(.ant-radio-wrapper) {
    min-height: 44px !important;
    padding: 8px 0 !important;
    font-size: 16px !important;
  }
  
  /* Form items spacing pe mobile */
  .registration-page :deep(.ant-form-item) {
    margin-bottom: 20px !important;
  }
  
  /* Card padding pe mobile */
  .registration-page .form-card {
    padding: 16px !important;
  }
  
  .registration-page :deep(.ant-card-body) {
    padding: 16px !important;
  }
  
  /* Section headers pe mobile */
  .registration-page .form-section h3 {
    font-size: 1.2rem !important;
    margin-bottom: 16px !important;
  }
  
  /* Info panel pe mobile */
  .registration-page .info-panel {
    margin-top: 24px !important;
    padding: 16px !important;
  }
  
  /* Previne zoom automat când se face focus pe input */
  .registration-page input[type="text"],
  .registration-page input[type="email"],
  .registration-page input[type="tel"],
  .registration-page input[type="number"],
  .registration-page input[type="password"],
  .registration-page textarea,
  .registration-page select {
    font-size: 16px !important;
  }
}

/* SVG icons margin */
:deep(.anticon) {
  margin-top: -6px !important;
  vertical-align: middle;
}

svg {
  margin-top: -6px !important;
  vertical-align: middle;
}

/* Activity Description Section */
.activity-description-section {
  margin-top: 16px;
  margin-bottom: 16px;
}

.activity-info-card {
  background: #f0f7ff;
  border: 1px solid #91caff;
}

.activity-description-text {
  color: #666;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
}
</style>




