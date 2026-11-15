import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, SettingsIcon, DashboardIcon } from '@/src/components/icons';
import { colors, textMuted } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';

export function BottomNav( { state, navigation }: BottomTabBarProps ) {
    const insets = useSafeAreaInsets();
    const activeRoute = state.routeNames[ state.index ];
    const iconColor = ( route: string ) => activeRoute === route ? colors.accent300 : textMuted(0.55);
    const labelClass = ( route: string ) =>
        cn('text-[11px] font-body-medium', activeRoute === route ? 'text-brand-300' : 'text-ink/55');

    return (
        <View
            className="flex-row items-center justify-center gap-9 pt-2.5 bg-surface border-t border-t-divider"
            style={ { paddingBottom: Math.max(insets.bottom, 10) + 16 } }
        >
            <Pressable className="items-center gap-[3px] py-1 px-2.5" onPress={ () => navigation.navigate('Home') } hitSlop={ 8 }>
                <HomeIcon size={ 20 } color={ iconColor('Home') }/>
                <Text className={ labelClass('Home') }>Home</Text>
            </Pressable>
            <Pressable className="items-center gap-[3px] py-1 px-2.5" onPress={ () => navigation.navigate('Dashboard') } hitSlop={ 8 }>
                <DashboardIcon size={ 20 } color={ iconColor('Dashboard') }/>
                <Text className={ labelClass('Dashboard') }>Dashboard</Text>
            </Pressable>
            <Pressable className="items-center gap-[3px] py-1 px-2.5" onPress={ () => navigation.navigate('Settings') } hitSlop={ 8 }>
                <SettingsIcon size={ 20 } color={ iconColor('Settings') }/>
                <Text className={ labelClass('Settings') }>Config</Text>
            </Pressable>
        </View>
    );
}
