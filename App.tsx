import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "./global.css";

import {
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
    useFonts,
} from '@expo-google-fonts/archivo';
import * as SplashScreen from 'expo-splash-screen';

import { Routes } from "@/src/routes";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();


export default function App() {
    const [loaded, error] = useFonts({
        Archivo_400Regular,
        Archivo_600SemiBold,
        Archivo_800ExtraBold,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <GluestackUIProvider mode="dark">
            <StatusBar style="light" translucent/>
            <Routes/>
        </GluestackUIProvider>
    );
}
