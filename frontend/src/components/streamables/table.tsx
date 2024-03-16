import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import * as z from "zod";

import React from "react";
import { tableSchema } from "./zod/table";

const TableStreamable = ({
  title,
  subtitle,
  data,
}: z.infer<typeof tableSchema>) => {
  return (
    <Card className="sm:mx-auto sm:max-w-2xl">
      <h3 className="ml-1 mr-1 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {title}
      </h3>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
        {subtitle}
      </p>
      <Table>
        <TableHead>
          <TableHeaderCell></TableHeaderCell>
          {data.columns.map((col, i) => (
            <TableHeaderCell key={`${col}-${i}`}>{col}</TableHeaderCell>
          ))}
        </TableHead>
        <TableBody>
          {data.rows.map((row, i) => (
            <TableRow
              className="hover:bg-slate-200/30 transition-colors"
              key={`${row}-${i}`}
            >
              <TableCell>{i + 1}</TableCell>
              {row.data.map((cell, j) => (
                <TableCell key={`${cell}-${j}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export { TableStreamable };
