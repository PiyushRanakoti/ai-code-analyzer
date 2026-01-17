import { jsPDF } from "jspdf";

export const downloadPDFReport = (result, streamedText, complexity, code) => {
  if (result == null && !streamedText) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  const primaryColor = [16, 185, 129];
  const dangerColor = [244, 63, 94];

  const checkPageBreak = (currentY, neededHeight) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      doc.setFillColor(249, 250, 251);
      doc.rect(0, 0, 210, 297, "F");
      return 20;
    }
    return currentY;
  };

  doc.setFillColor(249, 250, 251);
  doc.rect(0, 0, 210, 297, "F");

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("AI BASED CODE PLAGIARISM DETECTOR", pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("ANALYSIS REPORT", pageWidth / 2, 34, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`REPORT ID: #${Date.now().toString().slice(-8)}`, 140, 50);
  doc.text(`GENERATED: ${new Date().toLocaleString()}`, 140, 55);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, 65, 170, 45, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("DETECTION SUMMARY", pageWidth / 2, 75, { align: "center" });

  doc.setFontSize(32);
  doc.setTextColor(...(result > 50 ? dangerColor : primaryColor));
  doc.text(`${result ?? 0}%`, pageWidth / 2, 95, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("AI CONFIDENCE SCORE", pageWidth / 2, 102, { align: "center" });
  doc.setFontSize(10);
  doc.text(`CODE COMPLEXITY: ${complexity || "N/A"}`, pageWidth / 2, 108, { align: "center" });

  let currentY = 125;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("ANALYSIS DETAILS", 20, currentY);

  currentY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const analysisLines = doc.splitTextToSize(streamedText || "", contentWidth);
  
  analysisLines.forEach((line) => {
    currentY = checkPageBreak(currentY, 7);
    doc.text(line, margin, currentY);
    currentY += 6;
  });

  if (code) {
    currentY = checkPageBreak(currentY, 30);
    currentY += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("SOURCE CODE PREVIEW", margin, currentY);
    
    currentY += 5;
    
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    const codeLines = doc.splitTextToSize(code, contentWidth - 10);
    const lineHeight = 5;
    
    codeLines.forEach((line) => {
      const nextY = checkPageBreak(currentY, lineHeight + 5);
      
      if (nextY < currentY) {
        currentY = nextY + 10;
      }

      doc.setFillColor(240, 240, 240);
      doc.rect(margin, currentY - 4, contentWidth, lineHeight + 1, "F");
      
      doc.setTextColor(80, 80, 80);
      doc.text(line, margin + 5, currentY);
      currentY += lineHeight;
    });
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `AI Code Plagiarism Detector | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save("AI_Code_Analysis_Report.pdf");
};