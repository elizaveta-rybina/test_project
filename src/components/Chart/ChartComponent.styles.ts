import { Padding } from '@mui/icons-material'
import { Box, Typography } from '@mui/material';

export const styles = {
  select: {
    width: '160px',
    backgroundColor: 'transparent',
    color: 'white',
    borderRadius: '4px',
    fontFamily: '"Montserrat", serif',
    fontWeight: '500',
    border: 0,
    '& .MuiSelect-select': {
      padding: '8px 16px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  icon: {
    color: 'white',
  },
  container: {
    padding: 4,
    borderRadius: '4rem',
    backgroundColor: '#091F60',
  },
  paper: {
    padding: 2,
    backgroundColor: '#091F60',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
	customGrid: {
  stroke: "#B0B0B0"
	},
  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: '17px',
    fontFamily: '"Montserrat", serif',
  },
  totalTourists: {
    color: '#957AEB',
    fontSize: '22px',
    fontWeight: 'bold',
    lineHeight: '28px',
    paddingLeft: '10px',
    fontFamily: '"Montserrat", serif',
    paddingBottom: '6px',
  },
  legendContainer: {
		padding: "0 20px",
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
		justifyContent: 'center',
    gap: '8px',
    marginTop: 2,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    marginRight: 1,
  },
};
