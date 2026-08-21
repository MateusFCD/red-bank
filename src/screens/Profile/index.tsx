import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.subtitle}>Aqui ficam suas informações.</Text>
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
