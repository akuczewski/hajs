import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Line, Defs, Pattern } from 'react-native-svg';

interface BarDataPoint {
  month: string;
  income: number;
  expenses: number;
  isForecast?: boolean;
  isCurrentMonth?: boolean;
  isEstimated?: boolean;
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

  const step = data.length > 10 ? 3 : data.length > 6 ? 2 : 1;

  // Find where forecast starts for the divider line
  const forecastStartIdx = data.findIndex(d => d.isForecast);

  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {/* Baseline */}
        <Line
          x1={PAD_LEFT} y1={PAD_TOP + chartH}
          x2={PAD_LEFT + chartW} y2={PAD_TOP + chartH}
          stroke="#27272A" strokeWidth="1"
        />

        {/* Vertical divider between history and forecast */}
        {forecastStartIdx > 0 && (
          <Line
            x1={PAD_LEFT + forecastStartIdx * slotW}
            y1={PAD_TOP}
            x2={PAD_LEFT + forecastStartIdx * slotW}
            y2={PAD_TOP + chartH}
            stroke="#3F3F46"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        )}

        {data.map((d, i) => {
          const slotX = PAD_LEFT + i * slotW + slotW / 2;
          const incH = toBarH(d.income);
          const expH = toBarH(d.expenses);
          const incX = slotX - gap / 2 - barW;
          const expX = slotX + gap / 2;
          const isGrey = d.isForecast || d.isEstimated;
          const opacity = d.isForecast ? 0.38 : d.isEstimated ? 0.28 : d.isCurrentMonth ? 1 : 0.8;
          const barHeight = d.isEstimated ? Math.max(chartH * 0.15, 4) : undefined;

          return (
            <React.Fragment key={d.month}>
              <Rect
                x={incX}
                y={PAD_TOP + chartH - (d.isEstimated ? barHeight! : incH)}
                width={barW}
                height={d.isEstimated ? barHeight! : Math.max(incH, 1)}
                fill={isGrey ? '#6B7280' : incomeColor}
                rx="2"
                opacity={opacity}
              />
              <Rect
                x={expX}
                y={PAD_TOP + chartH - (d.isEstimated ? barHeight! : expH)}
                width={barW}
                height={d.isEstimated ? barHeight! : Math.max(expH, 1)}
                fill={isGrey ? '#6B7280' : expenseColor}
                rx="2"
                opacity={opacity}
              />
              {/* Current month dot indicator */}
              {d.isCurrentMonth && (
                <Rect
                  x={slotX - 2}
                  y={PAD_TOP + chartH + 4}
                  width={4}
                  height={4}
                  rx="2"
                  fill="#FFFFFF"
                  opacity="0.6"
                />
              )}
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
              <Text style={{ color: d.isForecast ? '#6B7280' : '#52525B', fontSize: 10 }}>
                {formatM(d.month)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
