import { useContext } from "react";
import { AppContext, AppContextValue } from "@/src/context/AppContext";

export function useAppContext(): AppContextValue {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider.');
    }

    return context;
}