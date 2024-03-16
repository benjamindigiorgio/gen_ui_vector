import { Card, ScatterChart } from "@tremor/react";
import * as z from "zod";

import React from "react";
import { scatterChartSchema } from "./zod/scatter-chart";

const ScatterChartStreamable = ({
  title,
  subtitle,
  ...props
}: z.infer<typeof scatterChartSchema>) => {
  return (
    <Card className="sm:mx-auto sm:max-w-2xl">
      <h3 className="ml-1 mr-1 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {title}
      </h3>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
        {subtitle}
      </p>

      <ScatterChart {...props} />
    </Card>
  );
};

export { ScatterChartStreamable };
