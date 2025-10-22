// // components/DonationModal.tsx
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//     ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { COLORS, FONTS } from '../theme';
// import ApiService from '../services/api';
// import { useStripe, CardField } from '@stripe/stripe-react-native';
// import PaymentModal from '../components/PaymentModal';

// interface DonationModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function DonationModal({ visible, onClose, onSuccess }: DonationModalProps) {
//   const [amount, setAmount] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const [customAmount, setCustomAmount] = useState(false);

//   const predefinedAmounts = [1, 5, 10, 25, 50];
// const [showPaymentModal, setShowPaymentModal] = useState(false);
// const [donationAmount, setDonationAmount] = useState(100);


// const handlePaymentSuccess = () => {
//   // Refresh user data to show ad-free status
//     Alert.alert(
//           'Thank You!',
//           `Your donation of $${amount} has been processed successfully. You now have ad-free access!`,
//           [{ text: 'OK', onPress: () => { onSuccess(); onClose(); } }]
//         );
// };
//   const handleDonate = async () => {
//     console.log('Donate button pressed with amount:', amount);
//     setShowPaymentModal(true);
//     // const donationAmount = parseFloat(amount);
    
//     // if (donationAmount < 1) {
//     //   Alert.alert('Invalid Amount', 'Minimum donation amount is $1');
//     //   return;
//     // }

//     // setLoading(true);
//     // try {
//     //   const response = await fetch(`${ApiService.baseURL}/payment/create-donation-intent`, {
//     //     method: 'POST',
//     //     headers: {
//     //       ...await ApiService.getAuthHeaders(),
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({ amount: donationAmount }),
//     //   });
//     //   console.log(response);
//     //   if (!response.ok) {
//     //     throw new Error('Failed to create payment intent');
//     //   }
//     //   const { clientSecret, paymentIntentId } = await response.json();
//     //   console.log(clientSecret, paymentIntentId);
      
//     //   // Here you would integrate with Stripe SDK for mobile payments
//     //   // For now, we'll simulate a successful payment
//     //   await simulatePayment(paymentIntentId, donationAmount);
      
//     // } catch (error: any) {
//     //   Alert.alert(error.message);
//     // } finally {
//     //   setLoading(false);
//     // }
//   };

//   const simulatePayment = async (paymentIntentId: string, amount: number) => {
//     // Simulate payment processing
//     setTimeout(async () => {
//       try {
//         await fetch(`${ApiService.baseURL}/payment/confirm-donation`, {
//           method: 'POST',
//           headers: {
//             ...await ApiService.getAuthHeaders(),
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ paymentIntentId, amount }),
//         });
        
//         Alert.alert(
//           'Thank You!',
//           `Your donation of $${amount} has been processed successfully. You now have ad-free access!`,
//           [{ text: 'OK', onPress: () => { onSuccess(); onClose(); } }]
//         );
//       } catch (error) {
//         Alert.alert('Error', 'Failed to confirm payment');
//       }
//     }, 2000);
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="chevron-back" color={COLORS.text} size={24} />
//             </TouchableOpacity>
//             <Text style={styles.title}>Donate</Text>
//             <View style={{ width: 24 }} />
//           </View>

//           {/* Content */}
//           <View style={styles.content}>
//             <Text style={styles.sectionTitle}>Select Amount</Text>
//             <TextInput
//               style={styles.amountInput}
//               placeholder="Enter the amount to donate"
//               placeholderTextColor="#666"
//               value={customAmount ? amount : ''}
//               onChangeText={(text) => {
//                 setAmount(text);
//                 setCustomAmount(true);
//               }}
//               keyboardType="numeric"
//               onFocus={() => setCustomAmount(true)}
//             />

//             <Text style={styles.sectionTitle}>Quick Select</Text>
//             <View style={styles.amountButtons}>
//               {predefinedAmounts.map((value) => (
//                 <TouchableOpacity
//                   key={value}
//                   style={[
//                     styles.amountButton,
//                     !customAmount && amount === value.toString() && styles.selectedAmount
//                   ]}
//                   onPress={() => {
//                     setAmount(value.toString());
//                     setCustomAmount(false);
//                   }}
//                 >
//                   <Text style={[
//                     styles.amountButtonText,
//                     !customAmount && amount === value.toString() && styles.selectedAmountText
//                   ]}>
//                     ${value}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.benefitsContainer}>
//               <Text style={styles.benefitsTitle}>Benefits of Donating:</Text>
//               <View style={styles.benefit}>
//                 <Ionicons name="checkmark-circle" color={COLORS.cyan} size={20} />
//                 <Text style={styles.benefitText}>Ad-free anime browsing experience</Text>
//               </View>
//               <View style={styles.benefit}>
//                 <Ionicons name="checkmark-circle" color={COLORS.cyan} size={20} />
//                 <Text style={styles.benefitText}>Support app development</Text>
//               </View>
//               <View style={styles.benefit}>
//                 <Ionicons name="checkmark-circle" color={COLORS.cyan} size={20} />
//                 <Text style={styles.benefitText}>Lifetime ad-free access</Text>
//               </View>
//             </View>

//             <Text style={styles.minAmount}>Min amount - $1 • Max - No limit</Text>
//           </View>

//           {/* Action Buttons */}
//           <View style={styles.actions}>
//             <TouchableOpacity style={styles.previewButton}>
//               <Text style={styles.previewButtonText}>Generate Preview</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.donateButton, { opacity: loading ? 0.7 : 1 }]}
//               onPress={handleDonate}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color={COLORS.black} size="small" />
//               ) : (
//                 <Text style={styles.donateButtonText}>Donate ${amount || '0'}</Text>
//               )}
//             </TouchableOpacity>
//                <PaymentModal
//       visible={showPaymentModal}
//       onClose={() => setShowPaymentModal(false)}
//       amount={Number(amount)}
//       onSuccess={handlePaymentSuccess}
//     />
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: COLORS.black,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.black,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 50,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   title: {
//     color: COLORS.text,
//     fontSize: 18,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 30,
//   },
//   sectionTitle: {
//     color: COLORS.cyan,
//     fontSize: 16,
//     fontFamily: FONTS.title,
//     marginBottom: 16,
//   },
//   amountInput: {
//     backgroundColor: '#333',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     color: COLORS.text,
//     fontSize: 16,
//     marginBottom: 30,
//   },
//   amountButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 30,
//   },
//   amountButton: {
//     backgroundColor: '#333',
//     borderRadius: 8,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     minWidth: 60,
//     alignItems: 'center',
//   },
//   selectedAmount: {
//     backgroundColor: COLORS.cyan,
//   },
//   amountButtonText: {
//     color: COLORS.text,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   selectedAmountText: {
//     color: COLORS.black,
//   },
//   benefitsContainer: {
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//   },
//   benefitsTitle: {
//     color: COLORS.text,
//     fontSize: 16,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//     marginBottom: 12,
//   },
//   benefit: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   benefitText: {
//     color: COLORS.text,
//     fontSize: 14,
//     marginLeft: 8,
//   },
//   minAmount: {
//     color: '#666',
//     fontSize: 12,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   actions: {
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//     gap: 12,
//   },
//   previewButton: {
//     backgroundColor: '#666',
//     borderRadius: 8,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   previewButtonText: {
//     color: COLORS.text,
//     fontSize: 16,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
//   donateButton: {
//     backgroundColor: COLORS.cyan,
//     borderRadius: 8,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   donateButtonText: {
//     color: COLORS.black,
//     fontSize: 16,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
// });

// components/DonationModal.tsx
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
import { COLORS } from '../theme'; // Assuming COLORS is defined
import PaymentModal from './PaymentModal'; // Assuming PaymentModal is in the same directory

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DonationModal({ visible, onClose, onSuccess }: DonationModalProps) {
  const [amountString, setAmountString] = useState('1');
  const [customAmount, setCustomAmount] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false); // Only used for the Donate button state

  const predefinedAmounts = [1, 5, 10, 25, 50];
  
  const donationAmount = useMemo(() => {
    const parsed = parseFloat(amountString);
    // Ensure amount is at least $1
    return isNaN(parsed) || parsed < 1 ? 0 : parsed;
  }, [amountString]);


  const handlePaymentSuccess = useCallback(() => {
    Alert.alert(
      'Thank You!',
      `Your donation of $${donationAmount.toFixed(2)} has been processed successfully. You now have ad-free access!`,
      [{ text: 'OK', onPress: () => { onSuccess(); onClose(); } }]
    );
  }, [onSuccess, onClose, donationAmount]);

  const handleDonate = () => {
    if (donationAmount < 1) {
      Alert.alert('Invalid Amount', 'Minimum donation amount is $1');
      return;
    }
    // Donation amount is valid, show payment modal
    setShowPaymentModal(true);
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

  // --- Styles implementation (minimal for brevity, use your full styles) ---
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
  // -------------------------------------------------------------------------

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
      
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={Math.round(donationAmount*100 )} // Stripe requires amount in cents/smallest unit
        onSuccess={handlePaymentSuccess}
      />
    </Modal>
  );
}

// NOTE: You must provide the full styles object for your application to render correctly.
// The styles above are minimal replacements for the old commented-out styles.

const styles = StyleSheet.create({
  // ... (styles remain the same)
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
    paddingHorizontal: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    // fontFamily: FONTS.title,
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
    // fontFamily: FONTS.title,
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
    // fontFamily: FONTS.title,
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
    // fontFamily: FONTS.title,
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
    // fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
});