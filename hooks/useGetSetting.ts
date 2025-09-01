// hooks/useGetSetting.ts
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SettingServices from '../services/SettingServices';
import { Setting, StoreCustomizationSetting } from '~/models/Setting';
// import { storeCustomization } from "../utils/storeCustomizationSetting";

const useGetSetting = () => {
  const [lang, setLang] = useState<string | null>(null);
  const [storeCustomizationSetting, setStoreCustomizationSetting] =
    useState<StoreCustomizationSetting>();

  // Fetch global setting
  const { data: globalSetting } = useQuery({
    queryKey: ['globalSetting'],
    queryFn: async () => await SettingServices.getGlobalSetting(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });

  // Fetch store customization setting
  const {
    data,
    error,
    isFetched,
    isLoading: loading,
  } = useQuery({
    queryKey: ['storeCustomization'],
    queryFn: async () => await SettingServices.getStoreCustomizationSetting(),
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 25 * 60 * 1000,
  });

  // Manage lang persistence in AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem('_lang');
        if (savedLang) {
          setLang(savedLang);
        } else {
          await AsyncStorage.setItem('_lang', 'en');
          setLang('en');
        }
      } catch (err) {
        console.error('Failed to load or set language:', err);
        setLang('en'); // fallback
      }
    })();
  }, []);

  // Update store customization setting
  useEffect(() => {
    if (isFetched && data) {
      setStoreCustomizationSetting(data);
    }
    // else {
    //   setStoreCustomizationSetting(storeCustomization);
    // }
  }, [data, isFetched]);

  return {
    lang,
    error,
    loading,
    globalSetting,
    storeCustomizationSetting,
  };
};

export default useGetSetting;
