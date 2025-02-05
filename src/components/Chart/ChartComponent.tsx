import { Box, Typography } from '@mui/material';
import { BarPlot, ChartsGrid, ChartsXAxis, ChartsYAxis, LinePlot, ResponsiveChartContainer, MarkElement } from '@mui/x-charts';
import { RootState } from 'app/store';
import { ChartTotal } from 'components/Chart/ChartTotal';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { transformDataForChart } from 'shared';
import { calculateYearlyGrowthRate, getTotalColor, getTotalTourists } from 'shared/chartUtils';
import { styles } from './ChartComponent.styles';
import { BarDataItem } from './ChartComponent.types';
import { ChartControls } from './ChartControls';
import { ChartLegend } from './ChartLegend';
import { makeStyles } from '@mui/styles';

// Создаем стили для ChartsGrid
const useStyles = makeStyles({
  grid: {
    '& line': {
      stroke: 'rgba(240,240,240,0.2)',
    },
    zIndex: -1,
  },
});

export const ChartComponent: React.FC = () => {
  const fileData = useSelector((state: RootState) => state.file.data);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все туристы');
  const classes = useStyles(); // Используем стили

  if (!fileData || fileData.length === 0) {
    return <Typography>Нет данных для графика</Typography>;
  }

  const { barData }: { barData: BarDataItem[] } = transformDataForChart(fileData);
  const years = barData.map((item) => item.year);

  // Данные для графика
  const barSeries =
    selectedCategory === 'Все туристы'
      ? [
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
        ]
      : [
          {
            label: selectedCategory,
            data: barData.map((item) => item[selectedCategory as keyof BarDataItem] || 0),
            stack: 'total',
            color: getTotalColor(selectedCategory),
            type: 'bar' as const,
          },
        ];

  // Рассчитываем CAGR для выбранной категории
  const growthRates = calculateYearlyGrowthRate(
    barData.map((item) => ({
      ...item,
      'Граждане РФ':
        selectedCategory === 'Все туристы'
          ? item['Граждане РФ'] +
            item['Граждане стран ближнего зарубежья'] +
            item['Граждане стран дальнего зарубежья']
          : item[selectedCategory as keyof BarDataItem] || 0,
    }))
  );

  const totalTourists = getTotalTourists(barData, selectedCategory);
  const totalColor = getTotalColor(selectedCategory);

  const lineSeries = [
    {
      label: 'Темп прироста, % (год к году)',
      data: growthRates,
      type: 'line' as const,
      color: '#D6D162',
      showMark: true, // Включаем точки
      mark: {
        // Настройки для точек
        size: 8, // Размер точек
        color: '#D6D162', // Цвет точек
        stroke: '#FFFFFF', // Обводка точек
        strokeWidth: 2, // Толщина обводки
      },
      curve: 'linear' as const,
      yAxisKey: 'right-y-axis',
    },
  ];

  // Функция для расчета шага оси Y
  const calculateTickInterval = (maxValue: number): number[] => {
    if (maxValue <= 100) return [0, 20, 40, 60, 80, 100];
    if (maxValue <= 500) return [0, 100, 200, 300, 400, 500];
    if (maxValue <= 1000) return [0, 200, 400, 600, 800, 1000];
    return [0, 500, 1000, 1500, 2000];
  };

  // Максимальное значение для левой оси Y
  const maxLeftYValue =
    selectedCategory === 'Все туристы'
      ? Math.max(...barData.map((item) => item['Граждане РФ'] + item['Граждане стран ближнего зарубежья'] + item['Граждане стран дальнего зарубежья']))
      : Math.max(...barData.map((item) => item[selectedCategory as keyof BarDataItem] || 0));

  // Шаг для левой оси Y
  const leftYTickInterval = calculateTickInterval(maxLeftYValue);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.titleContainer}>
        <Typography variant="h6" gutterBottom sx={{ ...styles.title, fontFamily: '"Montserrat", serif', fontWeight: 400 }}>
          Динамика туристического потока
        </Typography>
        <ChartTotal totalTourists={totalTourists} totalColor={totalColor} />
      </Box>
      <ChartControls selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <ResponsiveChartContainer
        width={700}
        height={300}
        series={[...barSeries, ...lineSeries]}
        xAxis={[
          {
            id: 'x-axis',
            scaleType: 'band',
            data: years,
            tickSize: 0,
            disableLine: true,
            valueFormatter: (value: string | number) => value.toString(),
          },
        ]}
        yAxis={[
          {
            id: 'left-y-axis',
            position: 'left',
            disableLine: true,
            tickSize: 0,
            min: 0,
            max: maxLeftYValue + 100,
            tickInterval: leftYTickInterval,
          },
          {
            id: 'right-y-axis',
            position: 'right',
            min: -100,
            max: 200,
            disableLine: true,
            tickSize: 0,
            valueFormatter: (value: number) => `${value} %`,
          },
        ]}
      >
        <g>
          <BarPlot />
          <LinePlot />
        </g>
        <ChartsGrid
          horizontal
          classes={{ root: classes.grid }} // Применяем стили к сетке
        />
        <ChartsXAxis
          axisId="x-axis"
          sx={{
            stroke: '#E0E0E0',
            fontFamily: '"Montserrat", serif',
            fontWeight: 400,
          }}
        />
        <ChartsYAxis
          axisId="left-y-axis"
          sx={{
            stroke: '#E0E0E0', // Серый цвет для левой оси Y
            fontFamily: '"Montserrat", serif',
            fontWeight: 400,
          }}
        />
        <ChartsYAxis
          axisId="right-y-axis"
          sx={{
            stroke: '#D6D162',
            fontFamily: '"Montserrat", serif',
            fontWeight: 400,
          }}
        />
      </ResponsiveChartContainer>
      <ChartLegend barSeries={barSeries} />
    </Box>
  );
};