import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá</Text>
      <Text style={styles.subtitle}>Aqui fica a tela principal.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#641F2B",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#F0F0F0",
  },
});
