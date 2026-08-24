import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "@/src/routes/App.routes";
import { colors } from "@/src/theme/colors";

export function Routes() {
    return (
        <SafeAreaView style={ { flex: 1, backgroundColor: colors.bg, } }>
            <NavigationContainer>
                <AppRoutes/>
            </NavigationContainer>
        </SafeAreaView>
    )
}