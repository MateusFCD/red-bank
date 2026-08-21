import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "./global.css";

import { Navigation } from "./src/navigation";

export default function App() {
  return (
    <GluestackUIProvider mode="dark">
      <Navigation />
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
