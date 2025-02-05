export interface BarDataItem {
  year: number;
  'Граждане РФ': number;
  'Граждане стран ближнего зарубежья': number;
  'Граждане стран дальнего зарубежья': number;
  'Дети': number;
}

export interface BarSeriesItem {
  label: string;
  data: number[];
  stack: string;
  color: string;
}