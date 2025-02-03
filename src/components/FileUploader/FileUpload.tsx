import React from 'react'
import toast from 'react-hot-toast'
import { convertXLSXToJSON } from 'shared'
import styles from './FileUpload.module.scss'

export const FileUpload: React.FC = () => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.error('Файл не выбран');
      return;
    }

    try {
      const jsonData = await convertXLSXToJSON(file);
      console.log('Конвертированные данные:', jsonData);
      toast.success('Файл успешно загружен и готов к использованию');
    } catch (error) {
      console.error('Ошибка при конвертации файла:', error);
      toast.error('Ошибка при загрузке файла');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Конвертируйте файл</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className={styles.fileInput}
      />
    </div>
  );
};