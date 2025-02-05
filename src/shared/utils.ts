import * as XLSX from 'xlsx'

interface DataRow {
  ID: number;
  year: number;
  region: string;
  country: string;
  touristCategory: string;
  children: string;
  touristCount: number;
  touristCountPreviousYear: number;
}

interface ChartData {
  year: number;
  categories: { [key: string]: number };
  cagr: number;
}

export const convertXLSXToJSON = (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as unknown[][];

        const formattedData = rows.map((row) => {
          const obj: DataRow = {
            ID: Number(row[headers.indexOf("ID")]),
            year: Number(row[headers.indexOf("год")]),
            region: String(row[headers.indexOf("регион")]),
            country: String(row[headers.indexOf("страна")]),
            touristCategory: String(row[headers.indexOf("категория туриста")]),
            children: String(row[headers.indexOf("дети")]),
            touristCount: Number(row[headers.indexOf("count_turist")]),
            touristCountPreviousYear: Number(row[headers.indexOf("count_turist_befo_year")]),
          };
          return obj;
        });

        resolve(formattedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Ошибка при чтении файла'));
    };

    reader.readAsArrayBuffer(file);
  });
};

// Функция для агрегации данных по году и категории туриста
const aggregateData = (data: DataRow[]): ChartData[] => {
  const result: ChartData[] = [];
  
  // Группируем данные по году
  data.forEach(item => {
    const yearData = result.find(entry => entry.year === item.year);
    if (!yearData) {
      result.push({
        year: item.year,
        categories: {
          "Граждане РФ": 0,
          "Граждане стран ближнего зарубежья": 0,
          "Граждане стран дальнего зарубежья": 0,
        },
        cagr: 0,
      });
    }
  });

  // Наполняем категории данными
  data.forEach(item => {
    const yearData = result.find(entry => entry.year === item.year);
    if (yearData) {
      yearData.categories[item.touristCategory] += item.touristCount;
    }
  });

  return result;
};

// Функция для расчета CAGR
const calculateCAGR = (data: ChartData[]): ChartData[] => {
  for (let i = 1; i < data.length; i++) {
    const previousYearData = data[i - 1];
    const currentYearData = data[i];

    const cagr = {
      "Граждане РФ": calculateYearCAGR(previousYearData.categories["Граждане РФ"], currentYearData.categories["Граждане РФ"]),
      "Граждане стран ближнего зарубежья": calculateYearCAGR(previousYearData.categories["Граждане стран ближнего зарубежья"], currentYearData.categories["Граждане стран ближнего зарубежья"]),
      "Граждане стран дальнего зарубежья": calculateYearCAGR(previousYearData.categories["Граждане стран дальнего зарубежья"], currentYearData.categories["Граждане стран дальнего зарубежья"]),
    };

    // Расчитываем CAGR для каждой категории
    currentYearData.cagr = (cagr["Граждане РФ"] + cagr["Граждане стран ближнего зарубежья"] + cagr["Граждане стран дальнего зарубежья"]) / 3;
  }

  return data;
};

// Функция для расчета CAGR для одной категории
const calculateYearCAGR = (previousValue: number, currentValue: number): number => {
  if (previousValue === 0) return 0;
  return ((currentValue / previousValue) ** (1 / 1) - 1) * 100; // Поскольку данные годовые, используем 1 год
};

// Преобразование данных
export const transformDataForChart = (data: DataRow[]): { barData: any, lineData: any } => {
  const aggregatedData = aggregateData(data);
  const dataWithCAGR = calculateCAGR(aggregatedData);

  const barData = dataWithCAGR.map(entry => ({
    year: entry.year,
    "Граждане РФ": entry.categories["Граждане РФ"],
    "Граждане стран ближнего зарубежья": entry.categories["Граждане стран ближнего зарубежья"],
    "Граждане стран дальнего зарубежья": entry.categories["Граждане стран дальнего зарубежья"],
  }));

  const lineData = dataWithCAGR.map(entry => ({
    year: entry.year,
    cagr: entry.cagr,
  }));

  return { barData, lineData };
};
