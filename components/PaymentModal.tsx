// // components/PaymentModal.tsx
// import React, { useState,useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import Modal from 'react-native-modal';
// import { Ionicons } from '@expo/vector-icons';
// import { useStripe, CardField } from '@stripe/stripe-react-native';
// import { COLORS, FONTS } from '../theme';
// import ApiService from '../services/api';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface PaymentModalProps {
//   visible: boolean;
//   onClose: () => void;
//   amount: number;
//   onSuccess: () => void;
// }

// export default function PaymentModal({ visible, onClose, amount, onSuccess }: PaymentModalProps) {
//       const { confirmPayment } = useStripe();
//   const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
//     const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [cardComplete, setCardComplete] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Card payment states
//   const [cardNumber, setCardNumber] = useState('');
//   const [expiryDate, setExpiryDate] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [cardName, setCardName] = useState('');
//    useEffect(() => {
//     if (visible) initializePayment();
//   }, [visible]);

//    const initializePayment = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('adminToken');
//       const res = await fetch(`${ApiService.baseURL}/user/donate`, {
//         method: 'POST',
//       headers: {
//                  ...await ApiService.getAuthHeaders(),
//                  'Content-Type': 'application/json',
//                },
//         body: JSON.stringify({ amount, paymentMethod: 'card' }),
//       });
      
//       const data = await res.json();
//       console.log(data)
//       if (data.clientSecret) {
//         setClientSecret(data.clientSecret);
//       } else {
//         Alert.alert('Error', data.message );
//         onClose();
//       }
//     } catch {
//       Alert.alert('Error', 'Network error');
//       onClose();
//     } finally {
//       setLoading(false);
//     }
//   };
//   // UPI payment states
//   const [upiId, setUpiId] = useState('');

// const formatCardNumber = (text: string) => {
//   const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/g, ''); // Remove spaces and non-digits
//   const limited = cleaned.slice(0, 16); // Max 16 digits
//   const parts = [];

//   for (let i = 0; i < limited.length; i += 4) {
//     parts.push(limited.slice(i, i + 4));
//   }

//   return parts.join(' ');
// };


//   const formatExpiryDate = (text: string) => {
//     const cleaned = text.replace(/[^0-9]/gi, '');
//     if (cleaned.length >= 2) {
//       return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
//     }
//     return cleaned;
//   };

//   const validateCardPayment = () => {
//     if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
//       Alert.alert('Error', 'Please enter a valid card number');
//       return false;
//     }
//     if (!expiryDate || expiryDate.length < 5) {
//       Alert.alert('Error', 'Please enter valid expiry date (MM/YY)');
//       return false;
//     }
//     if (!cvv || cvv.length < 3) {
//       Alert.alert('Error', 'Please enter valid CVV');
//       return false;
//     }
//     if (!cardName.trim()) {
//       Alert.alert('Error', 'Please enter cardholder name');
//       return false;
//     }
//     return true;
//   };

//   const validateUpiPayment = () => {
//     if (!upiId.includes('@')) {
//       Alert.alert('Error', 'Please enter a valid UPI ID');
//       return false;
//     }
//     return true;
//   };

//   const processPayment = async () => {
//     if (paymentMethod === 'card' && !validateCardPayment()) return;
//     if (paymentMethod === 'upi' && !validateUpiPayment()) return;

//     setLoading(true);
//     try {
//       const paymentData = {
//         amount,
//         paymentMethod,
//         ...(paymentMethod === 'card' ? {
//           cardNumber: cardNumber.replace(/\s/g, ''),
//           expiryDate,
//           cvv,
//           cardName,
//         } : {
//           upiId,
//         }),
//       };

//       const response = await fetch(`${ApiService.baseURL}/user/donate`, {
//         method: 'POST',
//         headers: {
//           ...await ApiService.getAuthHeaders(),
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(paymentData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert(
//           'Payment Successful! 🎉',
//           `Thank you for your donation of $${amount}! You now have ad-free access to Anime Flow.`,
//           [
//             {
//               text: 'Continue',
//               onPress: () => {
//                 onSuccess();
//                 onClose();
//               },
//             },
//           ]
//         );
//       } else {
//         Alert.alert('Payment Failed', result.message || 'Payment processing failed');
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//       Alert.alert('Error', 'Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setCardNumber('');
//     setExpiryDate('');
//     setCvv('');
//     setCardName('');
//     setUpiId('');
//     setPaymentMethod('card');
//   };
//    const handleConfirm = async () => {
//     if (!clientSecret || !cardComplete) return;
//     setLoading(true);
//     const { paymentIntent, error } = await confirmPayment(clientSecret, {
//       paymentMethodType: 'Card',
//     });
//     if (error) {
//       Alert.alert('Payment failed', error.message);
//     } else if (paymentIntent?.status === 'Succeeded') {
//       Alert.alert('Payment Successful!', `Thank you for donating ₹${amount}.`, [
//         { text: 'OK', onPress: () => { onSuccess(); onClose(); } },
//       ]);
//     }
//     setLoading(false);
//   };

//   return (
//     <Modal
//       isVisible={visible}
//       onBackdropPress={() => {
//         if (!loading) {
//           resetForm();
//           onClose();
//         }
//       }}
//       style={styles.modal}
//     >
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}
//       >
//         <View style={styles.sheet}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Complete Payment</Text>
//             <TouchableOpacity onPress={onClose} disabled={loading}>
//               <Ionicons name="close" color={COLORS.text} size={24} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.amountContainer}>
//             <Text style={styles.amountLabel}>Donation Amount</Text>
//             <Text style={styles.amountText}>${amount}</Text>
//           </View>

//           {/* Payment Method Selection */}
//           <View style={styles.paymentMethodContainer}>
//             <Text style={styles.sectionTitle}>Payment Method</Text>
//             <View style={styles.methodButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.methodButton,
//                   paymentMethod === 'card' && styles.selectedMethod,
//                 ]}
//                 onPress={() => setPaymentMethod('card')}
//                 disabled={loading}
//               >
//                 <Ionicons 
//                   name="card" 
//                   color={paymentMethod === 'card' ? (COLORS.black || '#000') : (COLORS.text || '#FFF')} 
//                   size={20} 
//                 />
//                 <Text style={[
//                   styles.methodText,
//                   paymentMethod === 'card' && styles.selectedMethodText,
//                 ]}>
//                   Credit/Debit Card
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.methodButton,
//                   paymentMethod === 'upi' && styles.selectedMethod,
//                 ]}
//                 onPress={() => setPaymentMethod('upi')}
//                 disabled={loading}
//               >
//                 <Ionicons 
//                   name="phone-portrait" 
//                   color={paymentMethod === 'upi' ? (COLORS.black || '#000') : (COLORS.text || '#FFF')} 
//                   size={20} 
//                 />
//                 <Text style={[
//                   styles.methodText,
//                   paymentMethod === 'upi' && styles.selectedMethodText,
//                 ]}>
//                   UPI
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Payment Form */}
//           {paymentMethod === 'card' ? (
//             <View style={styles.formContainer}>
//               <Text style={styles.sectionTitle}>Card Details</Text>
              
//               <TextInput
//                 style={styles.input}
//                 placeholder="Card Number"
//                 placeholderTextColor="#666"
//                 value={cardNumber}
//                 onChangeText={(text) => setCardNumber(formatCardNumber(text))}
//                 keyboardType="numeric"
//                 maxLength={19}
//                 editable={!loading}
//               />

//               <View style={styles.row}>
//                 <TextInput
//                   style={[styles.input, styles.halfInput]}
//                   placeholder="MM/YY"
//                   placeholderTextColor="#666"
//                   value={expiryDate}
//                   onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
//                   keyboardType="numeric"
//                   maxLength={5}
//                   editable={!loading}
//                 />

//                 <TextInput
//                   style={[styles.input, styles.halfInput]}
//                   placeholder="CVV"
//                   placeholderTextColor="#666"
//                   value={cvv}
//                   onChangeText={setCvv}
//                   keyboardType="numeric"
//                   maxLength={4}
//                   secureTextEntry
//                   editable={!loading}
//                 />
//               </View>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Cardholder Name"
//                 placeholderTextColor="#666"
//                 value={cardName}
//                 onChangeText={setCardName}
//                 autoCapitalize="words"
//                 editable={!loading}
//               />
//             </View>
//           ) : (
//             <View style={styles.formContainer}>
//               <Text style={styles.sectionTitle}>UPI Details</Text>
              
//               <TextInput
//                 style={styles.input}
//                 placeholder="UPI ID (e.g., user@paytm)"
//                 placeholderTextColor="#666"
//                 value={upiId}
//                 onChangeText={setUpiId}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 editable={!loading}
//               />
//             </View>
//           )}

//           {/* Payment Button */}
//           <TouchableOpacity
//             style={[styles.payButton, { opacity: loading ? 0.7 : 1 }]}
//             onPress={handleConfirm}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color={COLORS.black} />
//             ) : (
//               <Text style={styles.payButtonText}>
//                 Pay ${amount}
//               </Text>
//             )}
//           </TouchableOpacity>

//           <Text style={styles.secureText}>
//             🔒 Your payment information is secure and encrypted
//           </Text>
//         </View>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modal: {
//     justifyContent: 'flex-end',
//     margin: 0,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   sheet: {
//     backgroundColor: '#1B1B1D',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 40,
//     maxHeight: '90%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     color: COLORS.text,
//     fontSize: 20,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
//   amountContainer: {
//     backgroundColor: '#2C2C2E',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   amountLabel: {
//     color: '#999',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   amountText: {
//     color: COLORS.cyan,
//     fontSize: 32,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
//   paymentMethodContainer: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     color: COLORS.text,
//     fontSize: 16,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//     marginBottom: 12,
//   },
//   methodButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   methodButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2C2C2E',
//     padding: 16,
//     borderRadius: 12,
//     gap: 8,
//   },
//   selectedMethod: {
//     backgroundColor: COLORS.cyan,
//   },
//   methodText: {
//     color: COLORS.text,
//     fontSize: 14,
//     fontFamily: FONTS.body,
//   },
//   selectedMethodText: {
//     color: COLORS.black,
//     fontWeight: 'bold',
//   },
//   formContainer: {
//     marginBottom: 24,
//   },
//   input: {
//     backgroundColor: '#2C2C2E',
//     borderRadius: 12,
//     padding: 16,
//     color: COLORS.text,
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   halfInput: {
//     flex: 1,
//   },
//   payButton: {
//     backgroundColor: COLORS.cyan,
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   payButtonText: {
//     color: COLORS.black,
//     fontSize: 18,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
//   secureText: {
//     color: '#666',
//     fontSize: 12,
//     textAlign: 'center',
//   },
// });

// components/PaymentModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { 
  useStripe, 
  CardField, 
  usePaymentSheet,
  PaymentSheetError,
  InitPaymentSheetResult, 
} from '@stripe/stripe-react-native';
import { COLORS } from '../theme';
import ApiService from '../services/api';


interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number; // Amount in cents/smallest unit
  onSuccess: () => void;
}


type CardDetailsType = {
    complete: boolean;
    brand: string;
    last4: string;
} | null;


type PaymentMethodType = 'sheet' | 'card';


export default function PaymentModal({ visible, onClose, amount, onSuccess }: PaymentModalProps) {
  const { confirmPayment } = useStripe();
  const { initPaymentSheet, presentPaymentSheet, loading: sheetLoading } = usePaymentSheet();


  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('sheet');
  const [cardDetails, setCardDetails] = useState<CardDetailsType>(null); 
  const [loading, setLoading] = useState(false);
  
  const dollarAmount = amount / 100;
  const canPayWithCard = paymentMethod === 'card' && cardDetails?.complete && clientSecret;
  const canPayWithSheet = paymentMethod === 'sheet' && clientSecret && !sheetLoading;


  const resetAndClose = useCallback(() => {
    setClientSecret(null);
    setCardDetails(null);
    setPaymentMethod('sheet');
    onClose();
  }, [onClose]);


  // ---------------------------------------------------------------------
  // 1. PAYMENT INTENT CREATION
  // ---------------------------------------------------------------------

  const initializePayment = useCallback(async () => {
    if (amount <= 0) return;


    setLoading(true);
    setClientSecret(null); 
    try {
      const res = await fetch(`${ApiService.baseURL}/payment/create-donation-intent`, {
        method: 'POST',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }), // This 'amount' is in CENTS.
      });

     
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        Alert.alert('Error', data.message || 'Failed to initialize payment intent.');
        resetAndClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or failed to connect to server.');
      resetAndClose();
    } finally {
      setLoading(false);
    }
  }, [amount, resetAndClose]);


  useEffect(() => {
    if (visible) {
      initializePayment();
    }
  }, [visible, initializePayment]);


  // ---------------------------------------------------------------------
  // 2. PAYMENT SHEET (Apple Pay/Google Pay) SETUP - INCLUDES WALLET INITIALIZATION
  // ---------------------------------------------------------------------

  const initializePaymentSheet = useCallback(async (secret: string) => {
    const { error }: InitPaymentSheetResult = await initPaymentSheet({
      merchantDisplayName: "AnimeFlow Donor",
      paymentIntentClientSecret: secret,
      allowsDelayedPaymentMethods: true,
      
      // Configuration for Google Pay
      googlePay: {
        merchantCountryCode: 'US', // Change to your merchant country
        testEnv: process.env.NODE_ENV !== 'production', // Automatically uses test mode in development
        currencyCode: 'USD',
      },
      // Configuration for Apple Pay
      applePay: {
        merchantCountryCode: 'US', // Change to your merchant country
      },
      
      // Optional customer and billing details
      // customerId: 'some_user_id', 
      defaultBillingDetails: {
        email: 'user@example.com' 
      }
    });


    if (error) {
      console.log('Payment Sheet setup failed:', error.message);
    }
  }, [initPaymentSheet]);


  useEffect(() => {
    if (clientSecret && paymentMethod === 'sheet') {
      initializePaymentSheet(clientSecret);
    }
  }, [clientSecret, initializePaymentSheet, paymentMethod]);


  // ---------------------------------------------------------------------
  // 3. PAYMENT HANDLERS
  // ---------------------------------------------------------------------

  const confirmBackendDonation = async (paymentIntentId: string) => {
    try {
      await fetch(`${ApiService.baseURL}/payment/confirm-donation`, {
        method: 'POST',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId, amount: dollarAmount }),
      });
      onSuccess();
      resetAndClose();
    } catch (e) {
      Alert.alert('Error', 'Payment succeeded but failed to confirm donation on server.');
      resetAndClose();
    }
  }


  const handlePayPress = async () => {
    if (!clientSecret) {
      Alert.alert('Error', 'Payment not ready.');
      return;
    }
    
    // Sheet Payment
    if (paymentMethod === 'sheet') {
      const { error } = await presentPaymentSheet(); 


      if (error) {
        if (error.code !== PaymentSheetError.Canceled) {
          Alert.alert('Payment Failed', error.message);
        }
      } else {
        // Success for PaymentSheet means payment succeeded
        Alert.alert('Success', 'Payment is processing!', [
          { text: 'OK', onPress: () => confirmBackendDonation(clientSecret!) } 
        ]);
      }
      return;
    }


    // CardField Payment
    if (paymentMethod === 'card') {
      if (!cardDetails || !cardDetails.complete) {
        Alert.alert('Error', 'Please enter complete and valid card details.');
        return;
      }


      setLoading(true);
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });


      if (error) {
        Alert.alert('Payment Failed', error.message || 'Payment processing failed.');
      } else if (paymentIntent?.status === 'Succeeded') {
        Alert.alert('Payment Successful! 🎉', `Thank you for donating $${dollarAmount.toFixed(2)}!`, [
          { text: 'OK', onPress: () => confirmBackendDonation(paymentIntent.id) },
        ]);
      } else {
        Alert.alert('Payment Status', `Payment status: ${paymentIntent?.status}`);
      }
      setLoading(false);
    }
  };


  return (
    <Modal isVisible={visible} onBackdropPress={resetAndClose} style={styles.modal}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Complete Donation</Text>
            <TouchableOpacity onPress={resetAndClose} disabled={loading || sheetLoading}>
              <Ionicons name="close" color={COLORS.text || '#FFFFFF'} size={24} />
            </TouchableOpacity>
          </View>


          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Donation Amount</Text>
            <Text style={styles.amountText}>${(dollarAmount*100).toFixed(2)}</Text>
          </View>
          
          <View style={styles.methodContainer}>
            <TouchableOpacity
              style={[styles.methodButton, paymentMethod === 'sheet' && styles.selectedMethod]}
              onPress={() => setPaymentMethod('sheet')}
              disabled={loading || sheetLoading || !clientSecret}
            >
              <Ionicons name="wallet-outline" color={paymentMethod === 'sheet' ? '#000000' : '#FFFFFF'} size={20} />
              <Text style={[styles.methodText, paymentMethod === 'sheet' && styles.selectedMethodText]}>
                Wallet / Quick Pay
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[styles.methodButton, paymentMethod === 'card' && styles.selectedMethod]}
              onPress={() => setPaymentMethod('card')}
              disabled={loading || sheetLoading || !clientSecret}
            >
              <Ionicons name="card-outline" color={paymentMethod === 'card' ? '#000000' : '#FFFFFF'} size={20} />
              <Text style={[styles.methodText, paymentMethod === 'card' && styles.selectedMethodText]}>
                New Card
              </Text>
            </TouchableOpacity>
          </View>


          {paymentMethod === 'card' && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Secure Card Details</Text>
              
              {loading && !clientSecret ? (
                <View style={styles.loadingCard}>
                  <ActivityIndicator color={COLORS.cyan || '#00FFFF'} size="large" />
                  <Text style={styles.loadingText}>Initializing Payment...</Text>
                </View>
              ) : (
                <CardField
                  postalCodeEnabled={false}
                  placeholders={{ 
                    number: '4242 4242 4242 4242',
                    expiration: 'MM/YY',
                    cvc: 'CVC',
                  }}
                  cardStyle={{
                    backgroundColor: '#2C2C2E',
                    textColor: '#FFFFFF',
                    placeholderColor: '#666666',
                    fontSize: 16,
                    borderRadius: 12,
                  }}
                  style={styles.cardField}
                  // FIX: Use event.details to set the state type correctly
                  onCardChange={(event: any) => setCardDetails(event.complete ? event.details : null)} 
                  disabled={loading || sheetLoading}
                />
              )}
            </View>
          )}


          <TouchableOpacity
            style={[
              styles.payButton, 
              { opacity: (loading || sheetLoading || (!canPayWithSheet && !canPayWithCard)) ? 0.5 : 1 }
            ]}
            onPress={handlePayPress}
            disabled={loading || sheetLoading || (!canPayWithSheet && !canPayWithCard)}
          >
            {(loading || sheetLoading) ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.payButtonText}>
                {paymentMethod === 'sheet' ? 'Pay with Wallet' : `Pay $${dollarAmount.toFixed(2)}`}
              </Text>
            )}
          </TouchableOpacity>


          <Text style={styles.secureText}>
            🔒 Powered by Stripe • Secure & Encrypted
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}


const styles = StyleSheet.create({
  // ... (Your provided styles)
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: { flex: 1, justifyContent: 'flex-end' },
  sheet: { 
    backgroundColor: '#1B1B1D', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 40, 
    maxHeight: '90%' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  amountContainer: { 
    backgroundColor: '#2C2C2E', 
    padding: 20, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 24 
  },
  amountLabel: { 
    color: '#999999', 
    fontSize: 14, 
    marginBottom: 8 
  },
  amountText: { 
    color: COLORS.cyan || '#00FFFF', 
    fontSize: 32, 
    fontWeight: 'bold' 
  },
  sectionTitle: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 12 
  },
  formContainer: { 
    marginBottom: 24 
  },
  cardField: { 
    width: '100%', 
    height: 50, 
    marginVertical: 10 
  },
  loadingCard: { 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#2C2C2E', 
    borderRadius: 12, 
    flexDirection: 'row', 
    gap: 10, 
    paddingHorizontal: 15 
  },
  loadingText: { 
    color: '#FFFFFF', 
    fontSize: 16 
  },
  payButton: { 
    backgroundColor: COLORS.cyan || '#00FFFF', 
    borderRadius: 12, 
    padding: 18, 
    alignItems: 'center', 
    marginBottom: 16 
  },
  payButtonText: { 
    color: '#000000', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  secureText: { 
    color: '#666666', 
    fontSize: 12, 
    textAlign: 'center' 
  },
  methodButton: { 
    flex: 1,
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#333333', 
    marginHorizontal: 5, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMethod: { 
    backgroundColor: COLORS.cyan || '#00FFFF', 
    borderColor: COLORS.cyan || '#00FFFF' 
  },
  methodText: { 
    color: '#FFFFFF', 
    marginLeft: 8, 
    fontWeight: '600',
    fontSize: 14,
  },
  selectedMethodText: { 
    color: '#000000' 
  },
  methodContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    gap: 10,
  },
});