// components/AuthOptions.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import { GoogleSignin, statusCodes, User as GoogleUser } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SIZES, FONTS } from '../theme';
import ApiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../types';

interface AuthOptionsProps {
  visible: boolean;
  onClose: () => void;
}

type AuthNavProp = NativeStackNavigationProp<RootStackParamList>;

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '554236244715-4qpomofhim5vncie4bsaqrl3f9hlr3o7.apps.googleusercontent.com', // From Google Console
  offlineAccess: true,
});
// Rename to avoid conflict
interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  photo: string | null;
}

export default function AuthOptions({ visible, onClose }: AuthOptionsProps) {
  const navigation = useNavigation<AuthNavProp>();
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'register'>('select');
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log("hello");
      await GoogleSignin.hasPlayServices();
      const userInfo : any = await GoogleSignin.signIn();
      console.log("hiiii");
      console.log(userInfo);
      // Fix: Access userInfo.data.user instead of userInfo.user
      //     const user: GoogleUser = {
      //   id: userInfo.id,
      //   name: userInfo.name,
      //   email: userInfo.email,
      //   photo: userInfo.picture,
      // };
        // ✅ Extract the correct data
    const profile = userInfo.user;

    const googleData = {
      googleId: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.photo,
    };

      const result = await ApiService.googleAuth(googleData);
      if (result.user) {
        onClose();
        navigation.replace('UserMain');
      } else {
        Alert.alert('Error', result.message || 'Google sign-in failed');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in in progress');
      } else {
        Alert.alert('Error', 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password || (authMode === 'register' && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (authMode === 'login') {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (result.success) {
        onClose();
        navigation.replace('UserMain');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setAuthMode('select');
  };

  const renderAuthSelection = () => (
    <View style={styles.sheet}>
      <View style={styles.grabber} />
      <Text style={styles.heading}>Continue with</Text>
      
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <FontAwesome name="google" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => setAuthMode('login')}
        >
          <FontAwesome name="envelope-o" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => setAuthMode('register')}
      >
        <Text style={styles.registerText}>Create New Account</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By continuing, you agree to Anime Flow's Terms and Privacy Policy
      </Text>

      {loading && <ActivityIndicator color={COLORS.cyan} style={styles.loader} />}
    </View>
  );

  const renderEmailForm = () => (
    <View style={styles.sheet}>
      <View style={styles.grabber} />
      <Text style={styles.heading}>
        {authMode === 'login' ? 'Sign In' : 'Create Account'}
      </Text>

      {authMode === 'register' && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
        onPress={handleEmailAuth}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Please wait...' : (authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={resetForm}
      >
        <Text style={styles.backText}>← Back to options</Text>
      </TouchableOpacity>

      {authMode === 'login' && (
        <TouchableOpacity onPress={() => setAuthMode('register')}>
          <Text style={styles.switchText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      )}

      {authMode === 'register' && (
        <TouchableOpacity onPress={() => setAuthMode('login')}>
          <Text style={styles.switchText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={() => {
        resetForm();
        onClose();
      }} 
      style={styles.modal}
    >
      {authMode === 'select' ? renderAuthSelection() : renderEmailForm()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { 
    justifyContent: 'flex-end', 
    margin: 0 
  },
  sheet: {
    backgroundColor: '#1B1B1D',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  grabber: { 
    width: 44, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#3A3A3C', 
    marginBottom: 20 
  },
  heading: { 
    color: COLORS.text, 
    fontSize: SIZES.h3, 
    marginBottom: 20, 
    fontFamily: FONTS.title 
  },
  row: { 
    flexDirection: 'row', 
    gap: 24, 
    marginBottom: 16 
  },
  iconBtn: {
    width: 66, 
    height: 66, 
    borderRadius: 14,
    backgroundColor: COLORS.cyan,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  registerButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  registerText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
  },
  input: {
    width: '100%',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    width: '100%',
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: COLORS.cyan,
    fontSize: 14,
  },
  switchText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  terms: {
    color: '#8E8E93', 
    fontSize: SIZES.small, 
    textAlign: 'center',
    marginTop: 16,
  },
  loader: {
    marginTop: 16,
  },
});
