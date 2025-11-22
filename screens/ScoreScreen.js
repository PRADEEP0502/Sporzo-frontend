import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/*
  Advanced match scoring screen (Stumps / CriHero style)
  - Type B (Advanced): no-ball, wide, byes, leg-byes, wickets, partnerships, FOW, undo
  - In-memory state; you can persist to backend later
*/

const sampleTeamA = {
  name: "SSS",
  logo: "https://picsum.photos/80/80?random=21",
  players: [
    "Ajay Kumar",
    "Sanjay",
    "Rahul",
    "Mani",
    "Vijay",
    "Kavin",
    "Ramesh",
    "Kumar",
    "Gowtham",
    "Arun",
    "Pradeep",
  ],
};

const sampleTeamB = {
  name: "TCC",
  logo: "https://picsum.photos/80/80?random=22",
  players: [
    "Manoj",
    "Suresh",
    "Ravi",
    "Naveen",
    "Sathish",
    "Karthik",
    "Raghu",
    "Balaji",
    "Imran",
    "Rohit",
    "Vasanth",
  ],
};

export default function MatchScore() {
  // innings state
  const [battingTeam, setBattingTeam] = useState(sampleTeamA);
  const [bowlingTeam, setBowlingTeam] = useState(sampleTeamB);

  // score state
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0); // total legal balls
  const [overs, setOvers] = useState("0.0"); // derived string

  // run-rate derived
  const computeRunRate = (r, b) => {
    if (b === 0) return 0;
    const o = Math.floor(b / 6) + (b % 6) / 6;
    return +(r / o).toFixed(2);
  };

  // batsmen state: [striker, nonStriker] as objects {name, runs, balls, isOut}
  const initialBatsmen = [
    { name: battingTeam.players[0], runs: 0, balls: 0, isOut: false },
    { name: battingTeam.players[1], runs: 0, balls: 0, isOut: false },
  ];
  const [batsmen, setBatsmen] = useState(initialBatsmen);
  const [nextBatsmanIndex, setNextBatsmanIndex] = useState(2);

  // bowler state: selected bowler (object) + map of bowlers stats
  const [selectedBowler, setSelectedBowler] = useState(bowlingTeam.players[0]);
  const [bowlers, setBowlers] = useState({
    // name: {balls:0,runs:0,wickets:0}
    [bowlingTeam.players[0]]: { balls: 0, runs: 0, wickets: 0 },
  });

  // partnership
  const [partnershipRuns, setPartnershipRuns] = useState(0);
  // fall-of-wickets list
  const [fow, setFow] = useState([]); // items: {score, wicketNo, batsman, over}

  // timeline (ball-by-ball) list for undo + display
  const [timeline, setTimeline] = useState([]); // items: {type, runs, extraType?, batsman?, bowler?, desc}

  // helper: format overs from balls
  const formatOvers = (b) => {
    const o = Math.floor(b / 6);
    const r = b % 6;
    return `${o}.${r}`;
  };

  // update overs string whenever balls changes
  const updateBallsAndOvers = (addBalls = 0) => {
    const newBalls = balls + addBalls;
    setBalls(newBalls);
    setOvers(formatOvers(newBalls));
  };

  // ensure bowler entry exists
  const ensureBowlerExists = (name) => {
    setBowlers((prev) => {
      if (prev[name]) return prev;
      return { ...prev, [name]: { balls: 0, runs: 0, wickets: 0 } };
    });
  };

  // Swap strike (used after over or odd runs)
  const swapStrike = () => {
    setBatsmen((prev) => [prev[1], prev[0]]);
  };

  // record a legal delivery (runsFromBall can be 0..6, extras handled separately)
  const recordLegalBall = ({ runsFromBall = 0, isWicket = false, desc = "" }) => {
    // update runs & balls & batsmen & bowler
    setRuns((r) => r + runsFromBall);
    updateBallsAndOvers(1);
    setPartnershipRuns((p) => p + runsFromBall);

    // update batsman who faced (striker)
    setBatsmen((prev) => {
      const striker = { ...prev[0] };
      if (!isWicket) {
        striker.runs += runsFromBall;
        striker.balls += 1;
      } else {
        striker.isOut = true;
        striker.balls += 1;
      }
      const updated = [striker, prev[1]];
      return updated;
    });

    // update bowler stats
    ensureBowlerExists(selectedBowler);
    setBowlers((prev) => {
      const b = { ...prev };
      const val = b[selectedBowler] || { balls: 0, runs: 0, wickets: 0 };
      val.balls += 1;
      val.runs += runsFromBall;
      if (isWicket) val.wickets += 1;
      b[selectedBowler] = val;
      return b;
    });

    // timeline
    setTimeline((t) => [
      ...t,
      {
        type: isWicket ? "W" : "RUN",
        runs: runsFromBall,
        desc: desc || (isWicket ? "WICKET" : `${runsFromBall}`),
        batsman: batsmen[0].name,
        bowler: selectedBowler,
      },
    ]);

    // on odd runs, swap strike
    if (!isWicket && runsFromBall % 2 === 1) {
      swapStrike();
    }

    // if wicket, push FOW and bring new batsman
    if (isWicket) {
      setWickets((w) => {
        const newW = w + 1;
        // FOW entry
        setFow((prevF) => [
          ...prevF,
          {
            score: runs + runsFromBall, // runs before update + this ball (functional setRuns above might be async but we use runs state closure earlier; acceptable small discrepancy)
            wicketNo: newW,
            batsman: batsmen[0].name,
            over: formatOvers(balls + 1),
          },
        ]);
        return newW;
      });

      // bring new batsman
      const nextIndex = nextBatsmanIndex;
      const nextName = battingTeam.players[nextIndex] || `Player ${nextIndex + 1}`;
      setNextBatsmanIndex(nextIndex + 1);
      setBatsmen((prev) => {
        // striker is out -> replace with new at striker position
        const newStriker = { name: nextName, runs: 0, balls: 0, isOut: false };
        return [newStriker, prev[1]];
      });

      // reset partnership
      setPartnershipRuns(0);
    }
  };

  // record an extra (no-ball, wide, bye, leg-bye)
  const recordExtra = ({ extraType, runsFromExtra = 1, desc = "" }) => {
    // extras do not count as legal balls except in some rules (no-ball may have free hit) - we won't increment legal balls
    setRuns((r) => r + runsFromExtra);
    setPartnershipRuns((p) => p + runsFromExtra);

    // bowler gets runs credited (usually)
    ensureBowlerExists(selectedBowler);
    setBowlers((prev) => {
      const b = { ...prev };
      const val = b[selectedBowler] || { balls: 0, runs: 0, wickets: 0 };
      val.runs += runsFromExtra;
      b[selectedBowler] = val;
      return b;
    });

    // timeline entry
    setTimeline((t) => [
      ...t,
      {
        type: "EXTRA",
        extraType,
        runs: runsFromExtra,
        desc: desc || `${extraType} ${runsFromExtra}`,
        bowler: selectedBowler,
      },
    ]);

    // if runsFromExtra is odd and it's bye/legbye (batsmen don't change on wide/no-ball usually), strike may or may not change; keep simple: if bye/legbye odd -> swap
    if (extraType === "BYE" || extraType === "LEGBYE") {
      if (runsFromExtra % 2 === 1) swapStrike();
    }
  };

  // Undo last event
  const undoLast = () => {
    const last = timeline[timeline.length - 1];
    if (!last) return;
    // remove last
    setTimeline((t) => t.slice(0, -1));

    // revert effects (basic undo logic)
    // NOTE: This is a simple undo and may not cover all edge cases in complex sequences.
    if (last.type === "RUN") {
      // subtract runs, reduce balls, revert batsman/bowler
      setRuns((r) => r - last.runs);
      setBalls((b) => Math.max(0, b - 1));
      setOvers(formatOvers(Math.max(0, balls - 1))); // best-effort

      // revert batsman
      setBatsmen((prev) => {
        const striker = { ...prev[0] };
        striker.runs = Math.max(0, striker.runs - last.runs);
        striker.balls = Math.max(0, striker.balls - 1);
        return [striker, prev[1]];
      });

      // revert bowler
      setBowlers((prev) => {
        const b = { ...prev };
        const val = b[last.bowler] || { balls: 0, runs: 0, wickets: 0 };
        val.balls = Math.max(0, val.balls - 1);
        val.runs = Math.max(0, val.runs - last.runs);
        b[last.bowler] = val;
        return b;
      });

      // partnership revert
      setPartnershipRuns((p) => Math.max(0, p - last.runs));
    } else if (last.type === "W") {
      // revert wicket
      setWickets((w) => Math.max(0, w - 1));
      // revert balls/runs
      setRuns((r) => Math.max(0, r - (last.runs || 0)));
      setBalls((b) => Math.max(0, b - 1));
      setOvers(formatOvers(Math.max(0, balls - 1)));

      // revert batsman: mark not out (best-effort)
      setBatsmen((prev) => {
        const striker = { ...prev[0] };
        striker.isOut = false;
        striker.balls = Math.max(0, striker.balls - 1);
        // we cannot perfectly restore previous striker name if new batsman replaced; leave simple
        return [striker, prev[1]];
      });

      // revert bowler wickets
      setBowlers((prev) => {
        const b = { ...prev };
        const val = b[last.bowler] || { balls: 0, runs: 0, wickets: 0 };
        val.balls = Math.max(0, val.balls - 1);
        val.wickets = Math.max(0, val.wickets - 1);
        b[last.bowler] = val;
        return b;
      });

      // remove last fow
      setFow((f) => f.slice(0, -1));
    } else if (last.type === "EXTRA") {
      setRuns((r) => Math.max(0, r - last.runs));
      setPartnershipRuns((p) => Math.max(0, p - last.runs));
      // revert bowler runs
      setBowlers((prev) => {
        const b = { ...prev };
        const val = b[last.bowler] || { balls: 0, runs: 0, wickets: 0 };
        val.runs = Math.max(0, val.runs - last.runs);
        b[last.bowler] = val;
        return b;
      });
    }
  };

  const runRate = computeRunRate(runs, balls);

  /* ---------- UI subcomponents ---------- */

  const BatsmanCard = ({ batsman, isStriker }) => (
    <View style={[styles.playerBox, isStriker && styles.strikerBox]}>
      <View>
        <Text style={styles.playerName}>
          {batsman.name} {isStriker ? "●" : ""}
        </Text>
        <Text style={styles.playerMeta}>
          {batsman.runs} ({batsman.balls})
        </Text>
      </View>
    </View>
  );

  const BowlerBox = ({ name }) => {
    const b = bowlers[name] || { balls: 0, runs: 0, wickets: 0 };
    const oversBowled = `${Math.floor(b.balls / 6)}.${b.balls % 6}`;
    return (
      <View style={styles.bowlerBox}>
        <Text style={styles.bowlerName}>{name}</Text>
        <Text style={styles.bowlerMeta}>
          {oversBowled} ov • {b.runs} runs • {b.wickets} wkts
        </Text>
      </View>
    );
  };

  /* ---------- Controls ---------- */
  // run buttons and extras
  const RunButton = ({ value }) => (
    <TouchableOpacity
      style={styles.controlBtn}
      onPress={() => recordLegalBall({ runsFromBall: value, isWicket: false })}
    >
      <Text style={styles.controlText}>{value}</Text>
    </TouchableOpacity>
  );

  const WicketButton = () =>
    <TouchableOpacity
      style={[styles.controlBtn, { backgroundColor: "#FF5252" }]}
      onPress={() => recordLegalBall({ runsFromBall: 0, isWicket: true, desc: "W" })}
    >
      <Text style={[styles.controlText, { color: "#fff" }]}>WICKET</Text>
    </TouchableOpacity>;

  const ExtraButton = ({ type, val = 1 }) => (
    <TouchableOpacity
      style={[styles.controlBtn, { backgroundColor: "#222" }]}
      onPress={() => recordExtra({ extraType: type, runsFromExtra: val })}
    >
      <Text style={[styles.controlText, { color: "#FFD24A" }]}>{type}</Text>
    </TouchableOpacity>
  );

  /* ---------- Render ---------- */

  return (
    <ScrollView style={styles.container}>
      {/* Header: teams and score */}
      <View style={styles.header}>
        <View style={styles.teamCol}>
          <Image source={{ uri: battingTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{battingTeam.name}</Text>
        </View>

        <View style={styles.scoreCol}>
          <Text style={styles.bigScore}>{runs}/{wickets}</Text>
          <Text style={styles.smallText}>
            {formatOvers(balls)} ov • RR: {runRate}
          </Text>
        </View>

        <View style={styles.teamCol}>
          <Image source={{ uri: bowlingTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{bowlingTeam.name}</Text>
        </View>
      </View>

      {/* Partnership + controls row */}
      <View style={styles.rowWrap}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Partnership</Text>
          <Text style={styles.statValue}>{partnershipRuns}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Last Over</Text>
          <Text style={styles.statValue}>
            {timeline.length ? timeline.slice(-6).map(i => i.desc || (i.runs || 0)).join(" ") : "-"}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Undo</Text>
          <TouchableOpacity style={styles.undoBtn} onPress={undoLast}>
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Batsmen */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Batsmen</Text>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <BatsmanCard batsman={batsmen[0]} isStriker={true} />
        <BatsmanCard batsman={batsmen[1]} isStriker={false} />
      </View>

      {/* Bowler */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bowler</Text>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <BowlerBox name={selectedBowler} />
      </View>

      {/* Controls: runs, wicket, extras */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ball Controls</Text>
      </View>

      <View style={styles.controlsGrid}>
        <RunButton value={0} />
        <RunButton value={1} />
        <RunButton value={2} />
        <RunButton value={3} />
        <RunButton value={4} />
        <RunButton value={6} />
        <WicketButton />
        <ExtraButton type="NB" /> {/* no-ball */}
        <ExtraButton type="WD" /> {/* wide */}
        <ExtraButton type="BYE" />
        <ExtraButton type="LB" /> {/* leg-bye */}
      </View>

      {/* Timeline */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Timeline</Text>
      </View>
      <View style={styles.timelineBox}>
        {timeline.slice().reverse().map((t, i) => (
          <View key={i} style={styles.timelineRow}>
            <Text style={styles.timelineText}>{t.desc}</Text>
            <Text style={styles.timelineMeta}>{t.bowler}</Text>
          </View>
        ))}
      </View>

      {/* Fall of wickets */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fall of Wickets</Text>
      </View>
      <View style={styles.fowBox}>
        {fow.length === 0 ? (
          <Text style={styles.emptyText}>No wickets yet</Text>
        ) : (
          fow.map((f, i) => (
            <Text key={i} style={styles.fowText}>
              {f.wicketNo}. {f.batsman} — {f.score} ({f.over})
            </Text>
          ))
        )}
      </View>

      {/* Quick bowl change */}
      <View style={[styles.sectionHeader, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Change Bowler</Text>
      </View>
      <ScrollView horizontal style={{ paddingHorizontal: 12, marginBottom: 40 }}>
        {bowlingTeam.players.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.pill,
              selectedBowler === p ? { backgroundColor: "#FFD24A" } : {},
            ]}
            onPress={() => {
              setSelectedBowler(p);
              ensureBowlerExists(p);
            }}
          >
            <Text style={{ color: selectedBowler === p ? "#000" : "#fff", fontWeight: "700" }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

/* ===========================
   Styles
   =========================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090014",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 12,
    justifyContent: "space-between",
  },

  teamCol: { alignItems: "center", width: 90 },

  teamLogo: { width: 64, height: 64, borderRadius: 32, marginBottom: 6 },

  teamName: { color: "#fff", fontWeight: "800" },

  scoreCol: { alignItems: "center" },

  bigScore: { color: "#fff", fontSize: 36, fontWeight: "900" },

  smallText: { color: "#CFCFCF", marginTop: 6 },

  rowWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 8,
  },

  statBox: {
    backgroundColor: "#130425",
    padding: 12,
    borderRadius: 12,
    width: "32%",
    alignItems: "center",
  },

  statLabel: { color: "#CFCFCF", fontSize: 12 },
  statValue: { color: "#FFD24A", fontSize: 18, fontWeight: "800" },

  undoBtn: {
    backgroundColor: "#7A2BCB",
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },

  sectionHeader: { marginTop: 18, paddingHorizontal: 12 },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },

  playerBox: {
    backgroundColor: "#120320",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  strikerBox: {
    borderColor: "#FFD24A",
    borderWidth: 1,
  },

  playerName: { color: "#fff", fontWeight: "700", fontSize: 16 },
  playerMeta: { color: "#CFCFCF", marginTop: 6 },

  bowlerBox: {
    backgroundColor: "#120320",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  bowlerName: { color: "#fff", fontWeight: "800" },
  bowlerMeta: { color: "#CFCFCF", marginTop: 6 },

  controlsGrid: {
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  controlBtn: {
    width: "32%",
    backgroundColor: "#1B0830",
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  controlText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  timelineBox: {
    backgroundColor: "#120320",
    margin: 12,
    padding: 12,
    borderRadius: 12,
  },

  timelineRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  timelineText: { color: "#CFCFCF" },
  timelineMeta: { color: "#888" },

  fowBox: { paddingHorizontal: 12, paddingTop: 8 },
  fowText: { color: "#CFCFCF", paddingVertical: 4 },
  emptyText: { color: "#888", padding: 12 },

  pill: {
    backgroundColor: "#130425",
    padding: 10,
    borderRadius: 18,
    marginRight: 10,
    marginVertical: 12,
  },
});
