# Setup Instructions

## Initial Setup

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file**
```bash
cp .env.example .env
```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore Database
   - Enable Firebase Storage
   - Get your Firebase configuration from Project Settings
   - Add configuration to `.env` file

4. **Run development server**
```bash
npm run dev
```

## Firebase Configuration Steps

### 1. Create Firestore Database
- Go to Firestore Database in Firebase Console
- Click "Create database"
- Start in production mode
- Choose a location
- Set up security rules (see README.md)

### 2. Enable Firebase Storage
- Go to Storage in Firebase Console
- Click "Get started"
- Start in production mode
- Set up security rules (see README.md)

### 3. Get Firebase Config
- Go to Project Settings > General
- Scroll to "Your apps"
- Click on Web app icon (</>) or add new web app
- Copy the configuration values to `.env`

## First Run

After installing dependencies and configuring Firebase:

1. The TypeScript errors you see are normal - Nuxt will generate types on first run
2. Run `npm run dev` - this will generate `.nuxt` folder with types
3. The errors should disappear after first build

## Common Issues

### TypeScript Errors
- Run `npm run dev` first to generate Nuxt types
- If errors persist, delete `.nuxt` folder and run again

### Firebase Connection Issues
- Verify all environment variables in `.env` are correct
- Check Firebase project settings
- Ensure Firestore and Storage are enabled

### Build Errors
- Clear `.nuxt` and `.output` folders
- Delete `node_modules` and run `npm install` again

## Next Steps

1. Set up Firestore security rules (see README.md)
2. Set up Firebase Storage security rules (see README.md)
3. Configure admin authentication (currently using localStorage - should be replaced with Firebase Auth in production)
4. Test all functionality
5. Deploy to production



