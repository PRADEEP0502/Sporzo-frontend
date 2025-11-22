// app/(tabs)/index.js
// Full Home screen with Spotlight PRO: auto-slide, fade + scale animation, exact-card style.
// Works with Expo + react-native. Replace spotlightData images with your local asset if needed.

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_WIDTH = 360; // card width used for scroll calculations
const CARD_HEIGHT = 460;

export default function HomeScreen() {
  const router = useRouter();
  const [page, setPage] = useState(0);

  /* ----------------------------
     Spotlight animated carousel
     ---------------------------- */
  const spotlightRef = useRef(null);
  const animatedX = useRef(new Animated.Value(0)).current;
  const [spotlightPage, setSpotlightPage] = useState(0);

  const spotlightData = [
    {
      img: "https://picsum.photos/900/700?random=11",
      date: "Wed, 31 Dec · 8:00 PM – Thu, 1 Jan, 12:30 AM",
      title: "Vaaichevi Virundhu – Coimbatore",
      location: "Coimbatore",
    },
    {
      img: "https://picsum.photos/900/700?random=12",
      date: "Sat, 05 Jan · 6:00 PM",
      title: "Music Fiesta – Tiruppur",
      location: "Tiruppur",
    },
    {
      img: "https://picsum.photos/900/700?random=13",
      date: "Sun, 12 Jan · 9:00 AM",
      title: "Pro Cricket League",
      location: "Avinashi",
    },
  ];

  // auto slide
  useEffect(() => {
    const id = setInterval(() => {
      const next = (spotlightPage + 1) % spotlightData.length;
      setSpotlightPage(next);
      // scroll
      spotlightRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
    }, 3500);
    return () => clearInterval(id);
  }, [spotlightPage]);

  // keep animatedX in sync when user scrolls
  const onSpotlightScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: animatedX } } }],
    { useNativeDriver: true }
  );

  // Update page index from scroll events (for dots)
  const onSpotlightMomentum = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const current = Math.round(x / CARD_WIDTH);
    setSpotlightPage(current);
  };

  /* ----------------------------
     Featured turfs (simple)
     ---------------------------- */
  const featured = [
    { id: 1, title: "Victory Turf", sub: "⭐ 4.5 • Palladam", img: "https://picsum.photos/600/360?random=21" },
    { id: 2, title: "Royal Ground", sub: "⭐ 4.3 • Avinashi", img: "https://picsum.photos/600/360?random=22" },
    { id: 3, title: "Star Arena", sub: "⭐ 4.4 • Tiruppur", img: "https://picsum.photos/600/360?random=23" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Top bar */}
      <View style={styles.topRow}>
        <TouchableOpacity>
          <Text style={styles.locationText}>Tiruppur ▼</Text>
        </TouchableOpacity>

        <View style={styles.topIcons}>
          <Ionicons name="notifications-outline" size={26} color="white" />
          <Ionicons name="person-circle-outline" size={32} color="white" style={{ marginLeft: 10 }} />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="#C8C8C8" />
        <TextInput placeholder="Search Turfs, Tournaments, Players..." placeholderTextColor="#C8C8C8" style={styles.searchInput} />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
        {[
          { label: "Turfs", icon: "football-ball", type: "fa" },
          { label: "Tournaments", icon: "trophy", type: "fa" },
          { label: "Offers", icon: "percentage", type: "fa" },
          { label: "Leaderboard", icon: "chart-bar", type: "fa" },
        ].map((item, i) => (
          <View key={i} style={styles.categoryItem}>
            {item.type === "fa" ? <FontAwesome5 name={item.icon} size={26} color="#FFD24A" /> : <Ionicons name={item.icon} size={26} color="#FFD24A" />}
            <Text style={styles.categoryText}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tournament banner (re-added) */}
      <View style={styles.bannerWrapper}>
        {/* If you have a local image put require('../assets/images/banner.jpeg') */}
        <Image source={{ uri: "https://picsum.photos/1200/400?random=5" }} style={styles.bannerImage} />
      </View>

      {/* Featured turfs */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerLine} />
        <Text style={styles.headerText}>FEATURED TURFS NEAR YOU</Text>
        <View style={styles.headerLine} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} pagingEnabled>
        {featured.map((f, i) => (
          <View key={f.id} style={styles.featureCard}>
            <Image source={{ uri: f.img }} style={styles.featureImage} />
            <View style={styles.featureBottom}>
              <View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSub}>{f.sub}</Text>
              </View>
              <TouchableOpacity style={styles.featureBtn} onPress={() => router.push("/turf-details")}>
                <Text style={styles.featureBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots for featured */}
      <View style={[styles.dotsWrapper, { marginBottom: 18 }]}>
        {featured.map((_, i) => (
          <View key={i} style={[styles.dotSmall, { opacity: page === i ? 1 : 0.3 }]} />
        ))}
      </View>

      {/* Spotlight header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerLine} />
        <Text style={styles.headerText}>IN THE SPOTLIGHT</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Spotlight: Animated ScrollView */}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ref={spotlightRef}
        onScroll={onSpotlightScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onSpotlightMomentum}
      >
        {spotlightData.map((item, i) => {
          // derive animated values for each card based on animatedX
          const inputRange = [(i - 1) * CARD_WIDTH, i * CARD_WIDTH, (i + 1) * CARD_WIDTH];
          const scale = animatedX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92],
            extrapolate: "clamp",
          });
          const opacity = animatedX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: "clamp",
          });
          const translateY = animatedX.interpolate({
            inputRange,
            outputRange: [8, 0, 8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View key={i} style={[styles.spotlightCard, { transform: [{ scale }, { translateY }], opacity }]}>
              <Image source={{ uri: item.img }} style={styles.spotlightImage} />

              <View style={styles.spotlightDetails}>
                <Text style={styles.eventDate}>{item.date}</Text>
                <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.eventLocation}>{item.location}</Text>
              </View>

              <TouchableOpacity style={styles.bookmarkBtn}>
                <Ionicons name="bookmark-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Spotlight dots */}
      <View style={styles.dotsWrapper}>
        {spotlightData.map((_, i) => (
          <View key={i} style={[styles.dot, { opacity: spotlightPage === i ? 1 : 0.3, width: spotlightPage === i ? 12 : 6 }]} />
        ))}
      </View>
    </ScrollView>
  );
}

/* ===========================
   Styles
   =========================== */
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#090014",
    paddingTop: 16,
    paddingHorizontal: 15,
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  locationText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  topIcons: { flexDirection: "row" },

  searchBox: {
    backgroundColor: "#130425",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  searchInput: { color: "#fff", marginLeft: 12, fontSize: 15, flex: 1 },

  categoryItem: {
    backgroundColor: "#130425",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  categoryText: { color: "#fff", fontSize: 10, marginTop: 6 },

  bannerWrapper: { marginVertical: 14 },

  bannerImage: { width: "100%", height: 110, borderRadius: 18, resizeMode: "cover" },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    justifyContent: "center",
  },

  headerLine: { height: 1, width: 50, backgroundColor: "#444", marginHorizontal: 10 },

  headerText: { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 1 },

  /* Featured turfs */
  featureCard: {
    width: 330,
    backgroundColor: "#130425",
    marginRight: 14,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
  },

  featureImage: { width: "100%", height: 180 },

  featureBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    alignItems: "center",
  },

  featureTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  featureSub: { color: "#FFD24A", marginTop: 6 },

  featureBtn: { backgroundColor: "#7A2BCB", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },

  featureBtnText: { color: "#fff", fontWeight: "700" },

  dotsWrapper: { flexDirection: "row", justifyContent: "center", marginTop: 8 },

  dotSmall: { height: 6, width: 6, borderRadius: 6, backgroundColor: "#fff", marginHorizontal: 4 },

  /* Spotlight CARD (PRO) */
  spotlightCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#130425",
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 14,
  },

  spotlightImage: { width: "100%", height: 300 },

  spotlightDetails: { padding: 14 },

  eventDate: { color: "#FFD24A", fontSize: 12, marginBottom: 6 },

  eventTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },

  eventLocation: { color: "#aaa", marginTop: 6 },

  bookmarkBtn: { position: "absolute", right: 18, bottom: 18 },

  dot: { height: 6, borderRadius: 6, backgroundColor: "#fff", marginHorizontal: 6 },
});
