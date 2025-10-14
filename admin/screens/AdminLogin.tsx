// screens/AdminLogin.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Logo';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';
import { RootStackParamList } from '../../types';

type AdminLoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminLogin'>;

export default function AdminLogin(): React.ReactElement {
  const navigation = useNavigation<AdminLoginNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Admin credentials check (you can customize these)
  const isValidAdmin = (email: string, password: string) => {
    const adminCredentials = [
      { email: 'theanimeflow@gmail.com', password: 'admin123456' },
      { email: 'admin@animeflow.com', password: 'AnimeFlow@2025' },
      // Add more admin credentials as needed
    ];

    return adminCredentials.some(
      admin => admin.email.toLowerCase() === email.toLowerCase() && admin.password === password
    );
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Option 1: Use hardcoded admin check (simple)
      if (isValidAdmin(email, password)) {
        // Store admin session
        await AsyncStorage.setItem('adminToken', 'admin-authenticated');
        await AsyncStorage.setItem('adminUser', JSON.stringify({
          email: email,
          // name: email.split('@')[0],
          name: "Admin",
          isAdmin: true,
          loginTime: new Date().toISOString()
        }));
        
        Alert.alert('Success', 'Welcome to Admin Panel!', [
          { text: 'Continue', onPress: () => navigation.replace('AdminMain') }
        ]);
        return;
      }

      // Option 2: Use backend authentication (advanced)
      const response = await fetch(`${ApiService.baseURL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user?.isAdmin) {
        // Store admin credentials
        await AsyncStorage.setItem('adminToken', data.token);
        await AsyncStorage.setItem('adminUser', JSON.stringify(data.user));
        
        Alert.alert('Success', `Welcome back, ${data.user.name}!`, [
          { text: 'Continue', onPress: () => navigation.replace('AdminMain') }
        ]);
      } else {
        Alert.alert('Access Denied', 'Invalid admin credentials');
      }

    } catch (error) {
      console.error('Admin login error:', error);
      // Fallback to hardcoded check if backend fails
      if (isValidAdmin(email, password)) {
        await AsyncStorage.setItem('adminToken', 'admin-authenticated-offline');
        await AsyncStorage.setItem('adminUser', JSON.stringify({
          email: email,
          name: email.split('@')[0],
          isAdmin: true,
          loginTime: new Date().toISOString()
        }));
        navigation.replace('AdminMain');
      } else {
        Alert.alert('Login Failed', 'Please check your credentials and try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Admin Password Reset',
      'Contact system administrator for password reset.\n\nEmail: support@animeflow.com',
      [{ text: 'OK' }]
    );
  };

  // / Check if we can go back
  const canGoBack = navigation.canGoBack();

  const handleBackPress = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      // If no previous screen, navigate to a specific screen
      navigation.replace('Splash'); // or 'UserMain' or wherever you want to go
    }
  };

  const handleReportError = () => {
    Alert.alert(
      'Report Error',
      'Please describe the issue you are facing:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email Support', 
          onPress: () => Alert.alert('Contact', 'Email: support@animeflow.com')
        }
      ]
    );
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    setEmail('theanimeflow@gmail.com');
    setPassword('admin123456');
  };

  const isFilled = email === 'theanimeflowOF@gmail.com' && password.length > 5;

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
          <Text style={styles.subtitle}>Admin Portal</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Log into Admin Mode</Text>
          
          {/* Demo credentials button */}
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={fillDemoCredentials}
          >
            <Text style={styles.demoText}>Fill Demo Credentials</Text>
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, isFilled && { borderColor: COLORS.cyan }]}
            placeholder={isFilled ? "theanimeflowOF@gmail.com" : "ENTER REGISTERED MAIL/ID"}
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, isFilled && { borderColor: COLORS.cyan }]}
              placeholder={isFilled ? "************" : "ENTER YOUR PASSWORD"}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
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

          <TouchableOpacity 
            style={[styles.loginButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReportError}>
            <Text style={styles.reportError}>
              Facing any problem? <Text style={{ color: COLORS.cyan }}>Report error</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to Anime Flow's{' '}
            <Text style={{ color: COLORS.cyan }}>Terms</Text> and{' '}
            <Text style={{ color: COLORS.cyan }}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => handleBackPress()}
        >
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
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
    marginBottom: 40,
  },
  title: {
    color: COLORS.cyan,
    fontSize: 32,
    fontFamily: FONTS.title,
    marginTop: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
    marginTop: 4,
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
    marginBottom: 24,
  },
  demoButton: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  demoText: {
    color: COLORS.cyan,
    fontSize: 12,
    fontFamily: FONTS.body,
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
    fontSize: 14,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 20,
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
    fontSize: 14,
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
    marginBottom: 16,
  },
  loginText: {
    color: '#000',
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: COLORS.cyan,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  reportError: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  terms: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backText: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 8,
  },
});
