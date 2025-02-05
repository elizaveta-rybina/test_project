import { Box, Typography } from '@mui/material';
import { styles } from './ChartComponent.styles';

interface ChartLegendProps {
  barSeries: any[];
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ barSeries }) => {
  return (
    <Box sx={styles.legendContainer}>
      {barSeries.map((series, index) => (
        <Box key={index} sx={styles.legendItem}>
          <Box sx={{ ...styles.legendColor, backgroundColor: series.color }} />
          <Typography>{series.label}</Typography>
        </Box>
      ))}
      <Box sx={styles.legendItem}>
          <Box
            sx={{
              width: '10px',
              height: '2px',
              backgroundColor: '#D6D162',
            }}
          />
        <Typography>Темп прироста, % (год к году)</Typography>
      </Box>
    </Box>
  );
};