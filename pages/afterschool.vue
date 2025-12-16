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
      <h1>📚 Centru Afterschool</h1>
    </div>

    <div class="afterschool-content">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :lg="16">
          <a-card class="info-card">
            <h2>Despre Centrul Afterschool</h2>
            <p>
              Oferim un program complet de afterschool pentru copii, cu activități educaționale și recreative.
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
            <p><strong>Luni-Vineri: 12:00-17:30</strong></p>
            <p style="font-style: italic; color: #666;">
              <strong>Mențiune*:</strong> În perioada vacanțelor școlare Luni-Vineri 8:00-17:30
            </p>

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
            <p><strong>Adresă:</strong> Str. Albatrosului Nr. 11, Avantgarden, Bartolomeu, Brașov</p>
            <p><strong>Telefon:</strong> <a href="tel:0724428883">0724428883</a></p>
            <p> <a href="https://www.facebook.com/profile.php?id=61551620890862" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" style="vertical-align: middle;">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a></p>
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

.slogan-single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .slogan-single-line {
    white-space: normal;
  }
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
  margin-bottom: 16px;
}

.contact-card a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-card a:hover {
  color: #764ba2;
  text-decoration: underline;
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

