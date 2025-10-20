// Utility to export data to Excel using SheetJS
import * as XLSX from 'xlsx';

/**
 * exportToExcel
 * @param {Object} options
 * @param {string} options.filename - File name like 'reporte.xlsx'
 * @param {Array<{name: string, data: Array<object>}>} options.sheets - Sheets to include
 */
export function exportToExcel({ filename = 'reporte.xlsx', sheets = [] } = {}) {
  const wb = XLSX.utils.book_new();

  if (!sheets || sheets.length === 0) {
    // create an empty sheet to avoid invalid workbook
    const ws = XLSX.utils.aoa_to_sheet([["Sin datos"]]);
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  } else {
    sheets.forEach(({ name, data }) => {
      const safeName = (name || 'Hoja').toString().substring(0, 31);
      const rows = Array.isArray(data) ? data : [];
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, safeName);
    });
  }

  XLSX.writeFile(wb, filename);
}
