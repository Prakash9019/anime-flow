import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme'; 
import PaymentModal from './PaymentModal';

// Import the PaymentMode type
type PaymentMode = 'one-time' | 'recurring';

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DonationModal({ visible, onClose, onSuccess }: DonationModalProps) {
  const [amountString, setAmountString] = useState('1');
  const [customAmount, setCustomAmount] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State to hold the user's choice
  const [paymentMode, setPaymentMode] = useState<PaymentMode | null>(null);

  const predefinedAmounts = [1, 5, 10, 25, 50];
  
  const donationAmount = useMemo(() => {
    const parsed = parseFloat(amountString);
    // Ensure amount is at least $1
    return isNaN(parsed) || parsed < 1 ? 0 : parsed;
  }, [amountString]);


  const handlePaymentSuccess = useCallback(() => {
    // We can customize this message later if needed based on mode
    Alert.alert(
      'Thank You!',
      `Your payment has been processed successfully!`,
      [{ text: 'OK', onPress: () => { onSuccess(); onClose(); } }]
    );
  }, [onSuccess, onClose]);

  // New handler to be called *after* user selects a mode
  const handleModeSelected = (mode: PaymentMode) => {
    console.log('Selected mode:', mode);
    setPaymentMode(mode);
    setShowPaymentModal(true);
  };

  const handleDonate = () => {
    if (donationAmount < 1) {
      Alert.alert('Invalid Amount', 'Minimum donation amount is $1');
      return;
    }
    
    // **CHANGE:** Show an Alert to choose the payment mode
    Alert.alert(
      'Select Donation Type',
      `Would you like to make a one-time donation of $${donationAmount.toFixed(2)} or a recurring subscription?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Recurring (Subscription)',
          onPress: () => handleModeSelected('recurring'),
        },
        {
          text: 'One-time',
          onPress: () => handleModeSelected('one-time'),
        },
      ]
    );
  };

  const handleAmountChange = (text: string) => {
    // Only allow digits and one decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    if (cleanedText.split('.').length > 2) return;
    setAmountString(cleanedText);
    setCustomAmount(true);
  };

  const handleQuickSelect = (value: number) => {
    setAmountString(value.toString());
    setCustomAmount(false);
  };

  // **CHANGE:** Update onClose for PaymentModal to reset the mode
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setPaymentMode(null); // Reset the mode
  };


  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-back" color={COLORS.text || '#FFF'} size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Donate</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Enter Amount</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter the amount to donate"
              placeholderTextColor="#666"
              value={amountString}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              onFocus={() => setCustomAmount(true)}
            />

            <Text style={styles.sectionTitle}>Quick Select</Text>
            <View style={styles.amountButtons}>
              {predefinedAmounts.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.amountButton,
                    !customAmount && amountString === value.toString() && styles.selectedAmount
                  ]}
                  onPress={() => handleQuickSelect(value)}
                >
                  <Text style={[
                    styles.amountButtonText,
                    !customAmount && amountString === value.toString() && styles.selectedAmountText
                  ]}>
                    ${value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits of Donating:</Text>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" color={COLORS.cyan || '#00FFFF'} size={20} />
                <Text style={styles.benefitText}>Ad-free anime browsing experience</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" color={COLORS.cyan || '#00FFFF'} size={20} />
                <Text style={styles.benefitText}>Support app development</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" color={COLORS.cyan || '#00FFFF'} size={20} />
                <Text style={styles.benefitText}>Lifetime ad-free access</Text>
              </View>
            </View>

            <Text style={styles.minAmount}>Min amount - $1 • Max - No limit</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Generate Preview</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.donateButton, { opacity: loading || donationAmount < 1 ? 0.7 : 1 }]}
              onPress={handleDonate}
              disabled={loading || donationAmount < 1}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.black || '#000'} size="small" />
              ) : (
                <Text style={styles.donateButtonText}>Donate ${donationAmount.toFixed(2) || '0.00'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* **CHANGES TO PaymentModal:**
        1. `visible` is now `showPaymentModal && paymentMode !== null`
        2. `mode` is passed dynamically from state: `mode={paymentMode!}`
        3. `onClose` uses the new handler: `onClose={handlePaymentModalClose}`
        4. `amount` is fixed to correctly calculate cents: `Math.round(donationAmount * 100)`
      */}
      <PaymentModal
        visible={showPaymentModal && paymentMode !== null}
        mode={paymentMode!}
        onClose={handlePaymentModalClose}
        amount={Math.round(donationAmount * 100)} 
        onSuccess={handlePaymentSuccess}
      />
    </Modal>
  );
}

// ... styles remain unchanged
const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' },
    container: { flex: 1, backgroundColor: '#111' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
    title: { color: COLORS.text || '#FFF', fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
    sectionTitle: { color: COLORS.cyan || '#00FFFF', fontSize: 16, marginBottom: 16 },
    amountInput: { backgroundColor: '#333', borderRadius: 8, padding: 16, color: COLORS.text || '#FFF', fontSize: 16, marginBottom: 30 },
    amountButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
    amountButton: { backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12, minWidth: 60, alignItems: 'center' },
    selectedAmount: { backgroundColor: COLORS.cyan || '#00FFFF' },
    amountButtonText: { color: COLORS.text || '#FFF', fontSize: 16, fontWeight: 'bold' },
    selectedAmountText: { color: COLORS.black || '#000' },
    benefitsContainer: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 20, marginBottom: 20 },
    benefitsTitle: { color: COLORS.text || '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    benefit: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    benefitText: { color: COLORS.text || '#FFF', fontSize: 14, marginLeft: 8 },
    minAmount: { color: '#666', fontSize: 12, textAlign: 'center', marginBottom: 20 },
    actions: { paddingHorizontal: 20, paddingBottom: 30, gap: 12 },
    previewButton: { backgroundColor: '#666', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
    previewButtonText: { color: COLORS.text || '#FFF', fontSize: 16, fontWeight: 'bold' },
    donateButton: { backgroundColor: COLORS.cyan || '#00FFFF', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
    donateButtonText: { color: COLORS.black || '#000', fontSize: 16, fontWeight: 'bold' },
  });