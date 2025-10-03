// screens/AdminLogin.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { COLORS, FONTS } from '../../theme';

export default function AdminLogin({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

 const handleLogin = () => {
  if (email || password) {
    navigation.replace('AdminMain'); // Updated to match RootStackParamList
  } else {
    Alert.alert('Error', 'Please fill all fields');
  }
};

  // Simulate filled state
  React.useEffect(() => {
    if (email === 'theanimeflowOF@gmail.com' && password.length > 5) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [email, password]);

  return (
    <ImageBackground 
      source={require('../../assets/images/bg-collage.jpg')} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Logo size={80} />
          <Text style={styles.title}>ANIME FLOW</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Log into Admin Mode</Text>
          
          <TextInput
            style={[styles.input, isFilled && { borderColor: COLORS.cyan }]}
            placeholder={isFilled ? "theanimeflowOF@gmail.com" : "ENTER REGISTERED MAIL/ID"}
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, isFilled && { borderColor: COLORS.cyan }]}
              placeholder={isFilled ? "************" : "ENTER YOUR PASSWORD"}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color={COLORS.cyan} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.reportError}>
              Facing any problem ? <Text style={{ color: COLORS.cyan }}>Report error</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to Anime Flow's{' '}
            <Text style={{ color: COLORS.cyan }}>Terms</Text> and{' '}
            <Text style={{ color: COLORS.cyan }}>Privacy Policy</Text>
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    color: COLORS.cyan,
    fontSize: 32,
    fontFamily: FONTS.title,
    marginTop: 16,
  },
  formContainer: {
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderRadius: 16,
    padding: 24,
  },
  formTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontFamily: FONTS.title,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: COLORS.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  passwordInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingRight: 50,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#444',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  loginButton: {
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginText: {
    color: '#000',
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  reportError: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  terms: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
