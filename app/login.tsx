import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginSubmit } from '~/hooks/useLoginSubmit';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { control, handleSubmit, errors, loading, submitHandler } = useLoginSubmit('login');

  const {
    control: formControl,
    handleSubmit: formHandleSubmit,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    defaultValues: { email: 'justin@gmail.com', password: '12345678' },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Login with your email and password</Text>

            <View style={{ marginTop: 20 }}>
              {/* Email Input */}
              <Controller
                control={formControl}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Feather name="mail" size={20} color="#374151" />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {formErrors.email && <Text style={styles.errorText}>{formErrors.email.message}</Text>}

              {/* Password Input */}
              <Controller
                control={formControl}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Feather name="lock" size={20} color="#374151" />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {formErrors.password && (
                <Text style={styles.errorText}>{formErrors.password.message}</Text>
              )}

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() =>
                  Alert.alert('Forgot password', 'Redirect to forgot password screen')
                }>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                disabled={loading}
                onPress={formHandleSubmit(submitHandler)}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Bottom Navigation */}
              <View style={styles.bottomNav}>
                <Text style={{ color: '#6b7280' }}>Don't have an account? </Text>
                <TouchableOpacity>
                  <Text style={{ color: '#10b981', fontWeight: '600' }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#f9fafb',
  },
  input: { flex: 1, height: 48, marginLeft: 8, color: '#111827' },
  errorText: { color: '#ef4444', marginTop: 4, fontSize: 12 },
  forgotPassword: { marginTop: 8, alignSelf: 'flex-end' },
  forgotPasswordText: { color: '#10b981', fontSize: 13 },
  button: {
    marginTop: 16,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});
