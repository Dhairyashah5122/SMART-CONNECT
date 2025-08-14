"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { scope: "Initial", outcome: 186 },
  { scope: "Mid-Point", outcome: 305 },
  { scope: "Final", outcome: 237 },
  { scope: "Post-Project", outcome: 273 },
]

const chartConfig = {
  outcome: {
    label: "Outcome",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ScopeOutcomeChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="scope"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="outcome" fill="var(--color-outcome)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
