import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { MenuItem, Select, SelectChangeEvent, Box } from '@mui/material';
import { styles } from './ChartComponent.styles';

interface ChartControlsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({ selectedCategory, setSelectedCategory }) => {
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        sx={{
          ...styles.select, // Ваши существующие стили
          '& .MuiSelect-icon': {
            color: 'white', // Белый цвет иконки
          },
        }}
        IconComponent={KeyboardArrowDownIcon}
      >
        <MenuItem value="Все туристы">Все туристы</MenuItem>
        <MenuItem value="Граждане РФ">Граждане РФ</MenuItem>
        <MenuItem value="Граждане стран ближнего зарубежья">Граждане стран ближнего зарубежья</MenuItem>
        <MenuItem value="Граждане стран дальнего зарубежья">Граждане стран дальнего зарубежья</MenuItem>
      </Select>
    </Box>
  );
};