// components/EpisodeCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating-widget';
import { COLORS, SIZES, FONTS } from '../theme';
import { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(episode.rating);

  return (
    <>
      <View style={styles.card}>
        <Image source={episode.thumb} style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.name}>{episode.name}</Text>
          <Text style={styles.date}>{episode.date}</Text>

          <TouchableOpacity style={styles.synBtn} onPress={() => setOpen(true)}>
            <Text style={styles.synTxt}>Check Synopsis</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={styles.rateTxt}>RATE EPISODE   ★ {rating.toFixed(1)}/10</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={open} onBackdropPress={() => setOpen(false)}>
        <View style={styles.modalBox}>
          <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeX}>
            <Text style={{ color: '#999', fontSize: 20 }}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalHead}>SYNOPSIS</Text>
          <Text style={styles.synopsis}>{episode.synopsis}</Text>
          <Text style={[styles.modalHead, { marginTop: 16 }]}>RATE EPISODE</Text>
          <StarRating 
            rating={rating} 
            onChange={setRating} 
            starSize={28} 
            color={COLORS.cyan} 
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    gap: 12 
  },
  thumb: { 
    width: 110, 
    height: 72, 
    borderRadius: 10 
  },
  info: { 
    flex: 1 
  },
  name: { 
    color: COLORS.text, 
    fontSize: SIZES.h3, 
    marginBottom: 6 
  },
  date: { 
    color: '#9EA0A3', 
    fontSize: SIZES.small, 
    marginBottom: 6 
  },
  synBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cyan,
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 10, 
    marginBottom: 6
  },
  synTxt: { 
    color: '#000', 
    fontWeight: '700' 
  },
  rateTxt: { 
    color: COLORS.cyan, 
    fontSize: SIZES.body 
  },
  modalBox: {
    backgroundColor: '#161616', 
    borderRadius: 14, 
    padding: 18
  },
  closeX: { 
    position: 'absolute', 
    right: 10, 
    top: 10, 
    zIndex: 2, 
    padding: 6 
  },
  modalHead: { 
    color: COLORS.cyan, 
    fontSize: SIZES.h3, 
    textAlign: 'center', 
    marginBottom: 10, 
    fontFamily: FONTS.title 
  },
  synopsis: { 
    color: COLORS.dim, 
    fontSize: SIZES.body, 
    lineHeight: 20, 
    textAlign: 'center' 
  }
});
