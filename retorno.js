

const fs = require('fs');

function transformarEmRetorno(conteudo) {
    // Simulação: Adiciona um prefixo "RETORNO: " em cada linha
    return conteudo.split('\n').map(linha => `RETORNO: ${linha}`).join('\n');
}

function processarLinha(linha) {

    // Pega os caracteres das colunas 3 a 5 (índices 2 a 4 no JS)
    let valorExtraido = linha.substring(2, 5);

    // Modifica a linha inserindo o valor extraído na posição 5 a 6
    let novaLinha = linha.substring(0, 5) + valorExtraido + linha.substring(6);

    return novaLinha;
}

fs.readFile('remessa.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    // Transforma a remessa em retorno
    const retorno = transformarEmRetorno(data);

    // Salva o novo arquivo
    fs.writeFile('retorno.txt', retorno, (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo de retorno:', err);
            return;
        }
        console.log('Arquivo de retorno salvo com sucesso!');
    });
});
