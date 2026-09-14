import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "@/src/screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import { BottomNav } from "@/src/components/BottomNav";
import { SignupScreen } from "@/src/screens/SignupScreen";
import { AddTransactionScreen } from "@/src/screens/AddTransactionScreen";
import { TransactionDetailsScreen } from "@/src/screens/TransactionDetailsScreen";
import { Transaction } from "../interfaces";
import { SettingsScreen } from "@/src/screens/SettingsScreen";
import { colors } from "@/src/theme/colors";
import DashboardScreen from "../screens/Dashboard/index";

export type BottomNavigationRoutes = {
    Home: undefined;
    Settings: undefined;
    Dashboard: undefined;
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
        <BottomTab.Navigator
            screenOptions={ {
                headerShown: false,
                animation: 'shift',
                sceneStyle: { backgroundColor: colors.bg },
            } }
            tabBar={ ( props ) => <BottomNav { ...props } /> }>
            <BottomTab.Screen name="Home" component={ HomeScreen }/>
            <BottomTab.Screen name="Settings" component={ SettingsScreen }/>
            <BottomTab.Screen name="Dashboard" component={ DashboardScreen } />
            <StackNavigation.Screen
                name="AddTransaction"
                component={ AddTransactionScreen }
            />
            <StackNavigation.Screen
                name="TransactionDetails"
                component={ TransactionDetailsScreen }
            />
        </BottomTab.Navigator>
    )
}

const StackNavigation = createNativeStackNavigator<StackNavigationRoutes>();

export function AppRoutes() {
    return (
        <StackNavigation.Navigator
            screenOptions={ {
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: colors.bg },
            } }
            initialRouteName="Login">
            <StackNavigation.Screen name="Login" component={ LoginScreen }/>
            <StackNavigation.Screen name="SignUp" component={ SignupScreen }/>
            <StackNavigation.Screen name="Bottom" component={ BottomNavigation }/>
        </StackNavigation.Navigator>
    )
}
