// screens/Auth.tsx
import React, { useState } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES } from '../theme';
import { RootStackParamList } from '../types';
import Logo from '../components/Logo';
import AuthOptions from '../components/AuthOptions';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function Auth({ navigation }: Props): React.ReactElement {
  const [sheet, setSheet] = useState<boolean>(false);

  return (
    <ImageBackground source={require('../assets/images/bg-collage.jpg')} style={styles.bg}>
      <View style={styles.overlay} />
      <View style={styles.center}>
        <Logo size={84} />
        <Text style={styles.title}>ANIME FLOW</Text>

        <TouchableOpacity 
          style={styles.cta} 
          onPress={() => setSheet(true)} 
          activeOpacity={0.9}
        >
          <Text style={styles.ctaTxt}>SIGN UP / LOG IN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.admin} 
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.adminTxt}>Admin Mode</Text>
        </TouchableOpacity>
      </View>

      <AuthOptions visible={sheet} onClose={() => setSheet(false)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.55)' 
  },
  center: { 
    alignItems: 'center', 
    paddingHorizontal: 24 
  },
  title: { 
    color: COLORS.cyan, 
    fontSize: SIZES.h1, 
    fontFamily: FONTS.title, 
    marginTop: 16, 
    marginBottom: 24 
  },
  cta: { 
    backgroundColor: COLORS.cyan, 
    paddingVertical: 14, 
    paddingHorizontal: 28, 
    borderRadius: 12, 
    width: '80%', 
    alignItems: 'center' 
  },
  ctaTxt: { 
    color: '#000', 
    fontWeight: '800', 
    letterSpacing: 0.5 
  },
  admin: { 
    backgroundColor: '#2C2C2E', 
    paddingVertical: 12, 
    paddingHorizontal: 28, 
    borderRadius: 12, 
    width: '80%', 
    alignItems: 'center', 
    marginTop: 12 
  },
  adminTxt: { 
    color: '#C7C7CC' 
  }
});
