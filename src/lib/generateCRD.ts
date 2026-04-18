import { jsPDF } from "jspdf";

export type QAPair = { question: string; answer: string };

export function generateCRDPdf(opts: {
  service: string;
  qa: QAPair[];
  summary: string;
  email: string;
  name?: string;
}) {
  const { service, qa, summary, email, name } = opts;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  // Header bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Client Requirement Document", margin, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Ameego Labs — Discovery Summary", margin, 70);
  y = 120;

  // Meta block
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Generated:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleString(), margin + 70, y);
  y += 16;

  doc.setFont("helvetica", "bold");
  doc.text("Email:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(email, margin + 70, y);
  y += 16;

  if (name) {
    doc.setFont("helvetica", "bold");
    doc.text("Name:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(name, margin + 70, y);
    y += 16;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Service:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(service, margin + 70, y);
  y += 28;

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Executive Summary", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(summary || "—", pageW - margin * 2);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 14 + 18;

  // Q&A
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Discovery Q&A", margin, y);
  y += 18;

  qa.forEach((pair, i) => {
    if (y > pageH - margin - 60) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    const qLines = doc.splitTextToSize(`Q${i + 1}. ${pair.question}`, pageW - margin * 2);
    doc.text(qLines, margin, y);
    y += qLines.length * 14 + 4;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const aLines = doc.splitTextToSize(`→ ${pair.answer}`, pageW - margin * 2 - 12);
    doc.text(aLines, margin + 12, y);
    y += aLines.length * 14 + 14;
  });

  // Footer on each page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Ameego Labs · ameegolabs.com · Page ${p} of ${pages}`,
      pageW / 2,
      pageH - 20,
      { align: "center" },
    );
  }

  doc.save(`Ameego-CRD-${service.replace(/\s+/g, "-")}-${Date.now()}.pdf`);
}
