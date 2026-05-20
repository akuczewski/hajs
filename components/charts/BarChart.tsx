import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

interface BarDataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  height?: number;
  incomeColor?: string;
  expenseColor?: string;
}

export default function BarChart({
  data,
  height = 140,
  incomeColor = '#34D399',
  expenseColor = '#EAB308',
}: BarChartProps) {
  if (data.length === 0) return null;

  const W = 320;
  const H = height;
  const PAD_LEFT = 4;
  const PAD_RIGHT = 4;
  const PAD_TOP = 8;
  const PAD_BOTTOM = 20;
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOTTOM;

  const allValues = data.flatMap(d => [d.income, d.expenses]);
  const maxV = Math.max(...allValues, 1);

  const slotW = chartW / data.length;
  const barW = Math.max(4, slotW * 0.32);
  const gap = barW * 0.3;

  const toBarH = (v: number) => (v / maxV) * chartH;

  const formatM = (m: string) => {
    const [, month] = m.split('-');
    return ['J','F','M','A','M','J','J','A','S','O','N','D'][parseInt(month) - 1];
  };

  // Show label every N bars to avoid crowding
  const step = data.length > 8 ? 3 : data.length > 5 ? 2 : 1;

  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {/* Baseline */}
        <Line
          x1={PAD_LEFT} y1={PAD_TOP + chartH}
          x2={PAD_LEFT + chartW} y2={PAD_TOP + chartH}
          stroke="#27272A" strokeWidth="1"
        />

        {data.map((d, i) => {
          const slotX = PAD_LEFT + i * slotW + slotW / 2;
          const incH = toBarH(d.income);
          const expH = toBarH(d.expenses);
          const incX = slotX - gap / 2 - barW;
          const expX = slotX + gap / 2;

          return (
            <React.Fragment key={d.month}>
              {/* Income bar */}
              <Rect
                x={incX}
                y={PAD_TOP + chartH - incH}
                width={barW}
                height={Math.max(incH, 1)}
                fill={incomeColor}
                rx="2"
                opacity="0.9"
              />
              {/* Expense bar */}
              <Rect
                x={expX}
                y={PAD_TOP + chartH - expH}
                width={barW}
                height={Math.max(expH, 1)}
                fill={expenseColor}
                rx="2"
                opacity="0.9"
              />
            </React.Fragment>
          );
        })}
      </Svg>

      {/* X labels */}
      <View style={{ flexDirection: 'row', paddingHorizontal: PAD_LEFT, marginTop: -4 }}>
        {data.map((d, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          const slotCenter = PAD_LEFT + i * (chartW / data.length) + (chartW / data.length) / 2;
          return (
            <View
              key={d.month}
              style={{
                position: 'absolute',
                left: `${(slotCenter / W) * 100}%`,
                transform: [{ translateX: -8 }],
              }}
            >
              <Text style={{ color: '#52525B', fontSize: 10 }}>{formatM(d.month)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
