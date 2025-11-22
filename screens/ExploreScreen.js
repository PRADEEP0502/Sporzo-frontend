import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function Explore() {
  return (
    <ScrollView style={styles.container}>

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="#C8C8C8" />
        <TextInput
          placeholder="Search turfs, tournaments, players..."
          placeholderTextColor="#C8C8C8"
          style={styles.searchInput}
        />
      </View>

      {/* CATEGORY ICONS */}
      <View style={styles.categoryRow}>
        {[
          { title: "Turfs", icon: "football-ball", type: "fa" },
          { title: "Tournaments", icon: "trophy", type: "fa" },
          { title: "Live", icon: "radio-button-on", type: "ion" },
          { title: "Highlights", icon: "play-circle", type: "ion" },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem}>
            {item.type === "fa" ? (
              <FontAwesome5 name={item.icon} size={30} color="#FFD24A" />
            ) : (
              <Ionicons name={item.icon} size={34} color="#FFD24A" />
            )}
            <Text style={styles.categoryTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* HEADER */}
      <View style={styles.sectionHeader}>
        <View style={styles.line} />
        <Text style={styles.headerText}>TRENDING TURFS</Text>
        <View style={styles.line} />
      </View>

      {/* TRENDING TURF CARDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {[300, 301, 302].map((img, i) => (
          <View key={i} style={styles.card}>
            <Image
              source={{ uri: `https://picsum.photos/${img}/300` }}
              style={styles.cardImage}
            />

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                {i === 0
                  ? "Victory Turf"
                  : i === 1
                  ? "Royal Ground"
                  : "Star Arena"}
              </Text>
              <Text style={styles.cardSub}>
                ⭐ {i === 0 ? "4.5 Palladam" : i === 1 ? "4.3 Avinashi" : "4.4 Tiruppur"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* HEADER */}
      <View style={styles.sectionHeader}>
        <View style={styles.line} />
        <Text style={styles.headerText}>POPULAR TOURNAMENTS</Text>
        <View style={styles.line} />
      </View>

      {/* TOURNAMENT CARDS */}
      <View style={styles.tournamentWrapper}>
        {[400, 401].map((img, i) => (
          <View key={i} style={styles.tournamentCard}>
            <Image
              source={{ uri: `https://picsum.photos/${img}/300` }}
              style={styles.tournamentImage}
            />
            <Text style={styles.tournamentTitle}>
              {i === 0 ? "Premier League" : "Champions Cup"}
            </Text>
            <Text style={styles.tournamentSub}>Starts Soon • Tiruppur</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#090014",
    flex: 1,
    padding: 15,
  },

  /* SEARCH BAR */
  searchBox: {
    backgroundColor: "#130425",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  searchInput: {
    color: "white",
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },

  /* CATEGORY */
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  categoryItem: {
    width: 77,
    alignItems: "center",
  },

  categoryTitle: {
    color: "white",
    fontSize: 10,
    marginTop: 8,
  },

  /* SECTION HEADER */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "center",
  },

  line: {
    height: 1,
    width: 50,
    backgroundColor: "#333",
    marginHorizontal: 10,
  },

  headerText: {
    color: "white",
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: "700",
  },

  /* TRENDING TURF CARD */
  card: {
    width: 320,
    marginRight: 15,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#130425",
  },

  cardImage: {
    width: "100%",
    height: 150,
  },

  cardInfo: {
    padding: 12,
  },

  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  cardSub: {
    color: "#FFD24A",
    marginTop: 4,
  },

  /* TOURNAMENTS */
  tournamentWrapper: {
    marginBottom: 20,
  },

  tournamentCard: {
    marginBottom: 20,
    backgroundColor: "#130425",
    borderRadius: 18,
    padding: 12,
  },

  tournamentImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
  },

  tournamentTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },

  tournamentSub: {
    color: "#FFD24A",
    marginTop: 4,
  },
});
