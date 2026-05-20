import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

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
  formatLabel?: (month: string) => string;
}

export default function BarChart({
  data,
  height = 140,
  incomeColor = '#34D399',
  expenseColor = '#EAB308',
  formatLabel,
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

  // Scale to max income so all bars share the same reference
  const maxV = Math.max(...data.map(d => d.income), 1);

  const slotW = chartW / data.length;
  const barW = Math.max(6, slotW * 0.65);

  const toH = (v: number) => (Math.min(v, maxV) / maxV) * chartH;

  const formatM = (m: string) => {
    if (formatLabel) return formatLabel(m);
    const [, month] = m.split('-');
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month) - 1];
  };

  const step = data.length > 10 ? 3 : data.length > 6 ? 2 : 1;
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

        {/* Divider between history and forecast */}
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
          const barX = slotX - barW / 2;
          const baseOpacity = d.isForecast ? 0.4 : d.isCurrentMonth ? 1 : 0.8;

          // Estimated months: uniform grey stub
          if (d.isEstimated) {
            const stubH = Math.max(chartH * 0.15, 4);
            return (
              <Rect
                key={d.month}
                x={barX}
                y={PAD_TOP + chartH - stubH}
                width={barW}
                height={stubH}
                fill="#3F3F46"
                rx="3"
                opacity="0.4"
              />
            );
          }

          const incH = toH(d.income);
          const expH = toH(d.expenses);
          const cappedExpH = Math.min(expH, incH);
          // Expenses over income → overflow shown in red
          const overflowH = expH > incH ? expH - incH : 0;
          const surplusH = Math.max(incH - cappedExpH, 0);

          const color = d.isForecast ? '#6B7280' : incomeColor;
          const expColor = d.isForecast ? '#9CA3AF' : expenses_overflow(d) ? '#EF4444' : expenseColor;

          return (
            <React.Fragment key={d.month}>
              {/* Surplus / income portion (top) */}
              {surplusH > 0 && (
                <Rect
                  x={barX}
                  y={PAD_TOP + chartH - incH}
                  width={barW}
                  height={surplusH}
                  fill={color}
                  rx="3"
                  opacity={baseOpacity}
                />
              )}
              {/* Expense portion (bottom) — lower opacity to contrast with surplus */}
              {cappedExpH > 0 && (
                <Rect
                  x={barX}
                  y={PAD_TOP + chartH - cappedExpH}
                  width={barW}
                  height={cappedExpH}
                  fill={d.isForecast ? '#9CA3AF' : expenseColor}
                  rx="3"
                  opacity={baseOpacity * 0.55}
                />
              )}
              {/* Overflow: expenses exceed income */}
              {overflowH > 0 && (
                <Rect
                  x={barX}
                  y={PAD_TOP + chartH - incH - overflowH}
                  width={barW}
                  height={overflowH}
                  fill="#EF4444"
                  rx="3"
                  opacity={baseOpacity}
                />
              )}
              {/* Current month dot */}
              {d.isCurrentMonth && (
                <Rect
                  x={slotX - 2}
                  y={PAD_TOP + chartH + 4}
                  width={4}
                  height={4}
                  rx="2"
                  fill="#FFFFFF"
                  opacity="0.5"
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
                transform: [{ translateX: -10 }],
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

// helper to avoid inline logic in JSX
function expenses_overflow(d: { income: number; expenses: number }) {
  return d.expenses > d.income;
}
