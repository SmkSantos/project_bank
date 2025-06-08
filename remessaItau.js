


const fs = require('fs');
const path = require('path');

    

// Função para processar o arquivo
function entradaConfirmada(inputFilePath, outputRetPath, outputTxtPath) {
    const lines = fs.readFileSync(inputFilePath, 'utf-8').split('\n');


    let qtdDocs = 50
    let numTit = "REN-"

    const header = '01REMESSA01COBRANCA       315000525362        QA - WBA SECURFIDC 1          341BANCO ITAU SA  270425                                                                                                                                                                                                                                                                                                      000001\n';
    const footer = '9                                                                                                                                                                                                                                                                                                                                                                                                         000032\n';

    let outputContent = header;

    extractedData.forEach(data => {
        outputContent += `10482595420000122315000525362    00002 00 00 000002 0000122951777802380000000000000109                     I01${numTit}07052500000000135293410000099N270425100000000000000360000000000000000000000000000000000000000000000100043615654811Marcos Antunes                          Rua Rua Elvira Liberatori, 53           Jardim Arpoa05566020Sao Paulo      SPHouses Baheas                     07052500 000017\n`;
    });
    
    outputContent += footer;

    fs.writeFileSync(outputRetPath, outputContent);
    fs.writeFileSync(outputTxtPath, outputContent);

    console.log(`Arquivos gerados: ${outputRetPath}, ${outputTxtPath}`);
}


let inputFile = path.join(__dirname, 'remessaItau.txt')
let outputRet = path.join(__dirname, 'retorno/Itau/Confirmado.ret')

entradaConfirmada(inputFile, outputRet, outputTxt);

