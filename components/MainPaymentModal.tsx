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
  mode: PaymentMode;
}


type CardDetailsType = {
    complete: boolean;
    brand: string;
    last4: string;
} | null;


type PaymentMethodType = 'sheet' | 'card';
type PaymentMode = 'one-time' | 'recurring';



export default function PaymentModal({ visible, onClose, amount, onSuccess,mode }: PaymentModalProps) {
  const { confirmPayment } = useStripe();
  const { initPaymentSheet, presentPaymentSheet, loading: sheetLoading } = usePaymentSheet();


  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // **NEW STATE:** Store IDs from the backend
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

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
    // **NEW:** Reset IDs
    setPaymentIntentId(null);
    setSubscriptionId(null);
    onClose();
  }, [onClose]);


  // ---------------------------------------------------------------------
  // 1. PAYMENT INTENT/SUBSCRIPTION CREATION
  // ---------------------------------------------------------------------

const initializePayment = useCallback(async () => {
  setLoading(true);
  setClientSecret(null); 
  setPaymentIntentId(null);
  setSubscriptionId(null);

  try {
    const endpoint = mode === 'recurring'
      ? `${ApiService.baseURL}/payment/create-subscription`
      : `${ApiService.baseURL}/payment/create-donation-intent`;

    // **IMPORTANT:** // For 'recurring', your backend expects a `priceId`. 
    // This example assumes a hardcoded 'price_XXXXXXX'. 
    // If you support custom recurring amounts, your backend
    // `/create-subscription` route MUST be updated to accept an `amount`
    // and create a new Stripe Price on the fly.
    const body = mode === 'recurring'
      ? { priceId: 'price_XXXXXXX' } // <-- This MUST match a real Price ID in Stripe
      : { amount };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...await ApiService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    // **CHANGE:** Store the correct IDs based on the mode
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      if (mode === 'one-time' && data.paymentIntentId) {
        setPaymentIntentId(data.paymentIntentId);
      } else if (mode === 'recurring' && data.subscriptionId) {
        setSubscriptionId(data.subscriptionId);
      } else {
        // This case handles if the backend response is missing expected IDs
        Alert.alert('Error', 'Payment initialized, but missing critical ID. Please contact support.');
        resetAndClose();
      }
    } else {
      Alert.alert('Error', data.message || 'Failed to initialize payment.');
      resetAndClose();
    }
  } catch (error) {
    Alert.alert('Error', 'Network error.');
    resetAndClose();
  } finally {
    setLoading(false);
  }
}, [amount, mode, resetAndClose]);



  useEffect(() => {
    if (visible) {
      initializePayment();
    }
  }, [visible, initializePayment]);


  // ---------------------------------------------------------------------
  // 2. PAYMENT SHEET (Apple Pay/Google Pay) SETUP
  // ---------------------------------------------------------------------

  // This function is correct as is. `initPaymentSheet` works with
  // a client_secret from either a PaymentIntent or a Subscription.
  const initializePaymentSheet = useCallback(async (secret: string) => {
    const { error }: InitPaymentSheetResult = await initPaymentSheet({
      merchantDisplayName: "AnimeFlow Donor",
      paymentIntentClientSecret: secret,
      allowsDelayedPaymentMethods: true,
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: process.env.NODE_ENV !== 'production',
        currencyCode: 'USD',
      },
      applePay: {
        merchantCountryCode: 'US',
      },
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

  // **Handler for ONE-TIME donation confirmation**
  const confirmBackendDonation = async (piId: string) => {
    try {
      await fetch(`${ApiService.baseURL}/payment/confirm-donation`, {
        method: 'POST',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        // Send the paymentIntentId and the dollar amount
        body: JSON.stringify({ paymentIntentId: piId, amount: dollarAmount }),
      });
      onSuccess();
      resetAndClose();
    } catch (e) {
      Alert.alert('Error', 'Payment succeeded but failed to confirm donation on server.');
      resetAndClose();
    }
  }

  // **NEW Handler for RECURRING subscription confirmation**
  const confirmBackendSubscription = async (subId: string) => {
    try {
      await fetch(`${ApiService.baseURL}/payment/confirm-subscription`, {
        method: 'POST',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId: subId }),
      });
      onSuccess();
      resetAndClose();
    } catch (e) {
      Alert.alert('Error', 'Payment succeeded but failed to confirm subscription on server.');
      resetAndClose();
    }
  }


  const handlePayPress = async () => {
    if (!clientSecret) {
      Alert.alert('Error', 'Payment not ready.');
      return;
    }
    
    // ========================
    // Sheet Payment
    // ========================
    if (paymentMethod === 'sheet') {
      const { error } = await presentPaymentSheet(); 

      if (error) {
        if (error.code !== PaymentSheetError.Canceled) {
          Alert.alert('Payment Failed', error.message);
        }
      } else {
        // **CHANGE:** Handle success based on payment `mode`
        if (mode === 'one-time') {
          if (!paymentIntentId) {
             Alert.alert('Error', 'Payment succeeded but ID is missing. Please contact support.');
             resetAndClose();
             return;
          }
          Alert.alert('Success', 'Payment is processing!', [
            { text: 'OK', onPress: () => confirmBackendDonation(paymentIntentId) } 
          ]);
        } else if (mode === 'recurring') {
          if (!subscriptionId) {
             Alert.alert('Error', 'Subscription started but ID is missing. Please contact support.');
             resetAndClose();
             return;
          }
          Alert.alert('Success', 'Subscription is processing!', [
            { text: 'OK', onPress: () => confirmBackendSubscription(subscriptionId) }
          ]);
        }
      }
      return;
    }


    // ========================
    // CardField Payment
    // ========================
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
        
        // **CHANGE:** Handle success based on payment `mode`
        if (mode === 'one-time') {
          Alert.alert('Payment Successful! 🎉', `Thank you for donating $${dollarAmount.toFixed(2)}!`, [
            { text: 'OK', onPress: () => confirmBackendDonation(paymentIntent.id) },
          ]);
        } else if (mode === 'recurring') {
           if (!subscriptionId) {
             Alert.alert('Error', 'Subscription paid but ID is missing. Please contact support.');
             resetAndClose();
             return;
           }
           Alert.alert('Subscription Active! 🎉', `Your subscription is now active!`, [
            { text: 'OK', onPress: () => confirmBackendSubscription(subscriptionId) },
          ]);
        }
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
            {/* **CHANGE:** Dynamic title based on mode */}
            <Text style={styles.title}>
              {mode === 'one-time' ? 'Complete Donation' : 'Complete Subscription'}
            </Text>
            <TouchableOpacity onPress={resetAndClose} disabled={loading || sheetLoading}>
              <Ionicons name="close" color={COLORS.text || '#FFFFFF'} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>
              {mode === 'one-time' ? 'Donation Amount' : 'Payment Amount'}
            </Text>
            {/* **BUG FIX:** Was `(dollarAmount*100).toFixed(2)`, now correctly `dollarAmount.toFixed(2)` */}
            <Text style={styles.amountText}>${dollarAmount.toFixed(2)}</Text>
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
                {paymentMethod === 'sheet' 
                  ? 'Pay with Wallet' 
                  : (mode === 'recurring' ? 'Subscribe' : `Pay $${dollarAmount.toFixed(2)}`)
                }
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


// ... styles remain unchanged
const styles = StyleSheet.create({
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