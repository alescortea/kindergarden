<template>
  <div class="afterschool-page">
    <!-- Mobile Back Button -->
    <div class="mobile-back-button">
      <a-button type="text" @click="goHome" class="back-btn">
        <ArrowLeftOutlined />
        Înapoi la pagina principală
      </a-button>
    </div>

    <div class="page-header">
      <h1>📚 Program Afterschool (9-17)</h1>
      <p>Program complet de afterschool pentru copii, cu activități educaționale și recreative</p>
    </div>

    <div class="afterschool-content">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :lg="16">
          <a-card class="info-card">
            <h2>Despre Programul Afterschool</h2>
            <p>
              Oferim un program complet de afterschool pentru copii, cu activități educaționale și recreative 
              în intervalul 9:00 - 17:00, de luni până vineri.
            </p>
            
            <h3>Ce oferim:</h3>
            <ul>
              <li>Activități educaționale adaptate vârstei</li>
              <li>Activități recreative și sportive</li>
              <li>Asistență la teme și pregătire școlară</li>
              <li>Masă de prânz și gustări sănătoase</li>
              <li>Supraveghere de către personal calificat</li>
            </ul>

            <h3>Program:</h3>
            <ul>
              <li><strong>Program Complet:</strong> 9:00 - 17:00</li>
              <li><strong>Program Dimineață:</strong> 9:00 - 13:00</li>
              <li><strong>Program După-amiază:</strong> 13:00 - 17:00</li>
            </ul>

            <h3>Flexibilitate:</h3>
            <p>
              Puteți alege numărul de zile pe săptămână (1-5 zile) și zilele preferate (Luni-Vineri).
            </p>
          </a-card>
        </a-col>

        <a-col :xs="24" :lg="8">
          <a-card class="registration-card">
            <template #title>
              <h3>Înscrie-te Acum</h3>
            </template>
            <p>Completează formularul pentru a înscrie copilul la programul nostru de afterschool.</p>
            <a-button type="primary" size="large" block @click="navigateToRegistration">
              <FormOutlined />
              Completează Formularul
            </a-button>
          </a-card>

          <a-card class="contact-card" style="margin-top: 24px;">
            <template #title>
              <h3>Contact</h3>
            </template>
            <p>Pentru întrebări sau informații suplimentare, ne puteți contacta.</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const navigateToRegistration = () => {
  router.push({
    path: '/registration',
    query: { activityType: 'afterschool', activityId: 'afterschool-program' }
  })
}
</script>

<style scoped>
.afterschool-page {
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

.afterschool-content {
  margin-bottom: 40px;
}

.info-card,
.registration-card,
.contact-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.info-card h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.info-card h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
}

.info-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.info-card ul {
  color: #666;
  line-height: 1.8;
  margin-bottom: 16px;
  padding-left: 24px;
}

.info-card ul li {
  margin-bottom: 8px;
}

.registration-card h3,
.contact-card h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.registration-card p,
.contact-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
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
  
  .page-header p {
    font-size: 1rem;
  }
}
</style>

