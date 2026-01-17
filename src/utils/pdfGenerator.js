import { jsPDF } from "jspdf";


/* ---------- main ---------- */
export const downloadPDFReport = (result, streamedText, complexity, code) => {
  if (result == null && !streamedText) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const primaryColor = [16, 185, 129];
  const dangerColor = [244, 63, 94];

  /* background */
  doc.setFillColor(249, 250, 251);
  doc.rect(0, 0, 210, 297, "F");

  /* header */
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("AI BASED CODE PLAGIARISM DETECTOR", pageWidth / 2, 25, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("ANALYSIS REPORT", pageWidth / 2, 34, { align: "center" });

  /* meta */
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`REPORT ID: #${Date.now().toString().slice(-8)}`, 140, 50);
  doc.text(`GENERATED: ${new Date().toLocaleString()}`, 140, 55);

  /* summary box */
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

  /* complexity INSIDE box */
  doc.setFontSize(10);
  doc.text(
    `CODE COMPLEXITY: ${complexity || "N/A"}`,
    pageWidth / 2,
    108,
    { align: "center" }
  );

  /* analysis text */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("ANALYSIS DETAILS", 20, 125);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const analysisText = doc.splitTextToSize(streamedText || "", 170);
  doc.text(analysisText, 20, 135);

  let lastY = 135 + analysisText.length * 5;

  /* code preview */
  if (lastY < 225 && code) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("SOURCE CODE PREVIEW", 20, lastY + 15);

    doc.setFillColor(240, 240, 240);
    doc.rect(20, lastY + 20, 170, 60, "F");

    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);

    const codeLines = doc.splitTextToSize(code, 160);
    doc.text(codeLines, 25, lastY + 30);
  }

  /* footer */
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "AI Code Plagiarism Detector | Piyush Ranakoti © 2025",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  doc.save("AI_Code_Analysis_Report.pdf");
};
