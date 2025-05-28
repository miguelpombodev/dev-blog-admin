export interface IPieChartProps<T> {
  dataKey: string;
  nameKey: string;
  title: string;
  data: T[];
  totalCount: number;
}
