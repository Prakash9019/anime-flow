// components/DonationModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import ApiService from '../services/api';

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DonationModal({ visible, onClose, onSuccess }: DonationModalProps) {
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState(false);

  const predefinedAmounts = [1, 5, 10, 25, 50];

  const handleDonate = async () => {
    const donationAmount = parseFloat(amount);
    
    if (donationAmount < 1) {
      Alert.alert('Invalid Amount', 'Minimum donation amount is $1');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ApiService.baseURL}/payment/create-donation-intent`, {
        method: 'POST',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: donationAmount }),
      });

      const { clientSecret, paymentIntentId } = await response.json();
      
      // Here you would integrate with Stripe SDK for mobile payments
      // For now, we'll simulate a successful payment
      await simulatePayment(paymentIntentId, donationAmount);
      
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = async (paymentIntentId: string, amount: number) => {
    // Simulate payment processing
    setTimeout(async () => {
      try {
        await fetch(`${ApiService.baseURL}/payment/confirm-donation`, {
          method: 'POST',
          headers: {
            ...await ApiService.getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentIntentId, amount }),
        });
        
        Alert.alert(
          'Thank You!',
          `Your donation of $${amount} has been processed successfully. You now have ad-free access!`,
          [{ text: 'OK', onPress: () => { onSuccess(); onClose(); } }]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to confirm payment');
      }
    }, 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-back" color={COLORS.text} size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Donate</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Select Amount</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter the amount to donate"
              placeholderTextColor="#666"
              value={customAmount ? amount : ''}
              onChangeText={(text) => {
                setAmount(text);
                setCustomAmount(true);
              }}
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
                    !customAmount && amount === value.toString() && styles.selectedAmount
                  ]}
                  onPress={() => {
                    setAmount(value.toString());
                    setCustomAmount(false);
                  }}
                >
                  <Text style={[
                    styles.amountButtonText,
                    !customAmount && amount === value.toString() && styles.selectedAmountText
                  ]}>
                    ${value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits of Donating:</Text>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" color={COLORS.cyan} size={20} />
                <Text style={styles.benefitText}>Ad-free anime browsing experience</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" color={COLORS.cyan} size={20} />
                <Text style={styles.benefitText}>Support app development</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" color={COLORS.cyan} size={20} />
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
              style={[styles.donateButton, { opacity: loading ? 0.7 : 1 }]}
              onPress={handleDonate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.black} size="small" />
              ) : (
                <Text style={styles.donateButtonText}>Donate ${amount || '0'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    color: COLORS.cyan,
    fontSize: 16,
    fontFamily: FONTS.title,
    marginBottom: 16,
  },
  amountInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 30,
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  amountButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedAmount: {
    backgroundColor: COLORS.cyan,
  },
  amountButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedAmountText: {
    color: COLORS.black,
  },
  benefitsContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  benefitsTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    color: COLORS.text,
    fontSize: 14,
    marginLeft: 8,
  },
  minAmount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  previewButton: {
    backgroundColor: '#666',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  previewButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  donateButton: {
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  donateButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
});
