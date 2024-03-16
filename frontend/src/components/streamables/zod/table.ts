import * as z from "zod";

export const tableSchema = z.object({
  title: z
    .string()
    .describe("Title of the table. This should be outside the data object"),
  subtitle: z.string().optional().describe("Subtitle of the table."),
  data: z
    .object({
      columns: z.array(z.string().describe("The header of the column.")),
      rows: z.array(
        z
          .object({
            data: z.array(
              z
                .union([z.string(), z.number()])
                .describe(
                  "Data for the cell in the row. Ensure this has a value and isn't an empty string"
                )
            ),
          })
          .describe("The data for the row.")
      ),
    })

    .describe("Data for the table, consists of an array of columns and rows"),
});
