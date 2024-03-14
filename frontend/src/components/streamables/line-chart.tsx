"use client";
import * as z from "zod";

import { LineChart, Card, List, ListItem } from "@tremor/react";
import { lineSchema } from "./zod/line-chart";
import { cn } from "@/lib/utils";
import { COLORS } from "@/contants/colors";

const dataFormatter = (number: number) =>
  Intl.NumberFormat("jp").format(number).toString();

export const LineChartStreamable = ({
  title,
  categories,
  data,
  index,
}: z.infer<typeof lineSchema>) => {
  const summary = data.reduce(
    (acc, cur) => {
      Object.keys(cur).forEach((key) => {
        if (key !== index) {
          if (!acc[key as keyof typeof acc]) {
            acc[key] = 0;
          }
          acc[key] += cur[key];
        }
      });
      return acc;
    },
    {} as Record<string, number>
  );
  return (
    <Card className="sm:mx-auto sm:max-w-2xl">
      <h3 className="ml-1 mr-1 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {title}
      </h3>
      <LineChart
        data={data}
        index={"date"}
        categories={categories}
        yAxisWidth={45}
        valueFormatter={dataFormatter}
        className="mt-6 h-32"
      />
      <List className="mt-2">
        {Object.entries(summary).map(([key, value], i) => (
          <ListItem key={`${key}-${i}`}>
            <div className="flex items-center space-x-2">
              <span
                className={cn(COLORS[i % COLORS.length], "h-0.5 w-3")}
                aria-hidden={true}
              />
              <span>{key}</span>
            </div>
            <span className="font-medium text-tremor-content-strong">
              {dataFormatter(value)}
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
