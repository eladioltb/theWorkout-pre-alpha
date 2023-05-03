import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'theworkout.io',
  appName: 'TheWorkout',
  webDir: 'out',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  },
  server: {
    cleartext: true,
    hostname: "localhost",
    url: "https://design-the-workout-rosy.vercel.app/",
    allowNavigation: [
      'localhost',
      'https://design-the-workout-rosy.vercel.app/',
      'design-the-workout.vercel.app',
      'http://192.168.1.133:3000/'
    ]
  }
};

export default config;
