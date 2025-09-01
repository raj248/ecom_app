import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomerServices from '~/services/CustomerServices';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type FormData = {
  email?: string;
  password?: string;
  phone?: string;
  name?: string;
};

export const useLoginSubmit = (
  mode: 'login' | 'signup' | 'forgetPassword' | 'phoneSignup' = 'login'
) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (data: FormData) => {
    setLoading(true);
    try {
      let res: any;

      if (mode === 'signup') {
        res = await CustomerServices.verifyEmailAddress(data);
        Alert.alert('Success', res.message);
      } else if (mode === 'forgetPassword') {
        res = await CustomerServices.forgetPassword({ email: data.email });
        Alert.alert('Success', res.message);
      } else if (mode === 'phoneSignup') {
        res = await CustomerServices.verifyPhoneNumber({ phone: data.phone });
        Alert.alert('Success', res.message);
      } else {
        // Login mode
        res = await CustomerServices.loginCustomer({
          email: data.email,
          password: data.password,
        });

        // Save token in AsyncStorage
        await AsyncStorage.setItem('token', res.token);
        Alert.alert('Success', 'Logged in successfully');

        // Navigate using Expo Router
        // router.push('/dashboard');
        router.push('/(tabs)');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err?.response?.data?.message || err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    register,
    errors,
    loading,
    handleSubmit,
    submitHandler,
  };
};
