import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { formatCash } from "../../lib/formatCash";

const TYPES = {
  Investment: 0,
  Cash: 1
}

const descriptions = {
  [TYPES.Investment]: "Инвестиции",
  [TYPES.Cash]: "Доступно"
}

const COLORS = ['#0088FE', '#00C49F'];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{descriptions[payload.name]}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${formatCash(value)}`}</text>
    </g>
  );
};

const getData = (cash, invested) => {
  return [
    { name: TYPES.Investment, value: invested },
    { name: TYPES.Cash, value: cash }
  ];
}

export const CompositionChart = ({ cash, invested }) => {
  const [activeIndex, setIndex] = useState(0);
  const data = getData(cash, invested);

  return (
    <ResponsiveContainer width={"100%"} height={250}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx={240}
          cy={120}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          onMouseEnter={(data, index) => setIndex(index)}
        >
          {
            data.map((entry, index) =>
              <Cell fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
