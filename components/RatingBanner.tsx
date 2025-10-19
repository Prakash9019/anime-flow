// components/RatingBanner.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import Svg, { Polygon, Text as SvgText } from 'react-native-svg';


const TrapezoidBadge = ({ rank }: { rank: number }) => (
  <View
    style={{
      position: 'absolute',
      top: 0,
      alignSelf: 'center',
      zIndex: 3,
      marginVertical: 0,
    }}
  >
    <Svg height="35" width="140">
      {/* Reverse trapezium shape */}
      <Polygon points="0,0 140,0 110,35 30,35" fill="#00FFFF" />

      {/* Rank Number */}
      <SvgText
        fill="#000"
        fontSize="16"
        fontWeight="900"
        x="40"   // move left slightly
        y="22"
        textAnchor="middle"
      >
        # {rank} {"   " } {"Rated"}
      </SvgText>

      {/* "RATED" Label */}
      {/* <SvgText
        fill="#000"
        fontSize="16"
        fontWeight="1000"
        x="90"   // move right slightly
        y="22"
        textAnchor="middle"
      >
        Rated
      </SvgText> */}
    </Svg>
  </View>
);

interface RatingBannerProps {
  rating: number;      // e.g. 9.7
  label?: string;      // e.g. "WEEKLY RELEASE DAY"
}

export default function RatingBanner({ rating, label }: RatingBannerProps) {
  return (
      <TrapezoidBadge rank={rating} />

   
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  trapezoid: {
    backgroundColor: COLORS.cyan,
    paddingHorizontal: 24,
    paddingVertical: 8,
    transform: [{ skewX: '-20deg' }],
  },
  trapezoidText: {
    transform: [{ skewX: '20deg' }],
    color: '#000',
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: '900',
    letterSpacing: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: -8,
  },
  ratingText: {
    color: COLORS.cyan,
    fontSize: 20,
    fontFamily: FONTS.title,
    fontWeight: '900',
    marginLeft: 8,
    marginRight: 16,
  },
  labelText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
