import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '~/services/httpServices';
import { LoginCustomerResponse } from '~/services/CustomerServices';

type Session = Omit<LoginCustomerResponse, 'refreshToken' | 'token'> & {
  token: string | null;
  refreshToken: string | null;
};

type SessionContextType = {
  session: Session | null;
  loading: boolean;
  login: (data: LoginCustomerResponse) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from AsyncStorage on app start
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const _id = await AsyncStorage.getItem('_id');
          const name = await AsyncStorage.getItem('name');
          const email = await AsyncStorage.getItem('email');
          const address = await AsyncStorage.getItem('address');
          const phone = await AsyncStorage.getItem('phone');
          const image = await AsyncStorage.getItem('image');

          const s: Session = {
            token,
            refreshToken,
            _id: _id || '',
            name: name || '',
            email: email || '',
            address: address || '',
            phone: phone || '',
            image: image || '',
          };
          setSession(s);
          setToken(token); // set default axios/fetch token
          console.log('loaded session. ', s.name);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (res: LoginCustomerResponse) => {
    const s: Session = { ...res };
    setToken(res.token);
    setSession(s);

    await AsyncStorage.setItem('token', res.token);
    await AsyncStorage.setItem('refreshToken', res.refreshToken);
    await AsyncStorage.setItem('_id', res._id);
    if (res.name) await AsyncStorage.setItem('name', res.name);
    if (res.email) await AsyncStorage.setItem('email', res.email);
    if (res.address) await AsyncStorage.setItem('address', res.address);
    if (res.phone) await AsyncStorage.setItem('phone', res.phone);
    if (res.image) await AsyncStorage.setItem('image', res.image);
    console.log('logged in successfully ', s.name);
  };

  const logout = async () => {
    setSession(null);
    await AsyncStorage.clear();
    setToken(undefined);
  };

  return (
    <SessionContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside a SessionProvider');
  }
  return ctx;
};
