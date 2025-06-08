


const fs = require('fs');
const path = require('path');

const data = new Date(); // ou qualquer data que você queira
const dia = String(data.getDate()).padStart(2, '0');
const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
const ano = String(data.getFullYear()).slice(-2); // Últimos 2 dígitos do ano

let formato = `${dia}${mes}${ano}`;

// Função para processar o arquivo
function entradaConfirmada(inputFilePath, outputRetPath, outputTxtPath) {
    const lines = fs.readFileSync(inputFilePath, 'utf-8').split('\n');

    let extractedData = [];
    let typeOc = "06P"

    // 01, 02, 06d, 12, 14, 19, 16, 23, 06AM, 06T, 08

    lines.forEach(line => {
        if (line.startsWith('1')) { // Verifica se a primeira coluna é igual a '1'
            const data = {
                ctrlPart: line.substring(37, 62),
                numDoc: line.substring(110, 120),
                nn: line.substring(62, 70),
                emissaoTit: line.substring(150, 156),
                valorTitulo: line.substring(126, 139),
                vcto: line.substring(120, 126),
                valorPago: "0000000000000",
                valorDesconto: "0000000000000",
                valorAbatimento:"0000000000000",
                numOco : ""
            };
            extractedData.push(data);
        }
    });

    const header = '02RETORNO01COBRANCA       170400269578        QA - WBA SECURFIDC            341BANCO ITAU S.A.30072401600BPI00047230124                                                                                                                                                                                                                                                                                   000001\n';
    const footer = '9201341          000000000000000000000000000000          000000000000000000040000000000                                                  000000000000000000000000000000          0000006800000377600825  19/01S000470000002100000193854243                                                                                                                                                                000004\n';

    let outputContent = header;
    extractedData.forEach(data => {


        switch (typeOc) {
            case "01":
                data.numOco = "01"
                break;
            case "02":
                data.numOco = "02"
                break;
            case "03":
                data.numOco = "03"
                break;
            case "08":
                data.valorPago = data.valorTitulo;
                data.numOco = "08"
                break;
            case "06D":
                data.numOco = "06"
                let vp1 = parseInt(data.valorTitulo) - (parseInt(data.valorTitulo * 0.23) )
                data.valorPago = String(vp1).padStart(13,"0")
                data.valorDesconto = String(parseInt(data.valorTitulo * 0.23)).padStart(13,"0")            
                break;
            case "06P":
                data.numOco = "06"
                let vp = parseInt(data.valorTitulo) - (parseInt(data.valorTitulo * 0.23) )
                data.valorPago = String(vp).padStart(13,"0")                 
                console.log(data.valorPago)
                break;
            case "06T":
                data.numOco = "06"
                data.valorPago = data.valorTitulo;
                break;
            case "06AM":
                data.numOco = "06"
                let vp2 = parseInt(data.valorTitulo) + 5000
                data.valorPago = String(vp2).padStart(13,"0")   
                break;
            case "12":
                data.numOco = "12"
                let vab = parseInt(data.valorTitulo * 0.23)
                data.valorAbatimento = String(vab).padStart(13,"0")                 
                break;
            case "14":
                data.numOco = "14"
                data.vcto = "040625"
                formato = "000000"
                break;
            case "19":
                data.numOco = "19"           
                break;
            case "16":
                data.numOco = "16"           
                break;           
            case "23":
                data.numOco = "23"           
                break; 
            default:
                data.valorPago = "0000000000000"; // Valor padrão, caso algo inesperado ocorra
        }


        outputContent += `10251030944000142315000525362        ${data.ctrlPart}${data.nn}            109${data.nn}0             I${data.numOco}${formato}${data.numDoc} 00000347           ${data.vcto}${data.valorTitulo}23777482900000000000000000000000000000000000000000000000000000${data.valorAbatimento}${data.valorDesconto}${data.valorPago}000000000000000000000000000         00000000000000000000000AGILFARMA MEDICAMENTOS LTDA                                          000002\n`;
    });
    outputContent += footer;

    fs.writeFileSync(outputRetPath, outputContent);
    fs.writeFileSync(outputTxtPath, outputContent);

    console.log(`Arquivos gerados: ${outputRetPath}, ${outputTxtPath}`);
}

// Exemplo de uso
let inputFile = path.join(__dirname, 'remessaItau.txt'); // Arquivo de entrada
let outputRet = path.join(__dirname, 'retorno/Itau/Confirmado.ret'); // Arquivo de saída .ret
let outputTxt = path.join(__dirname, 'retorno/Itau/Confirmado.txt'); // Arquivo de saída .txt

entradaConfirmada(inputFile, outputRet, outputTxt);

