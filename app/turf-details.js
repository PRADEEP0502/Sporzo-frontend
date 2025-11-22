// app/turf-details.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TurfDetails() {
  const router = useRouter();

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const dates = [
    { day: "Fri", date: 21 },
    { day: "Sat", date: 22 },
    { day: "Sun", date: 23 },
    { day: "Mon", date: 24 },
    { day: "Tue", date: 25 },
    { day: "Wed", date: 26 },
  ];

  const slotCategories = {
    Morning: ["06:00 AM", "07:00 AM", "08:00 AM"],
    Evening: ["05:00 PM", "06:00 PM"],
    Night: ["07:00 PM", "08:00 PM"],
  };

  return (
    <View style={styles.page}>
      <ScrollView style={{ flex: 1 }}>
        {/* HERO IMAGE */}
        <View>
          <Image
            // local file uploaded in conversation (use this exact path)
            source={{
              uri: "file:///mnt/data/4c32d747-65e8-4ed5-ae1c-aeaf918dcca8.jpg",
            }}
            style={styles.hero}
          />

          {/* TOP ICONS */}
          <View style={styles.topIcons}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={styles.circleBtn}>
                <Ionicons name="share-social-outline" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.circleBtn}>
                <Ionicons name="bookmark-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>🏟 Turf</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>⚽ Football</Text>
            </View>
          </View>

          <Text style={styles.title}>Victory Turf</Text>

          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="star" size={16} color="#FFD24A" />
              <Text style={styles.subText}> 4.5</Text>
            </View>

            <Text style={[styles.subText, { marginLeft: 14 }]}>Palladam</Text>
            <Text style={[styles.subText, { marginLeft: 14 }]}>• 2.5 km away</Text>
          </View>

          <Text style={styles.desc}>
            Full-size turf with floodlights, clean changing rooms and refreshments.
            Well maintained grass and synthetic options. Perfect for 7-a-side and 11-a-side matches.
          </Text>

          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <View style={styles.person}>
              <Image
                source={{ uri: "https://i.pravatar.cc/80?img=12" }}
                style={styles.personImg}
              />
              <Text style={styles.personName}>Ground Manager</Text>
            </View>

            <View style={styles.person}>
              <Image
                source={{ uri: "https://i.pravatar.cc/80?img=22" }}
                style={styles.personImg}
              />
              <Text style={styles.personName}>Coach Ravi</Text>
            </View>

            <View style={styles.person}>
              <Image
                source={{ uri: "https://i.pravatar.cc/80?img=32" }}
                style={styles.personImg}
              />
              <Text style={styles.personName}>Light Crew</Text>
            </View>
          </View>
        </View>

        {/* DATE STRIP */}
        <View style={styles.dateContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((d, i) => {
              const active = selectedDateIndex === i;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateCard, active && styles.dateCardActive]}
                  onPress={() => {
                    setSelectedDateIndex(i);
                    setSelectedSlot(null);
                  }}
                >
                  <Text style={[styles.dateMonth, active && { color: "#000" }]}>
                    NOV
                  </Text>
                  <Text style={[styles.dateNum, active && { color: "#000" }]}>
                    {d.date}
                  </Text>
                  <Text style={[styles.dateDay, active && { color: "#000" }]}>
                    {d.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* VENUE CARD */}
        <View style={styles.venueCard}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: "https://picsum.photos/80/80?random=2" }}
              style={styles.venueLogo}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.venueTitle}>Tamil Nadu Sports Ground</Text>
              <Text style={styles.venueSub}>Palladam Road, Tiruppur • Non-cancellable</Text>
            </View>
            <TouchableOpacity style={styles.saveIcon}>
              <Ionicons name="bookmark-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* IMPROVED SLOTS: Category style */}
          <Text style={styles.slotHeading}>Available Slots</Text>

          {Object.entries(slotCategories).map(([category, slots]) => (
            <View key={category} style={{ marginTop: 10 }}>
              <Text style={styles.slotCategory}>{category}</Text>
              <View style={styles.slotGrid}>
                {slots.map((s) => {
                  const isSelected = selectedSlot === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setSelectedSlot(s)}
                      style={[styles.slotBox, isSelected && styles.slotSelected]}
                    >
                      <Text style={[styles.slotText, isSelected && { color: "#000" }]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FOOTER: Selected + Book */}
      <View style={styles.footer}>
        <View>
          <Text style={{ color: "#CFCFCF", fontSize: 12 }}>Selected</Text>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            {selectedSlot ? `${dates[selectedDateIndex].day}, ${selectedSlot}` : "No slot selected"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.bookNow, !selectedSlot && { opacity: 0.6 }]}
          disabled={!selectedSlot}
          onPress={() => {
            // push to confirm booking or payment flow
            router.push({
              pathname: "/confirm-booking",
              params: { dateIndex: selectedDateIndex, slot: selectedSlot },
            });
          }}
        >
          <Text style={{ color: "#000", fontWeight: "700" }}>Book Slot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ========== STYLES ========== */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#090014" },

  hero: { width: "100%", height: 260, resizeMode: "cover" },

  topIcons: {
    position: "absolute",
    top: 40,
    left: 18,
    right: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  circleBtn: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 8,
    borderRadius: 22,
    marginHorizontal: 6,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
  },

  badgeRow: { flexDirection: "row" },

  tag: {
    backgroundColor: "#1E0A2E",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 8,
  },
  tagText: { color: "#CFCFCF", fontSize: 12 },

  title: { color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 8 },

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },

  subText: { color: "#CFCFCF", marginLeft: 6 },

  desc: { color: "#CFCFCF", marginTop: 12, lineHeight: 20 },

  person: { width: 90, alignItems: "center", marginRight: 8 },
  personImg: { width: 52, height: 52, borderRadius: 26 },
  personName: { color: "#CFCFCF", marginTop: 6, fontSize: 12, textAlign: "center" },

  dateContainer: { paddingHorizontal: 15, marginTop: 6 },

  dateCard: {
    width: 68,
    height: 86,
    borderRadius: 12,
    backgroundColor: "#0F0620",
    marginRight: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCardActive: { backgroundColor: "#FFD24A" },
  dateMonth: { color: "#CFCFCF", fontSize: 11 },
  dateNum: { color: "#fff", fontSize: 20, fontWeight: "800" },
  dateDay: { color: "#CFCFCF", fontSize: 12 },

  venueCard: {
    marginTop: 14,
    backgroundColor: "#130425",
    padding: 12,
    borderRadius: 12,
  },

  venueLogo: { width: 60, height: 60, borderRadius: 12 },
  venueTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  venueSub: { color: "#CFCFCF", marginTop: 4, fontSize: 12 },
  saveIcon: { backgroundColor: "#7A2BCB", padding: 8, borderRadius: 8 },

  /* Slots improved styles */
  slotHeading: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
  },

  slotCategory: {
    color: "#FFD24A",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
  },

  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  slotBox: {
    borderWidth: 1,
    borderColor: "#2A0E3A",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#130425",
  },

  slotSelected: {
    backgroundColor: "#FFD24A",
    borderColor: "#FFD24A",
  },

  slotText: {
    color: "#CFCFCF",
    fontWeight: "700",
  },

  footer: {
    height: 72,
    backgroundColor: "#0E0A14",
    borderTopColor: "#1C0921",
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  bookNow: {
    backgroundColor: "#FFD24A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
});
