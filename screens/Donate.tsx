// screens/Donate.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DonationModal from '../components/DonationModal';
import { COLORS } from '../theme';

export default function Donate({ navigation }: any) {
  const [showDonation, setShowDonation] = useState(true);

  const handleSuccess = () => {
    setShowDonation(false);
    // Navigate to profile or home after success
    navigation.navigate('Profile');
  };

  const handleClose = () => {
    setShowDonation(false);
    // Go back to previous screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <DonationModal
        visible={showDonation}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
