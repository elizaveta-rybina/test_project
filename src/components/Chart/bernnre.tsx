
import { Box, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { RootState } from 'app/store'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { transformDataForChart } from 'shared'
import { styles } from './ChartComponent.styles'
import { BarDataItem, BarSeriesItem } from './ChartComponent.types'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const ChartComponent: React.FC = () => {
  const fileData = useSelector((state: RootState) => state.file.data);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все туристы');

  if (!fileData || fileData.length === 0) {
    return <Typography>Нет данных для графика</Typography>;
  }

  const { barData }: { barData: BarDataItem[] } = transformDataForChart(fileData);
  const years = barData.map((item) => item.year);

  // Определяем данные для графика в зависимости от выбранной категории
  const getBarSeries = (category: string): BarSeriesItem[] => {
    if (category === 'Все туристы') {
      return [
        {
          label: 'Граждане РФ',
          data: barData.map((item) => item['Граждане РФ']),
          stack: 'total',
          color: '#1EF3F4',
        },
        {
          label: 'Граждане стран ближнего зарубежья',
          data: barData.map((item) => item['Граждане стран ближнего зарубежья']),
          stack: 'total',
          color: '#957AEB',
        },
        {
          label: 'Граждане стран дальнего зарубежья',
          data: barData.map((item) => item['Граждане стран дальнего зарубежья']),
          stack: 'total',
          color: '#DC62A0',
        },
      ];
    }

    // Для конкретной категории
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
      },
    ];
  };

  const barSeries = getBarSeries(selectedCategory);

  // Вычисляем итоговое значение в зависимости от выбранной категории
  const getTotalTourists = (category: string): number => {
    if (category === 'Все туристы') {
      return barData.reduce((sum, item) => {
        return sum + item['Граждане РФ'] + item['Граждане стран ближнего зарубежья'] + item['Граждане стран дальнего зарубежья'];
      }, 0);
    }

    const categoryKey = category as keyof Omit<BarDataItem, 'year'>;
    return barData.reduce((sum, item) => sum + item[categoryKey], 0);
  };

  const totalTourists = getTotalTourists(selectedCategory);

  // Определяем цвет текста "Итого" в зависимости от выбранной категории
  const getTotalColor = (category: string): string => {
    switch (category) {
      case 'Граждане РФ':
        return '#1EF3F4';
      case 'Граждане стран ближнего зарубежья':
        return '#957AEB';
      case 'Граждане стран дальнего зарубежья':
        return '#DC62A0';
      default:
        return '#957AEB'; // Цвет по умолчанию для "Все туристы"
    }
  };

  const totalColor = getTotalColor(selectedCategory);

  const handleBarClick = (event: { dataIndex: number }) => {
    const clickedYear = years[event.dataIndex];
    setSelectedYear(clickedYear);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  return (
    <Box sx={styles.container}>
      <Paper elevation={3} sx={styles.paper}>
        <Box sx={styles.titleContainer}>
          <Typography variant="h6" gutterBottom sx={styles.title}>
            Динамика туристического потока
          </Typography>
          <Typography
            variant="body1"
            sx={{
              ...styles.totalTourists,
              color: totalColor, // Динамически изменяемый цвет
            }}
          >
            Итого: {totalTourists} млн
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            sx={{
              width: '200px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontFamily: '"Montserrat", serif',
              fontWeight: '700',
              border: 0,
              '& .MuiSelect-select': {
                padding: '8px 16px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none', // Убираем обводку
              },
            }}
            IconComponent={KeyboardArrowDownIcon} // Заменяем иконку
          >
            <MenuItem value="Все туристы">Все туристы</MenuItem>
            <MenuItem value="Граждане РФ">Граждане РФ</MenuItem>
            <MenuItem value="Граждане стран ближнего зарубежья">Граждане стран ближнего зарубежья</MenuItem>
            <MenuItem value="Граждане стран дальнего зарубежья">Граждане стран дальнего зарубежья</MenuItem>
          </Select>
        </Box>
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              disableLine: true,
              data: years,
              valueFormatter: (value) => value.toString(),
              tickSize: 0,
            },
          ]}
          yAxis={[
            {
              tickSize: 0,
              disableLine: true,
            },
          ]}
          series={barSeries.map((series) => ({
            ...series,
            onItemClick: (event: { dataIndex: number }) => handleBarClick(event),
          }))}
          width={700}
          height={300}
          sx={{
            [`& .MuiChartsAxis-root text`]: {
              fill: 'inherit',
            },
          }}
          grid={{ horizontal: true }}
          slotProps={{ legend: { hidden: true } }}
        />
        <Box sx={styles.legendContainer}>
          {barSeries.map((series, index) => (
            <Box key={index} sx={styles.legendItem}>
              <Box sx={{ ...styles.legendColor, backgroundColor: series.color }} />
              <Typography>{series.label}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};