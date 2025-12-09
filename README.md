# 🏔️ Roseli - Sport & Aventură pentru Copii

Un website modern full-stack pentru gestionarea activităților sportive și de aventură pentru copii, construit cu Nuxt 3, Firestore și Firebase Storage.

## ✨ Features

### 🏠 Public Pages
- **Home** - Beautiful landing page with activity overview
- **Camps** - View and register for summer/winter camps (Straja, Rafting, Danube Delta, Colibita)
- **Hikes** - Adventure hikes to various locations (Ciucaș Peak, Sphinx & Babele, Scropoasa Lake, etc.)
- **Trips** - Educational trips to Bucharest, Târgu Mureș, Sibiu
- **Ski Lessons** - Individual and group ski lessons
- **Swimming Lessons** - Swimming lessons at Paradisul Acvatic
- **School Offers** - Customized offers for teachers organizing trips
- **Gallery** - Photo and video gallery from activities
- **Notice Board** - Latest updates, photos and videos
- **Registration** - Comprehensive registration form for all activity types

### ⚙️ Admin Panel
- **Registrations Management** - View, edit, delete, and export registrations
- **Camps Management** - CRUD operations for camps
- **Hikes Management** - Manage hiking activities
- **Trips Management** - Manage educational trips
- **Ski Lessons Management** - Manage ski lessons
- **Swimming Lessons Management** - Manage swimming lessons
- **School Offers Management** - Manage school offers
- **Gallery Management** - Upload and manage photos/videos
- **Notice Board Management** - Add notices with photos and videos

## 🛠️ Tech Stack

- **Frontend**: Nuxt 3, Vue 3, Ant Design Vue
- **Backend**: Nuxt 3 Server API
- **Database**: Firestore (Firebase)
- **Storage**: Firebase Storage
- **Validation**: Zod
- **Export**: XLSX

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore and Storage enabled

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd roseli-sport-aventura
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Firebase configuration:
```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_ADMIN_KEY=your_admin_key_here
```

4. **Run development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Admin Access

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## 📁 Project Structure

```
roseli-sport-aventura/
├── assets/              # CSS and static assets
├── components/          # Vue components
│   ├── admin/          # Admin panel components
│   └── Layout.vue      # Main layout component
├── composables/         # Vue composables
│   ├── useFirebase.ts  # Firebase initialization
│   ├── useFirestore.ts # Firestore operations
│   └── useStorage.ts   # Firebase Storage operations
├── pages/              # Nuxt pages (auto-routing)
│   ├── admin/          # Admin pages
│   └── *.vue           # Public pages
├── server/             # Server-side code
│   └── api/            # API routes
│       ├── camps/       # Camps API
│       ├── hikes/       # Hikes API
│       ├── trips/       # Trips API
│       ├── ski/         # Ski lessons API
│       ├── swimming/    # Swimming lessons API
│       ├── registrations/ # Registrations API
│       ├── gallery/     # Gallery API
│       ├── notice-board/ # Notice board API
│       └── upload/      # File upload API
├── nuxt.config.ts      # Nuxt configuration
└── package.json        # Dependencies
```

## 🔥 Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

3. **Enable Firebase Storage**
   - Go to Storage
   - Get started
   - Set up security rules (see below)

4. **Get Firebase configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Add a web app or use existing
   - Copy configuration to `.env`

## 🔒 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all collections
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📦 Firebase Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📝 API Endpoints

### Registrations
- `GET /api/registrations` - Get all registrations (with filters)
- `POST /api/registrations` - Create new registration
- `PATCH /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Delete registration

### Camps
- `GET /api/camps` - Get all camps
- `POST /api/camps` - Create new camp
- `PATCH /api/camps/:id` - Update camp
- `DELETE /api/camps/:id` - Delete camp

### Hikes, Trips, Ski, Swimming, School Offers
- Similar CRUD endpoints for each entity

### Gallery
- `GET /api/gallery` - Get gallery items
- `POST /api/gallery` - Add gallery item

### Notice Board
- `GET /api/notice-board` - Get notices
- `POST /api/notice-board` - Add notice

### Upload
- `POST /api/upload` - Upload images/videos

### Counties
- `GET /api/counties` - Get Romanian counties list

## 🚢 Deployment

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Push code to GitHub
2. Import project in Netlify
3. Add environment variables
4. Deploy

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 📄 License

Private project - All rights reserved

## 👥 Support

For questions or support, please contact the development team.

---

Construit cu ❤️ pentru Roseli - Sport & Aventură pentru Copii
