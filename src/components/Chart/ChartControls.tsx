import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { MenuItem, Select, SelectChangeEvent, Box, Button } from '@mui/material';
import { styles } from './ChartComponent.styles';
import React, { useState } from 'react';

interface ChartControlsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isChildrenSelected: boolean;
  setIsChildrenSelected: (isSelected: boolean) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  selectedCategory,
  setSelectedCategory,
  isChildrenSelected,
  setIsChildrenSelected,
}) => {
  const [isChildrenActive, setIsChildrenActive] = useState(false);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleChildrenClick = () => {
    setIsChildrenSelected(!isChildrenSelected);
    if (!isChildrenSelected) {
      setSelectedCategory('Все туристы');
    }

  };

  return (
    <Box sx={{ marginLeft: isChildrenSelected ? 2 : 0, marginBottom: 2 }}>
      {!isChildrenSelected && (
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          sx={{
            ...styles.select,
            '& .MuiSelect-icon': {
              color: 'white',
            },
          }}
          IconComponent={KeyboardArrowDownIcon}
        >
          <MenuItem value="Все туристы">Все туристы</MenuItem>
          <MenuItem value="Граждане РФ">Граждане РФ</MenuItem>
          <MenuItem value="Граждане стран ближнего зарубежья">Граждане стран ближнего зарубежья</MenuItem>
          <MenuItem value="Граждане стран дальнего зарубежья">Граждане стран дальнего зарубежья</MenuItem>
        </Select>
      )}
			<Button
        onClick={handleChildrenClick}
        sx={{
          backgroundColor: isChildrenSelected ? '#4A9FDC' : '#223670',
          color: isChildrenSelected ? '#FFFFFF' : '#FFFFFF',
          marginBottom: 1,
					borderRadius: 2,
        }}
      >
        Дети
      </Button>
    </Box>
  );
};
