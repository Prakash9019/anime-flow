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
  currentAverageRating: number;
  totalRatings: number;
  onRatingSubmitted?: () => void;
}

export default function RatingModal({ 
  visible, 
  onClose, 
  episodeId,
  currentAverageRating,
  totalRatings,
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
          size={30}
          color={i < rating ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
          style={{ marginHorizontal: 4 }}
        />
      </TouchableOpacity>
    ));
  };

  const formatRatingCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.title}>
            {submitted ? `You've Rated ${rating}/10` : 'RATE EPISODE'}
          </Text>
          
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          
          {currentAverageRating > 0 && (
            <View style={styles.avgRatingContainer}>
              <Text style={styles.avgRatingLabel}>AVG LIVE RATING</Text>
              <View style={styles.avgRatingRow}>
                <Ionicons name="star" size={16} color={COLORS.cyan} />
                <Text style={styles.avgRatingText}>
                  {currentAverageRating.toFixed(1)}/10{' '}
                </Text>
                <Text style={styles.avgRatingPercentage}>
                  ({formatRatingCount(totalRatings)})
                </Text>
              </View>
            </View>
          )}
          
          {submitted ? (
            <>
              <Text style={styles.submittedText}>Rating Submitted</Text>
              <TouchableOpacity style={styles.shareBtn} onPress={onClose}>
                <Text style={styles.shareBtnText}>Share</Text>
              </TouchableOpacity>
            </>
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
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1C1C1C', 
    borderRadius: 12,
    padding: 24, 
    width: '90%', 
    alignItems: 'center',
    maxWidth: 400,
  },
  close: { 
    position: 'absolute', 
    top: 20, 
    right: 20,
    zIndex: 10,
  },
  title: {
    color: COLORS.cyan, 
    fontSize: 18,
    fontFamily: FONTS.title, 
    marginBottom: 24,
    marginTop: 8,
    letterSpacing: 1,
  },
  starsContainer: { 
    flexDirection: 'row', 
    marginBottom: 24, 
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  avgRatingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avgRatingLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: FONTS.title,
    letterSpacing: 1,
    marginBottom: 8,
  },
  avgRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avgRatingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONTS.title,
  },
  avgRatingPercentage: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: FONTS.title,
  },
  btn: {
    backgroundColor: COLORS.cyan, 
    borderRadius: 8,
    paddingVertical: 14, 
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#000000', 
    fontFamily: FONTS.title,
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  submittedText: {
    color: COLORS.cyan, 
    fontFamily: FONTS.title,
    fontSize: 16, 
    fontStyle: 'italic', 
    marginBottom: 20,
  },
  shareBtn: {
    backgroundColor: COLORS.cyan, 
    borderRadius: 8,
    paddingVertical: 14, 
    width: '100%',
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#000000', 
    fontFamily: FONTS.title,
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
