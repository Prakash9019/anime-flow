// components/AuthOptions.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
   isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
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

GoogleSignin.configure({
  webClientId: '113504609626-na30qijm5tne0sen5bq49d0lku1hlecq.apps.googleusercontent.com', // 👈 your Web client ID
  offlineAccess: true,
});

export default function AuthOptions({ visible, onClose }: AuthOptionsProps) {
  const navigation = useNavigation<AuthNavProp>();
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'register'>('select');
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

    const handleGoogleSignIn = async () => {
    // if (loading) return;
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      console.log('Initiating Google Sign-In...');
    const response = await GoogleSignin.signIn();

    
    if (isSuccessResponse(response)) {
      console.log('Google Sign-In Response:', response);
      const userInfo = response.data?.user;
      const idToken = response.data?.idToken;

      if (!userInfo || !idToken) {
        Alert.alert('Error', 'No ID token or user info found from Google');
        setLoading(false);
        return;
      }
  
     const userPayload = {
        googleId: userInfo.id,
        name: userInfo.name ?? "",      // 👈 fallback to empty string
        email: userInfo.email,
        avatar: userInfo.photo ?? null, // null is okay because it's typed that way
      };
      console.log('Google user info:', userInfo);
      const res = await ApiService.googleAuth(userPayload);
      console.log('Login success:', res);      // await saveToken(res.data.token);

      Alert.alert('Success', 'Google login successful!');
    } else {
      Alert.alert('Cancelled', 'User cancelled sign-in flow');
    }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services not available or outdated');
      } else {
        Alert.alert('Error', `Google sign-in failed: ${error.message}`);
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
    <View style={[styles.sheet, { paddingBottom: (Platform.OS === 'ios' ? 40 : 30) + keyboardHeight }]}>
      <View style={styles.grabber} />
      <Text style={styles.heading}>Continue with</Text>
      
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <FontAwesome name="google" size={24} color="#000" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => setAuthMode('login')}
          disabled={loading}
        >
          <FontAwesome name="envelope-o" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => setAuthMode('register')}
        disabled={loading}
      >
        <Text style={styles.registerText}>Create New Account</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By continuing, you agree to Anime Flow's Terms and Privacy Policy
      </Text>
    </View>
  );

  const renderEmailForm = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.sheet, { paddingBottom: (Platform.OS === 'ios' ? 40 : 30) + keyboardHeight }]}>
        <View style={styles.grabber} />
        <Text style={styles.heading}>
          {authMode === 'login' ? 'Sign In' : 'Create Account'}
        </Text>

        <ScrollView 
          style={styles.formScrollView}
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {authMode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
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
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleEmailAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <Text style={styles.submitText}>
                {authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={resetForm}
            disabled={loading}
          >
            <Text style={styles.backText}>← Back to options</Text>
          </TouchableOpacity>

          {authMode === 'login' && (
            <TouchableOpacity onPress={() => setAuthMode('register')} disabled={loading}>
              <Text style={styles.switchText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          )}

          {authMode === 'register' && (
            <TouchableOpacity onPress={() => setAuthMode('login')} disabled={loading}>
              <Text style={styles.switchText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={() => {
        if (!loading) {
          Keyboard.dismiss();
          resetForm();
          onClose();
        }
      }} 
      style={styles.modal}
      avoidKeyboard={false}
      propagateSwipe={true}
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
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1B1B1D',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    maxHeight: '90%',
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
  formScrollView: {
    width: '100%',
    maxHeight: 400,
    flexShrink: 1,
  },
  formContainer: {
    paddingBottom: 20,
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
});