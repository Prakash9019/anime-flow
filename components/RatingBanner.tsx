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
    {/* 1. Increased Svg height and width */}
    <Svg height="45" width="175">
      {/* 2. Adjusted Polygon points to match new dimensions */}
      <Polygon points="0,0 175,0 140,45 35,45" fill="#00FFFF" />

      {/* 3. Scaled and re-centered text */}
      <SvgText
        fill="#000"
        fontSize="21" // Increased font size
        fontWeight="900"
        x="45" // Adjusted x position
        y="28" // Adjusted y position
        textAnchor="middle"
      >
        # {rank} {"   "} {"Rated"}
      </SvgText>
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


// // components/RatingBanner.tsx
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { COLORS, FONTS } from '../theme';
// import { Svg, Polygon, Text as SvgText } from 'react-native-svg';

// // This component creates the chevron/banner shape
// const ChevronBadge = ({ rank }: { rank: number }) => {
//   const bannerWidth = 180;
//   const bannerHeight = 40;
//   const pointHeight = 15;
//   const totalHeight = bannerHeight + pointHeight; // 55
//   const midPoint = bannerWidth / 2; // 90

//   // Defines the 5 points of the banner shape
//   const points = `0,0 ${bannerWidth},0 ${bannerWidth},${bannerHeight} ${midPoint},${totalHeight} 0,${bannerHeight}`;

//   return (
//     <View
//       style={{
//         position: 'absolute',
//         top: 0,
//         alignSelf: 'center',
//         zIndex: 3,
//       }}
//     >
//       <Svg height={totalHeight} width={bannerWidth}>
//         <Polygon points={points} fill={COLORS.cyan} />

//         <SvgText
//           fill="#000"
//           fontSize="16"
//           fontFamily={FONTS.title} // Added font family
//           fontWeight="900"
//           x={midPoint}
//           y={bannerHeight / 2 + 6} // Adjusted Y for vertical centering
//           textAnchor="middle"
//         >
//           # {rank} Rated
//         </SvgText>
//       </Svg>
//     </View>
//   );
// };

// interface RatingBannerProps {
//   rating: number; // e.g. 1
//   label?: string; // This is no longer used by the new badge
// }

// export default function RatingBanner({ rating }: RatingBannerProps) {
//   // We only render the new badge. The other styles are not needed.
//   return <ChevronBadge rank={rating} />;
// }