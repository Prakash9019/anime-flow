// components/RatingModal.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import ApiService from '../services/api';

interface Props {
  visible: boolean;
  onClose: () => void;
  episodeId: string;
  onRatingSubmitted?: () => void;
}

export default function RatingModal({ 
  visible, 
  onClose, 
  episodeId, 
  onRatingSubmitted 
}: Props) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async () => {
    try {
      await ApiService.rateEpisode(episodeId, rating);
      setSubmitted(true);
      onRatingSubmitted?.();
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 10 }, (_, i) => (
      <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
        <Ionicons
          name={i < rating ? 'star' : 'star-outline'}
          size={32}
          color={i < rating ? COLORS.cyan : '#444'}
          style={{ marginHorizontal: 2 }}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Ionicons name="close" size={24} color="#999" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {submitted ? `You've Rated ${rating}/10` : 'RATE EPISODE'}
          </Text>
          <View style={styles.row}>{renderStars()}</View>
          {submitted ? (
            <Text style={styles.submittedText}>Rating Submitted ✓</Text>
          ) : (
            <TouchableOpacity
              style={[styles.btn, { opacity: rating ? 1 : 0.5 }]}
              disabled={!rating}
              onPress={submitRating}
            >
              <Text style={styles.btnText}>SUBMIT</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1A1A1A', borderRadius: 16,
    padding: 24, width: '85%', alignItems: 'center',
  },
  close: { position: 'absolute', top: 16, right: 16 },
  title: {
    color: COLORS.cyan, fontSize: 20,
    fontFamily: FONTS.title, marginBottom: 20,
  },
  row: { flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' },
  btn: {
    backgroundColor: COLORS.cyan, borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 48,
  },
  btnText: {
    color: COLORS.black, fontFamily: FONTS.title,
    fontSize: 16, fontWeight: 'bold',
  },
  submittedText: {
    color: COLORS.cyan, fontFamily: FONTS.title,
    fontSize: 16, fontStyle: 'italic', marginTop: 20,
  },
});
