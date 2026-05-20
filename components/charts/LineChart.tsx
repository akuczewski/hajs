import React, { useId } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle } from 'react-native-svg';

interface DataPoint {
  month: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showGradient?: boolean;
  symbol?: string;
  formatLabel?: (month: string) => string;
}

export default function LineChart({
  data,
  color = '#34D399',
  height = 120,
  showGradient = true,
  symbol = '',
  formatLabel,
}: LineChartProps) {
  const uid = useId();
  if (data.length < 2) {
    return (
      <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#52525B', fontSize: 12 }}>Not enough data</Text>
      </View>
    );
  }

  const W = 320;
  const H = height;
  const PAD_LEFT = 4;
  const PAD_RIGHT = 4;
  const PAD_TOP = 12;
  const PAD_BOTTOM = 24;
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOTTOM;

  const values = data.map(d => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const toX = (i: number) => PAD_LEFT + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => PAD_TOP + chartH - ((v - minV) / range) * chartH;

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.value) }));

  // Smooth cubic bezier path
  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const fillPath = `${linePath} L ${points[points.length - 1].x} ${PAD_TOP + chartH} L ${points[0].x} ${PAD_TOP + chartH} Z`;

  // X-axis labels — show every other one if many points
  const step = data.length > 8 ? 2 : 1;
  const labelIndices = data.map((_, i) => i).filter(i => i % step === 0 || i === data.length - 1);

  const formatM = (m: string) => {
    if (formatLabel) return formatLabel(m);
    const [, month] = m.split('-');
    return ['J','F','M','A','M','J','J','A','S','O','N','D'][parseInt(month) - 1];
  };

  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <Defs>
          <LinearGradient id={`lg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.25" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Baseline */}
        <Line
          x1={PAD_LEFT} y1={PAD_TOP + chartH}
          x2={PAD_LEFT + chartW} y2={PAD_TOP + chartH}
          stroke="#27272A" strokeWidth="1"
        />

        {/* Gradient fill */}
        {showGradient && (
          <Path d={fillPath} fill={`url(#lg-${uid})`} />
        )}

        {/* Line */}
        <Path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Last point dot */}
        <Circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={color}
        />

        {/* X labels */}
        {labelIndices.map(i => (
          <React.Fragment key={i}>
            <Line
              x1={toX(i)} y1={PAD_TOP + chartH}
              x2={toX(i)} y2={PAD_TOP + chartH + 4}
              stroke="#3F3F46" strokeWidth="1"
            />
          </React.Fragment>
        ))}
      </Svg>

      {/* Labels below SVG */}
      <View style={{ flexDirection: 'row', paddingHorizontal: PAD_LEFT, marginTop: -4 }}>
        {labelIndices.map(i => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: `${(i / (data.length - 1)) * 100}%`,
              transform: [{ translateX: -10 }],
            }}
          >
            <Text style={{ color: '#52525B', fontSize: 10 }}>{formatM(data[i].month)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
