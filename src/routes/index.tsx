import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { styled } from "nativewind";
import { AppRoutes } from "@/src/routes/App.routes";
import Toast from "react-native-toast-message";

const StyledSafeAreaView = styled(SafeAreaView);

export function Routes() {
    return (
        <StyledSafeAreaView className="flex-1 bg-app">
            <NavigationContainer>
                <AppRoutes />
            </NavigationContainer>

            <Toast />
        </StyledSafeAreaView>
    );
}
