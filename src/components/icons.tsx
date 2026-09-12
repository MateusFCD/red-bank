import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color: string;
  strokeWidth?: number;
}

const base = (strokeWidth: number) => ({
  fill: 'none' as const,
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function CheckCircleIcon({ size = 16, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} stroke={color} {...base(strokeWidth)} />
      <Polyline points="8 12 11 15 16 9" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 19, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polyline points="15 18 9 12 15 6" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function FilterIcon({ size = 17, color, strokeWidth = 2, knobFill }: IconProps & { knobFill: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1={4} y1={7} x2={20} y2={7} stroke={color} {...base(strokeWidth)} />
      <Line x1={4} y1={12} x2={20} y2={12} stroke={color} {...base(strokeWidth)} />
      <Line x1={4} y1={17} x2={20} y2={17} stroke={color} {...base(strokeWidth)} />
      <Circle cx={9} cy={7} r={2} fill={knobFill} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={16} cy={12} r={2} fill={knobFill} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={10} cy={17} r={2} fill={knobFill} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function PlusIcon({ size = 15, color, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1={12} y1={5} x2={12} y2={19} stroke={color} {...base(strokeWidth)} />
      <Line x1={5} y1={12} x2={19} y2={12} stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function ArrowUpIcon({ size = 12, color, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1={12} y1={19} x2={12} y2={5} stroke={color} {...base(strokeWidth)} />
      <Polyline points="5 12 12 5 19 12" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function ArrowDownIcon({ size = 12, color, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1={12} y1={5} x2={12} y2={19} stroke={color} {...base(strokeWidth)} />
      <Polyline points="19 12 12 19 5 12" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function XIcon({ size = 16, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1={18} y1={6} x2={6} y2={18} stroke={color} {...base(strokeWidth)} />
      <Line x1={6} y1={6} x2={18} y2={18} stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function UploadImageIcon({ size = 22, color, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={3} width={18} height={18} stroke={color} {...base(strokeWidth)} />
      <Circle cx={9} cy={9} r={2} stroke={color} {...base(strokeWidth)} />
      <Path d="M21 15l-5-5L5 21" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function BellIcon({ size = 17, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} {...base(strokeWidth)} />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function LockIcon({ size = 17, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={11} width={18} height={11} rx={2} stroke={color} {...base(strokeWidth)} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function HelpCircleIcon({ size = 17, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} stroke={color} {...base(strokeWidth)} />
      <Line x1={12} y1={16} x2={12} y2={12} stroke={color} {...base(strokeWidth)} />
      <Line x1={12} y1={8} x2={12.01} y2={8} stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function HomeIcon({ size = 20, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} {...base(strokeWidth)} />
      <Polyline points="9 22 9 12 15 12 15 22" stroke={color} {...base(strokeWidth)} />
    </Svg>
  );
}

export function SettingsIcon({ size = 20, color, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={3} stroke={color} {...base(strokeWidth)} />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color}
        {...base(strokeWidth)}
      />
    </Svg>
  );
}
