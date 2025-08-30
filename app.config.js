import 'dotenv/config';
console.log('Base url in app config: ', process.env.EXPO_PUBLIC_API_BASE_URL);
export default {
  expo: {
    name: 'ecom-app',
    slug: 'ecom-app',
    version: '1.0.0',
    scheme: 'ecom-app',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-dev-launcher',
        {
          launchMode: 'most-recent',
        },
      ],
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.shashankraj007281.ecomapp',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.shashankraj007281.ecomapp',
    },
    extra: {
      router: {},
      eas: {
        projectId: 'c2e0aafb-11a3-40f1-8764-b5318eaf0f2f',
      },
      BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    },
  },
};
