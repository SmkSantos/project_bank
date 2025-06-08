


const fs = require('fs');
const path = require('path');

// Função para processar o arquivo
function entradaConfirmada(inputFilePath, outputRetPath, outputTxtPath) {
    const lines = fs.readFileSync(inputFilePath, 'utf-8').split('\n');
    
    let extractedData = [];
    
    lines.forEach(line => {
        if (line.startsWith('1')) { // Verifica se a primeira coluna é igual a '1'
            const data = {
                field1: line.substring(37, 62),  
                field2: line.substring(110, 120),
                field3: line.substring(63, 74),  
                field4: line.substring(150, 156),
                field5: line.substring(174, 187),
                field6: line.substring(120, 126),
            };
            extractedData.push(data);
        }
    });
    
    const header = '02RETORNO01COBRANCA  00001000314271562000032677561                          336BANCO C6 S.A.                000100000002    140325                                                                                                                                                                                                                                                                        000001\n';
    const footer = '9 0000000000100000000100000000000000000000                                                                                                                                                                                                                                                                                                                                                                000003\n';
    
    let outputContent = header;
    extractedData.forEach(data => {
        outputContent += `10243777342000125000314271562        ${data.field1}${data.field3} 234318414                       2002      ${data.field2}                    ${data.field6}${data.field5}00000000  0000000000000                                       00000000000000000000000000000000000000000000000000000000000000000   000000                                                                0000000000000000000000000000 000002\n`;
    });
    outputContent += footer;
    
    fs.writeFileSync(outputRetPath, outputContent);
    fs.writeFileSync(outputTxtPath, outputContent);
    
    console.log(`Arquivos gerados: ${outputRetPath}, ${outputTxtPath}`);
}

// Exemplo de uso
let inputFile = path.join(__dirname, 'remessa.txt'); // Arquivo de entrada
let outputRet = path.join(__dirname, 'retorno/Confirmado.ret'); // Arquivo de saída .ret
let outputTxt = path.join(__dirname, 'retorno/COnfirmado.txt'); // Arquivo de saída .txt

entradaConfirmada(inputFile, outputRet, outputTxt);

