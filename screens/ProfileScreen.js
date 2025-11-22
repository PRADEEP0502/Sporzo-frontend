import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [dark, setDark] = useState(true);
  const theme = dark ? darkTheme : lightTheme;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <View>
          <Text style={[styles.name, { color: theme.text }]}>Pradeep</Text>
          <Text style={[styles.phone, { color: theme.sub }]}>+91 XXXXXXX</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="pencil" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
        {[
          { label: "Matches", value: "34" },
          { label: "Avg Score", value: "52" },
          { label: "Rank", value: "18" },
          { label: "Teams", value: "4" },
        ].map((item, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>{item.value}</Text>
            <Text style={[styles.statLabel, { color: theme.sub }]}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Section */}
      <Section title="Bookings" theme={theme} items={[
        { icon: "calendar-outline", label: "Turf bookings" },
        { icon: "football-outline", label: "Match schedules" },
        { icon: "trophy-outline", label: "Tournament entries" },
      ]} />

      <Section title="Payments" theme={theme} items={[
        { icon: "wallet-outline", label: "Wallet" },
        { icon: "receipt-outline", label: "Transactions" },
        { icon: "refresh-circle-outline", label: "Refund status" },
      ]} />

      <Section title="Manage" theme={theme} items={[
        { icon: "people-outline", label: "Teams" },
        { icon: "podium-outline", label: "Player stats" },
        { icon: "documents-outline", label: "Match history" },
        { icon: "star-outline", label: "Your reviews" },
      ]} />

      <Section title="Settings" theme={theme} items={[
        { icon: "color-palette-outline", label: "Appearance" },
        { icon: "information-circle-outline", label: "Help & Support" },
        { icon: "shield-checkmark-outline", label: "Privacy Policy" },
      ]} />

      {/* Theme Switch */}
      <View style={styles.switchRow}>
        <Text style={[styles.switchLabel, { color: theme.text }]}>Dark mode</Text>
        <Switch value={dark} onValueChange={() => setDark(!dark)} />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({ title, theme, items }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.rowCard, { backgroundColor: theme.card }]}
        >
          <Ionicons name={item.icon} size={20} color={theme.text} />
          <Text style={[styles.rowLabel, { color: theme.text }]}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.sub} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const lightTheme = {
  bg: "#F9F9F9",
  text: "#1A1A1A",
  sub: "#6F6F6F",
  card: "#FFFFFF",
};

const darkTheme = {
  bg: "#121212",
  text: "#FFFFFF",
  sub: "#9D9D9D",
  card: "#1E1E1E",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 40,
    marginRight: 15,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
  },

  phone: {
    fontSize: 14,
    marginTop: 2,
  },

  editBtn: {
    marginLeft: "auto",
  },

  statsRow: {
    marginBottom: 20,
  },

  statCard: {
    padding: 15,
    borderRadius: 15,
    marginRight: 12,
    width: 110,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 13,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  rowCard: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  rowLabel: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 10,
  },

  switchLabel: {
    fontSize: 16,
  },

  logoutBtn: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: "center",
  },

  logoutText: {
    color: "red",
    fontSize: 16,
  },
});
