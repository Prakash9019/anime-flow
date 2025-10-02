// components/AuthOptions.tsx
import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../theme';

interface AuthOptionsProps {
  visible: boolean;
  onClose: () => void;
}

interface IconButtonProps {
  icon: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon }) => (
  <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
    <FontAwesome name={icon as any} size={30} color="#000" />
  </TouchableOpacity>
);

export default function AuthOptions({ visible, onClose }: AuthOptionsProps): React.ReactElement {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text style={styles.heading}>Continue with</Text>
        <View style={styles.row}>
          <IconButton icon="apple" />
          <IconButton icon="google" />
          <IconButton icon="envelope-o" />
        </View>
        <Text style={styles.terms}>
          By continuing, you agree to Anime Flow's Terms and Privacy Policy
        </Text>
      </View>
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
    alignItems: 'center'
  },
  grabber: { 
    width: 44, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#3A3A3C', 
    marginBottom: 10 
  },
  heading: { 
    color: COLORS.text, 
    fontSize: SIZES.h3, 
    marginVertical: 10, 
    fontFamily: FONTS.body 
  },
  row: { 
    flexDirection: 'row', 
    gap: 18, 
    marginTop: 10 
  },
  iconBtn: {
    width: 66, 
    height: 66, 
    borderRadius: 14,
    backgroundColor: COLORS.cyan,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  terms: {
    color: '#8E8E93', 
    fontSize: SIZES.small, 
    textAlign: 'center',
    marginTop: 16, 
    paddingHorizontal: 24
  }
});
