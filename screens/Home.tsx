// screens/Home.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES } from '../theme';
import { HomeStackParamList } from '../types';
import Logo from '../components/Logo';
import data from '../data/anime';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function Home({ navigation }: Props): React.ReactElement {
  const top = data[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size={40} />
        <TouchableOpacity style={styles.bell}>
          <Text style={{ color: '#9EA0A3' }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selector}>
        <Text style={styles.selectorTxt}>Season Selector</Text>
        <Text style={styles.chev}>▾</Text>
      </View>

      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Detail', { anime: top })}
      >
        <Image source={top.poster} style={styles.poster} />
        <View style={styles.ribbon}>
          <Text style={styles.ribbonTxt}>#1 Rated</Text>
        </View>
        <Text style={styles.score}>★ 9.7/10</Text>
        <Text style={styles.cardTitle}>{top.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 14 
  },
  bell: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#1E1E20', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  selector: { 
    margin: 16, 
    backgroundColor: '#1B1B1D', 
    borderRadius: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  selectorTxt: { 
    color: '#BEBEC2' 
  }, 
  chev: { 
    color: '#BEBEC2' 
  },
  card: { 
    marginHorizontal: 16, 
    backgroundColor: '#111', 
    borderRadius: 16, 
    overflow: 'hidden', 
    paddingBottom: 16 
  },
  poster: { 
    width: '100%', 
    height: 260 
  },
  ribbon: { 
    position: 'absolute', 
    top: 10, 
    left: 10, 
    backgroundColor: COLORS.cyan, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10 
  },
  ribbonTxt: { 
    color: '#000', 
    fontWeight: '900' 
  },
  score: { 
    color: '#00FCEB', 
    fontSize: 28, 
    fontWeight: '900', 
    textAlign: 'center', 
    marginTop: 12 
  },
  cardTitle: { 
    color: COLORS.text, 
    fontSize: SIZES.h2, 
    textAlign: 'center', 
    marginTop: 6, 
    fontFamily: FONTS.title 
  }
});
