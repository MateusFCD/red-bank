import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    navigation.replace("App");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dindin</Text>

        <Text style={styles.subtitle}>Seu dinheiro, sob controle.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#786E68"
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#786E68"
          secureTextEntry
          style={styles.input}
        />

        <Pressable onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#641F2B",
    paddingHorizontal: 32,
  },

  header: {
    marginBottom: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF8F0",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 18,
    color: "#F1E8DF",
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#FAF7F2",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: "#302B29",
  },
  button: {
    backgroundColor: "#D6B84C",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  buttonText: {
    color: "#21130F",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  },
});
