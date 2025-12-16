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
              @finish="handleSubmit"
            >
              <!-- Activity Selection -->
              <div class="form-section">
                <h3>🎯 Selectare Activitate</h3>
                <a-form-item label="Tip Activitate" name="activityType">
                  <a-select
                    v-model:value="formData.activityType"
                    placeholder="Selectați tipul de activitate"
                    @change="loadActivities"
                    :loading="loadingActivityTypes"
                  >
                    <a-select-option v-if="availableActivityTypes.camp" value="camp">Tabără</a-select-option>
                    <a-select-option v-if="availableActivityTypes.hike" value="hike">Drumeție</a-select-option>
                    <a-select-option v-if="availableActivityTypes.trip" value="trip">Excursie</a-select-option>
                    <a-select-option v-if="availableActivityTypes.ski" value="ski">Lecție de Ski</a-select-option>
                    <a-select-option v-if="availableActivityTypes.swimming" value="swimming">Lecție de Înot</a-select-option>
                    <a-select-option v-if="availableActivityTypes.afterschool" value="afterschool">Centru Afterschool (9-17)</a-select-option>
                    <a-select-option v-if="availableActivityTypes['school-offer']" value="school-offer">Ofertă Școlară</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item 
                  label="Selectați Activitatea" 
                  name="activityId" 
                  v-if="formData.activityType && formData.activityType !== 'afterschool'"
                >
                  <a-select
                    v-model:value="formData.activityId"
                    placeholder="Selectați activitatea specifică"
                    :loading="loadingActivities"
                    show-search
                    :filter-option="false"
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

                <!-- Afterschool Program Specific Fields -->
                <template v-if="formData.activityType === 'afterschool'">
                  <a-form-item label="Program Zilnic" name="afterschool.schedule">
                    <a-select
                      v-model:value="formData.afterschool.schedule"
                      placeholder="Selectați programul zilnic"
                      style="width: 100%"
                    >
                      <a-select-option value="full-time">Program Complet (9:00 - 17:00)</a-select-option>
                      <a-select-option value="morning">Dimineață (9:00 - 13:00)</a-select-option>
                      <a-select-option value="afternoon">După-amiază (13:00 - 17:00)</a-select-option>
                    </a-select>
                  </a-form-item>
                  
                  <a-form-item label="Zile pe Săptămână" name="afterschool.daysPerWeek">
                    <a-select
                      v-model:value="formData.afterschool.daysPerWeek"
                      placeholder="Selectați numărul de zile"
                      style="width: 100%"
                    >
                      <a-select-option value="1">1 zi/săptămână</a-select-option>
                      <a-select-option value="2">2 zile/săptămână</a-select-option>
                      <a-select-option value="3">3 zile/săptămână</a-select-option>
                      <a-select-option value="4">4 zile/săptămână</a-select-option>
                      <a-select-option value="5">5 zile/săptămână (Luni-Vineri)</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="Zile Preferate" name="afterschool.preferredDays">
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
                    />
                  </a-form-item>
                </template>
              </div>

              <!-- Child Information -->
              <div class="form-section">
                <h3>👶 Informații Copil</h3>
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Prenume" name="child.firstName">
                      <a-input v-model:value="formData.child.firstName" placeholder="Introduceți prenumele" />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Nume" name="child.lastName">
                      <a-input v-model:value="formData.child.lastName" placeholder="Introduceți numele" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :xs="24" :sm="8">
                    <a-form-item label="Data Nașterii" name="child.birthDate">
                      <a-date-picker
                        v-model:value="formData.child.birthDate"
                        style="width: 100%"
                        format="DD/MM/YYYY"
                        placeholder="Selectați data"
                        @change="calculateAge"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="8">
                    <a-form-item label="Vârstă" name="child.age">
                      <a-input-number
                        v-model:value="formData.child.age"
                        style="width: 100%"
                        :min="2"
                        :max="18"
                        placeholder="Vârstă"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="8">
                    <a-form-item label="Gen" name="child.gender">
                      <a-select v-model:value="formData.child.gender" placeholder="Selectați genul">
                        <a-select-option value="male">Băiat</a-select-option>
                        <a-select-option value="female">Fată</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="CNP (Opțional)" name="child.cnp">
                  <a-input
                    v-model:value="formData.child.cnp"
                    placeholder="Introduceți CNP-ul"
                    :maxlength="13"
                  />
                </a-form-item>
              </div>

              <!-- Parent Information -->
              <div class="form-section">
                <h3>👨‍👩‍👧‍👦 Informații Părinte/Tutore</h3>
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Prenume" name="parent.firstName">
                      <a-input v-model:value="formData.parent.firstName" placeholder="Introduceți prenumele" />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Nume" name="parent.lastName">
                      <a-input v-model:value="formData.parent.lastName" placeholder="Introduceți numele" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Telefon" name="parent.phone">
                      <a-input
                        v-model:value="formData.parent.phone"
                        placeholder="Introduceți numărul de telefon"
                        :maxlength="10"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Email" name="parent.email">
                      <a-input v-model:value="formData.parent.email" placeholder="Introduceți adresa de email" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="Relația" name="parent.relationship">
                  <a-select v-model:value="formData.parent.relationship" placeholder="Selectați relația">
                    <a-select-option value="mother">Mamă</a-select-option>
                    <a-select-option value="father">Tată</a-select-option>
                    <a-select-option value="guardian">Tutore</a-select-option>
                    <a-select-option value="other">Altul</a-select-option>
                  </a-select>
                </a-form-item>
              </div>

              <!-- Medical Information -->
              <div class="form-section">
                <h3>🏥 Informații Medicale</h3>
                
                <a-form-item label="Alergii Cunoscute" name="medical.allergies">
                  <a-textarea
                    v-model:value="formData.medical.allergies"
                    placeholder="Specificați orice alergii (alimente, medicamente, etc.). Lăsați gol dacă nu există."
                    :rows="3"
                  />
                </a-form-item>

                <a-form-item label="Afecțiuni Medicale" name="medical.conditions">
                  <a-textarea
                    v-model:value="formData.medical.conditions"
                    placeholder="Specificați orice afecțiuni medicale sau tratamente în curs. Lăsați gol dacă nu există."
                    :rows="3"
                  />
                </a-form-item>

                <a-form-item label="Medicamente Necesare" name="medical.medications">
                  <a-textarea
                    v-model:value="formData.medical.medications"
                    placeholder="Specificați medicamentele pe care copilul trebuie să le ia în timpul activității. Lăsați gol dacă nu există."
                    :rows="2"
                  />
                </a-form-item>

                <a-form-item label="Note Speciale" name="medical.notes">
                  <a-textarea
                    v-model:value="formData.medical.notes"
                    placeholder="Orice note speciale despre copil (comportament, preferințe, restricții, etc.)"
                    :rows="3"
                  />
                </a-form-item>
              </div>

              <!-- Agreements -->
              <div class="form-section">
                <h3>📋 Acorduri și Autorizații</h3>
                
                <a-form-item name="agreements.medicalTreatment">
                  <a-checkbox v-model:checked="formData.agreements.medicalTreatment">
                    Sunt de acord cu tratamentul medical de urgență dacă este necesar
                  </a-checkbox>
                </a-form-item>

                <a-form-item name="agreements.photos">
                  <a-checkbox v-model:checked="formData.agreements.photos">
                    Sunt de acord cu fotografia și utilizarea imaginilor copilului în scopuri educaționale
                  </a-checkbox>
                </a-form-item>

                <a-form-item name="agreements.terms">
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
                <p>După trimiterea formularului, veți primi un email de confirmare în termen de 24 de ore.</p>
              </div>

              <div class="info-item">
                <h4>💰 Plata</h4>
                <p>Plata se face la locația noastră, cu cel puțin 3 zile înainte de activitate.</p>
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
import { ReloadOutlined, SendOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

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

const formData = ref({
  activityType: '',
  activityId: null as string | null,
  child: {
    firstName: '',
    lastName: '',
    birthDate: null as any,
    age: null as number | null,
    gender: '',
    cnp: ''
  },
  parent: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    relationship: ''
  },
  medical: {
    allergies: '',
    conditions: '',
    medications: '',
    notes: ''
  },
  agreements: {
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

const getActivityName = (activity: any) => {
  // For camps, trips, hikes - use 'name'
  if (activity.name) {
    return activity.name
  }
  // For ski/swimming lessons - use 'title' or construct from type
  if (activity.title) {
    return activity.title
  }
  // Fallback
  if (activity.type) {
    return `Lecție ${activity.type}`
  }
  // Last resort - return ID if nothing else available
  return activity.id || 'Activitate Necunoscută'
}

const calculateAge = () => {
  if (formData.value.child.birthDate) {
    const birthDate = dayjs(formData.value.child.birthDate)
    const age = dayjs().diff(birthDate, 'year')
    formData.value.child.age = age
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    activityType: '',
    activityId: null,
    child: {
      firstName: '',
      lastName: '',
      birthDate: null,
      age: null,
      gender: '',
      cnp: ''
    },
    parent: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      relationship: ''
    },
    medical: {
      allergies: '',
      conditions: '',
      medications: '',
      notes: ''
    },
    agreements: {
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
  submitting.value = true
  try {
    const registrationData: any = {
      ...formData.value,
      child: {
        ...formData.value.child,
        birthDate: formData.value.child.birthDate
          ? dayjs(formData.value.child.birthDate).format('YYYY-MM-DD')
          : null
      }
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
    alert('Înscrierea a fost trimisă cu succes! Veți primi un email de confirmare.')
    
    resetForm()
    router.push('/')
  } catch (error: any) {
    console.error('Registration error:', error)
    alert(error.data?.message || 'Trimiterea înscrierii a eșuat. Vă rugăm să încercați din nou.')
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
  }
}
</style>




