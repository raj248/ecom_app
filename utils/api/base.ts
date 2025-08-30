import Constants from 'expo-constants';

// export const BASE_URL = process.env.EXPO_PUBLIC_API_SERVER_URL;
type Extra = {
  BASE_URL: string;
};

const extra = Constants.expoConfig?.extra as Extra;
export const BASE_URL = extra.BASE_URL;

console.log('BASE_URL =', BASE_URL);

// export const getPro
