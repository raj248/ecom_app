import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

const FCM_TOKEN_KEY = 'fcmToken';
const messaging = getMessaging(getApp());

/**
 * Request notification permission and get FCM token
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === 1 || // AuthorizationStatus.AUTHORIZED
      authStatus === 2; // AuthorizationStatus.PROVISIONAL

    if (!enabled) {
      console.log('Notification permission not granted');
      return null;
    }

    const token = await getToken(messaging);
    console.log('FCM Token:', token);

    if (token) {
      await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
      return token;
    }
  } catch (error) {
    console.error('Error getting FCM token', error);
  }
  return null;
};

/**
 * Load stored FCM token from AsyncStorage
 */
export const loadStoredFcmToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(FCM_TOKEN_KEY);
  } catch (error) {
    console.error('Error loading stored FCM token', error);
    return null;
  }
};

/**
 * Foreground listener
 */
export const listenForFcmMessages = () => {
  console.log('Registering for FCM messages (Foreground)...');
  return onMessage(messaging, async (remoteMessage) => {
    console.log('📩 Foreground FCM message:', remoteMessage);
  });
};

/**
 * Background handler
 * ⚠️ Must be in index.js (entry file), not inside a component!
 */
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  console.log('📩 Background FCM message:', remoteMessage);
});
