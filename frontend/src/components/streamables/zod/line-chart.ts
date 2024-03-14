import * as z from "zod";

const dynamicPartSchema = z.record(z.union([z.string(), z.number()]));

export const lineDataSchema = z
  .object({
    date: z.string(),
  })
  .and(dynamicPartSchema);

export const lineSchema = z
  .object({
    title: z.string().describe("The title of the line chart"),
    index: z
      .string()
      .describe("The index of the line chart, this should be 'date'"),
    categories: z
      .array(z.string())
      .describe(
        "The category names from data you want to display in the chart, i.e. ['SemiAnalysis', 'The Pragmatic Engineer']"
      ),
    data: z
      .array(lineDataSchema)
      .describe(
        "The data of the line chart it should be in the format: [{ date: dateString, category name: value, category name 2: value }], i.e: {date: 'Mar 22', SemiAnalysis: 3322, 'The Pragmatic Engineer': 2194}"
      ),
  })
  .required();
