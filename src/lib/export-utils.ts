import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportToPDF = (title: string, data: any[], columns: string[]) => {
  const doc = new jsPDF();
  
  // Add Title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30);
  
  // Add Table
  autoTable(doc, {
    startY: 35,
    head: [columns],
    body: data.map(item => Object.values(item)),
    theme: 'striped',
    headStyles: { fillStyle: 'DF', fillColor: [0, 0, 0] },
  });
  
  doc.save(`${title.toLowerCase().replace(/\s/g, '-')}.pdf`);
};

export const exportToExcel = (title: string, data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s/g, '-')}.xlsx`);
};
