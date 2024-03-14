"use client";
import * as z from "zod";

import { BarChart, Card } from "@tremor/react";
import { barSchema } from "./zod/bar-chart";

const dataFormatter = (number: number) =>
  Intl.NumberFormat("jp").format(number).toString();

export const BarChartStreamable = ({
  title,
  categories,
  data,
  index,
}: z.infer<typeof barSchema>) => {
  return (
    <Card className="sm:mx-auto sm:max-w-2xl">
      <h3 className="ml-1 mr-1 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {title}
      </h3>
      <BarChart
        data={data}
        index={"name"}
        categories={categories}
        yAxisWidth={45}
        valueFormatter={dataFormatter}
        className="mt-6 h-60"
      />
    </Card>
  );
};
