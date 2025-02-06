import { BarDataItem } from 'components/Chart/ChartComponent.types';

export const calculateYearlyGrowthRate = (barData: BarDataItem[]): number[] => {
  const growthRates: number[] = [];
  growthRates.push(0);

  for (let i = 1; i < barData.length; i++) {
    const previousYearTotal =
      barData[i - 1]['Граждане РФ'] +
      barData[i - 1]['Граждане стран ближнего зарубежья'] +
      barData[i - 1]['Граждане стран дальнего зарубежья'];

    const currentYearTotal =
      barData[i]['Граждане РФ'] +
      barData[i]['Граждане стран ближнего зарубежья'] +
      barData[i]['Граждане стран дальнего зарубежья'];

    const growthRate = ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;

    // Добавляем округленное значение к массиву
    growthRates.push(parseFloat(growthRate.toFixed(2)));
  }

  return growthRates;
};

export const getBarSeries = (barData: BarDataItem[], category: string, isChildrenSelected: boolean) => {
  if (isChildrenSelected) {
    return [
      {
        label: 'Дети',
        data: barData.map((item) => item['Граждане РФ'] + item['Граждане стран ближнего зарубежья'] + item['Граждане стран дальнего зарубежья']),
        stack: 'total',
        color: '#D1916A', // Single color for children
        type: 'bar' as const,
        valueFormatter: (value: number) => value.toString(), // Display absolute value
      },
    ];
  }

  if (category === 'Все туристы') {
    return [
      {
        label: 'Граждане РФ',
        data: barData.map((item) => item['Граждане РФ']),
        stack: 'total',
        color: '#1EF3F4',
        type: 'bar' as const,
      },
      {
        label: 'Граждане стран ближнего зарубежья',
        data: barData.map((item) => item['Граждане стран ближнего зарубежья']),
        stack: 'total',
        color: '#957AEB',
        type: 'bar' as const,
      },
      {
        label: 'Граждане стран дальнего зарубежья',
        data: barData.map((item) => item['Граждане стран дальнего зарубежья']),
        stack: 'total',
        color: '#DC62A0',
        type: 'bar' as const,
      },
    ];
  }

  const categoryKey = category as keyof Omit<BarDataItem, 'year'>;
  return [
    {
      label: category,
      data: barData.map((item) => item[categoryKey]),
      stack: 'total',
      color:
        category === 'Граждане РФ'
          ? '#1EF3F4'
          : category === 'Граждане стран ближнего зарубежья'
          ? '#957AEB'
          : '#DC62A0',
      type: 'bar' as const,
    },
  ];
};

export const getTotalTourists = (barData: BarDataItem[], category: string): number => {
  if (category === 'Все туристы') {
    return barData.reduce((sum, item) => {
      return sum + item['Граждане РФ'] + item['Граждане стран ближнего зарубежья'] + item['Граждане стран дальнего зарубежья'];
    }, 0);
  }

  const categoryKey = category as keyof Omit<BarDataItem, 'year'>;
  return barData.reduce((sum, item) => sum + item[categoryKey], 0);
};

export const getTotalColor = (category: string): string => {
  switch (category) {
    case 'Граждане РФ':
      return '#1EF3F4';
    case 'Граждане стран ближнего зарубежья':
      return '#957AEB';
    case 'Граждане стран дальнего зарубежья':
      return '#DC62A0';
    default:
      return '#957AEB';
  }
};

export const calculateYearlyGrowthRateForChildren = (barData: BarDataItem[]): number[] => {
  const growthRates: number[] = [];
  growthRates.push(0);

  for (let i = 1; i < barData.length; i++) {
    const previousYearValue = String(barData[i - 1]['дети']);
    const currentYearValue = String(barData[i]['дети']);

    const previousYearChildren = previousYearValue === 'да' ? 1 : 0;
    const currentYearChildren = currentYearValue === 'да' ? 1 : 0;

    if (previousYearChildren === 0) {
      growthRates.push(0);
    } else {
      const growthRate = ((currentYearChildren - previousYearChildren) / previousYearChildren) * 100;
      growthRates.push(parseFloat(growthRate.toFixed(2)));
    }
  }

  return growthRates;
};




