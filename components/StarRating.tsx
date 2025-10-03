// components/StarRating.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
  size?: number;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  editable = false, 
  size = 24 
}: StarRatingProps) {
  const [tempRating, setTempRating] = useState(rating);

  const handleStarPress = (starRating: number) => {
    if (editable && onRatingChange) {
      setTempRating(starRating);
      onRatingChange(starRating);
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handleStarPress(star)}
          disabled={!editable}
        >
          <Ionicons
            name={star <= (editable ? tempRating : rating) ? "star" : "star-outline"}
            size={size}
            color={star <= (editable ? tempRating : rating) ? "#FFD700" : "#666"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
