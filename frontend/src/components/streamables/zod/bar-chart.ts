import * as z from "zod";

const dynamicPartSchema = z.record(z.union([z.string(), z.number()]));

export const barDataSchema = z
  .object({
    name: z.string(),
  })
  .and(dynamicPartSchema);

export const barSchema = z
  .object({
    title: z.string().describe("The title of the bar chart"),
    index: z
      .string()
      .describe(
        "The index of the bar chart, this should be the 'name' in this case"
      ),
    categories: z
      .array(z.string())
      .describe(
        "The category names from data you want to display in the chart, i.e. ['Number of threatened species']"
      ),
    data: z
      .array(barDataSchema)
      .describe(
        "The data of the bar chart it should be in the format: [{ name: string, category name: value }], i.e: {name: 'Amphibians', 'Number of threatened species': 2488}"
      ),
  })
  .required();
