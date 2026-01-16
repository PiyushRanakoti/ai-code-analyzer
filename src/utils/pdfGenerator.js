import { jsPDF } from 'jspdf';

export const downloadPDFReport = (result, streamedText, complexity, code) => {
  if (!result && !streamedText) return;
  
  const doc = new jsPDF();
  const primaryColor = [16, 185, 129]; 

  doc.setFillColor(249, 250, 251);
  doc.rect(0, 0, 210, 297, 'F');
  
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('ANALYSIS REPORT', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`PROJECT: AI BASED CODE PLAGIARISM DETECTOR`, 20, 34);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.text(`REPORT ID: #${Date.now().toString().slice(-8)}`, 140, 50);
  doc.text(`GENERATED: ${new Date().toLocaleString()}`, 140, 55);
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, 65, 170, 45, 3, 3, 'S');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DETECTION SUMMARY', 30, 75);
  
  doc.setFontSize(32);
  doc.setTextColor(result > 50 ? 244 : primaryColor[0], result > 50 ? 63 : primaryColor[1], result > 50 ? 94 : primaryColor[2]);
  doc.text(`${result}%`, 30, 95);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('AI CONFIDENCE SCORE', 65, 95);
  
  doc.setFontSize(10);
  doc.text(`CODE COMPLEXITY: ${complexity || 'N/A'}`, 30, 103);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NEURAL ANALYSIS DETAILS', 20, 125);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const splitText = doc.splitTextToSize(streamedText, 170);
  doc.text(splitText, 20, 135);
  
  const lastY = 135 + (splitText.length * 5);
  if (lastY < 230) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('SOURCE CODE PREVIEW', 20, lastY + 15);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(20, lastY + 20, 170, 60, 'F');
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const codeLines = doc.splitTextToSize(code.substring(0, 800), 160);
    doc.text(codeLines, 25, lastY + 30);
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('© 2025 Team Greater Noida | Powered by Advanced Linguistic AI Models', 105, 285, { align: 'center' });

  doc.save(`AI_Code_Analysis_Report.pdf`);
};
