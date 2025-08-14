"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { satisfaction: "Very Low", value: 10 },
  { satisfaction: "Low", value: 40 },
  { satisfaction: "Medium", value: 200 },
  { satisfaction: "High", value: 150 },
  { satisfaction: "Very High", value: 80 },
]

const chartConfig = {
  value: {
    label: "Students",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function StudentSatisfactionChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="satisfaction"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
