import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/Home";
import LoginScreen from "../screens/Login";
import ProfileScreen from "../screens/Profile";
import SettingsScreen from "../screens/Settings";

const RootTabs = createBottomTabNavigator({
  screenOptions: {
    tabBarStyle: {
      backgroundColor: "#21130F",
      borderTopWidth: 0,
    },
    tabBarActiveTintColor: "#D9853F",
    tabBarInactiveTintColor: "#D6B84C",
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: "Home",

        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        title: "Perfil",

        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      },
    },
    Settings: {
      screen: SettingsScreen,
      options: {
        title: "Configurações",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" size={size} color={color} />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Login: {
      screen: LoginScreen,
    },
    App: {
      screen: RootTabs,
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
