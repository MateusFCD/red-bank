import type { ComponentType } from 'react';
import { Text, View } from 'react-native';

import type { IconProps } from '@/src/components/icons';
import { colors } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';

export interface SettingsMenuItem {
    label: string;
    Icon: ComponentType<IconProps>;
}

export function SettingsMenu({ items }: { items: SettingsMenuItem[] }) {
    return (
        <View className="rounded-xl bg-surface overflow-hidden">
            {items.map(({ label, Icon }, index) => (
                <View
                    key={label}
                    className={cn(
                        'flex-row items-center gap-3 py-3.5 px-4',
                        index < items.length - 1 && 'border-b border-b-divider',
                    )}
                >
                    <Icon size={17} color={colors.text} />
                    <Text className="text-[14px] text-ink flex-1 font-body">{label}</Text>
                </View>
            ))}
        </View>
    );
}
