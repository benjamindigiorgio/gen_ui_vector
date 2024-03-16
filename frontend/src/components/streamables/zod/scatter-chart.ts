import * as z from "zod";

const scatterChartDataItemSchema = z.record(z.union([z.string(), z.number()]));

const scatterChartValueFormatterSchema = z.record(
  z.function().args(z.number()).returns(z.string())
);

export const scatterChartSchema = z.object({
  title: z.string().describe("Title of the chart."),
  subtitle: z.string().optional().describe("Subtitle of the chart."),
  data: z
    .array(scatterChartDataItemSchema)
    .describe(
      "Array of data objects for the chart. Each object can have any structure, as long as it includes the fields used for category, x, y, and size."
    ),
  category: z
    .string()
    .describe("The key in each data object to be used as the category."),
  x: z
    .string()
    .describe("The key in each data object to be used for the x-axis values."),
  y: z
    .string()
    .describe("The key in each data object to be used for the y-axis values."),
  size: z
    .string()
    .optional()
    .describe(
      "The key in each data object to determine the size of each scatter point. This is optional and can be omitted if size is not used."
    ),
  showOpacity: z
    .boolean()
    .optional()
    .describe("Toggles the opacity effect on the scatter points."),
  minYValue: z
    .number()
    .optional()
    .describe(
      "Minimum value for the y-axis to ensure all data points are visible."
    ),
  valueFormatter: scatterChartValueFormatterSchema
    .optional()
    .describe(
      "Object containing functions to format the display of data values on the chart. Each key should match the keys used for x, y, and size."
    ),
  showLegend: z
    .boolean()
    .optional()
    .describe("Toggles the display of the chart legend."),
  onValueChange: z
    .function()
    .args(z.any())
    .returns(z.void())
    .optional()
    .describe("Function called when a data point is interacted with."),
});
