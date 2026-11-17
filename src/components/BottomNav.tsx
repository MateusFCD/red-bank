import type { ComponentType } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardIcon, HomeIcon, SettingsIcon, type IconProps } from '@/src/components/icons';
import type { BottomNavigationRoutes } from '@/src/routes/App.routes';
import { colors, textMuted } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';

interface TabConfig {
    route: keyof BottomNavigationRoutes;
    label: string;
    Icon: ComponentType<IconProps>;
}

const TABS: TabConfig[] = [
    { route: 'Home', label: 'Home', Icon: HomeIcon },
    { route: 'Dashboard', label: 'Dashboard', Icon: DashboardIcon },
    { route: 'Settings', label: 'Config', Icon: SettingsIcon },
];

export function BottomNav({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const activeRoute = state.routeNames[state.index];

    return (
        <View
            className="flex-row items-center justify-center gap-9 pt-2.5 bg-surface border-t border-t-divider"
            style={{ paddingBottom: Math.max(insets.bottom, 10) + 16 }}
        >
            {TABS.map(({ route, label, Icon }) => {
                const active = activeRoute === route;

                return (
                    <Pressable
                        key={route}
                        className="items-center gap-[3px] py-1 px-2.5"
                        onPress={() => navigation.navigate(route)}
                        hitSlop={8}
                    >
                        <Icon size={20} color={active ? colors.accent300 : textMuted(0.55)} />
                        <Text
                            className={cn(
                                'text-[11px] font-body-medium',
                                active ? 'text-brand-300' : 'text-ink/55',
                            )}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
