import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "@/src/screens/LoginScreen";
import HomeScreen from "../screens/Home";
import SettingsScreen from "../screens/Settings";
import { BottomNav } from "@/src/components/BottomNav";
import { SignupScreen } from "@/src/screens/SignupScreen";
import { AddTransactionScreen } from "@/src/screens/Transactions/AddTransactionScreen";
import { TransactionDetailsScreen } from "@/src/screens/Transactions/TransactionDetailsScreen";
import { Transaction } from "../interfaces";

export type BottomNavigationRoutes = {
    Home: undefined;
    Settings: undefined;
}

export type StackNavigationRoutes = {
    Bottom: undefined;
    Login: undefined;
    SignUp: undefined;
    AddTransaction: {
        transaction?: Transaction;
    };
    TransactionDetails: {
        transaction: Transaction;
    };
}

const BottomTab = createBottomTabNavigator<BottomNavigationRoutes>();

function BottomNavigation() {
    return (
        <BottomTab.Navigator screenOptions={{ headerShown: false }}
            tabBar={(props) => <BottomNav {...props} />}>
            <BottomTab.Screen name="Home" component={HomeScreen} />
            <BottomTab.Screen name="Settings" component={SettingsScreen} />
            <StackNavigation.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
            />
            <StackNavigation.Screen
                name="TransactionDetails"
                component={TransactionDetailsScreen}
            />
        </BottomTab.Navigator>
    )
}

const StackNavigation = createNativeStackNavigator<StackNavigationRoutes>();

export function AppRoutes() {
    return (
        <StackNavigation.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            <StackNavigation.Screen name="Login" component={LoginScreen} />
            <StackNavigation.Screen name="SignUp" component={SignupScreen} />
            <StackNavigation.Screen name="Bottom" component={BottomNavigation} />
        </StackNavigation.Navigator>
    )
}
