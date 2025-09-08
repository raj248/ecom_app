import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
  setBackgroundMessageHandler,
  getMessaging,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

const FCM_TOKEN_KEY = 'fcmToken';
const app = getApp();

const msg = getMessaging(app);

/**
 * Request notification permission and get FCM token
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permission not granted');
      return null;
    }

    const token = await messaging().getToken();
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
 * Listen to incoming FCM messages in foreground
 */
export const listenForFcmMessages = () => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('FCM message received:', remoteMessage);
    // you can show a local notification here
  });
};

// Background
setBackgroundMessageHandler(msg, async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('📩 [Background Handler] Notification:', remoteMessage);
});
