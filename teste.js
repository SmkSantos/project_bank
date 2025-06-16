

const fs = require('fs');
const { Document, Packer, Paragraph } = require('docx');
const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas');
const ExcelJS = require('exceljs');
const csv = require('fast-csv');

// Função para gerar conteúdo aleatório
const generateRandomData = (sizeInBytes) => {
    return Buffer.alloc(sizeInBytes, 'A');
};

// Gerar arquivo TXT
const generateTXT = (filename, size) => {
    fs.writeFileSync(filename, generateRandomData(size));
    console.log(`TXT criado: ${filename}`);
};

// Gerar arquivo DOCX
const generateDOCX = async (filename, size) => {
    const doc = new Document({
        sections: [{
            children: [new Paragraph("Arquivo gerado automaticamente.")],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filename, Buffer.concat([buffer, generateRandomData(size - buffer.length)]));
    console.log(`DOCX criado: ${filename}`);
};

// Gerar arquivo PDF
const generatePDF = (filename, size) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);
    doc.text("Arquivo gerado automaticamente.");
    doc.end();

    stream.on("finish", () => {
        fs.appendFileSync(filename, generateRandomData(size - fs.statSync(filename).size));
        console.log(`PDF criado: ${filename}`);
    });
};

// Gerar arquivo XLSX
const generateXLSX = async (filename, size) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    for (let i = 0; i < 10000; i++) {
        worksheet.addRow(['Texto gerado', Math.random()]);
    }

    await workbook.xlsx.writeFile(filename);
    fs.appendFileSync(filename, generateRandomData(size - fs.statSync(filename).size));
    console.log(`XLSX criado: ${filename}`);
};

// Gerar arquivo CSV
const generateCSV = (filename, size) => {
    const stream = fs.createWriteStream(filename);
    const csvStream = csv.format({ headers: true });

    csvStream.pipe(stream).on('finish', () => {
        fs.appendFileSync(filename, generateRandomData(size - fs.statSync(filename).size));
        console.log(`CSV criado: ${filename}`);
    });

    for (let i = 0; i < 100000; i++) {
        csvStream.write({ Coluna1: "Dado Aleatório", Coluna2: Math.random() });
    }
    csvStream.end();
};

// Gerar imagem PNG
const generatePNG = (filename, size) => {
    const canvas = createCanvas(2000, 2000);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 2000, 2000);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filename, Buffer.concat([buffer, generateRandomData(size - buffer.length)]));
    console.log(`PNG criado: ${filename}`);
};

// Chamar funções para criar arquivos de 10 MB (para testar)
const size = 10 * 1024 * 1024; // 10MB, pode aumentar até 10GB

generateTXT("arquivo.txt", size);
generateDOCX("arquivo.docx", size);
generatePDF("arquivo.pdf", size);
generateXLSX("arquivo.xlsx", size);
generateCSV("arquivo.csv", size);
generatePNG("arquivo.png", size);
