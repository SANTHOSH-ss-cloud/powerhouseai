import pptxgen from "pptxgenjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver"; // Usually included or can use simple blob download

// Helper for blob download
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generatePptFile(title: string, slides: { title: string; content: string[] }[]) {
  const ppt = new pptxgen();
  ppt.title = title;

  // Title Slide
  const titleSlide = ppt.addSlide();
  titleSlide.addText(title, { x: 1, y: 2, w: 8, h: 2, fontSize: 44, align: "center", bold: true });

  // Content Slides
  slides.forEach((slide) => {
    const newSlide = ppt.addSlide();
    newSlide.addText(slide.title, { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, bold: true });
    
    const bulletPoints = slide.content.map(text => ({ text, options: { bullet: true, fontSize: 18 } }));
    newSlide.addText(bulletPoints, { x: 0.5, y: 1.5, w: 9, h: 5, align: "left" });
  });

  await ppt.writeFile({ fileName: `${title.replace(/\s+/g, "_")}.pptx` });
}

export async function generatePdfFile(title: string, content: string) {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(content.replace(/#/g, ""), 170); // Simple markdown stripping for now
  doc.text(splitText, 20, 40);
  
  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

export async function generateWordFile(title: string, content: string) {
  // Simple markdown to docx conversion
  const lines = content.split("\n");
  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 }
    })
  ];

  lines.forEach(line => {
    if (line.startsWith("###")) {
      children.push(new Paragraph({ text: line.replace("###", "").trim(), heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }));
    } else if (line.startsWith("##")) {
      children.push(new Paragraph({ text: line.replace("##", "").trim(), heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } }));
    } else if (line.startsWith("#")) {
      children.push(new Paragraph({ text: line.replace("#", "").trim(), heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }));
    } else if (line.trim() !== "") {
      children.push(new Paragraph({ children: [new TextRun(line.trim())], spacing: { after: 100 } }));
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${title.replace(/\s+/g, "_")}.docx`);
}
