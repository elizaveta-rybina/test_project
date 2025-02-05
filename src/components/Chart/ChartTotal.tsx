import { Typography } from '@mui/material'
import { styles } from './ChartComponent.styles';

interface ChartTotalProps {
  totalTourists: number;
  totalColor: string;
}

export const ChartTotal: React.FC<ChartTotalProps> = ({ totalTourists, totalColor }) => {
  return (
    <Typography
      variant="body1"
      sx={{
        ...styles.totalTourists,
        color: totalColor,
      }}
    >
      Итого: {totalTourists} млн
    </Typography>
  );
};
