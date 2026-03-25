//O sistema que busca os valores dentro da planilha utiliza de referência os títulos da planilha fonte
//(em caixa baixa) para saber a posição correta dos valores
//Caso os filtros estejam incorretos, ou estão sendo apresentados em outros campos/pasições
//Consedire revisar os títulos da planilha e atualiza-los nessa variável (coloque-os em caixa baixa)
//Altere apenas os valores entre aspas e faça com que coincidam com os valores antes dos ":"
const clmnHdrs = { //Coluna para ajuste dos títulos da planilha
    dia: "dia da semana", //Título da Coluna com o dia da semana em que ocorre a aula.
    hora: "horário", //Título da Coluna com o horário da aula.
    curso: "curso", //Título da Coluna com o nome do curso/turma da aula.
    semestre: "sem.", //Título da Coluna com o semestre do curso/turma da aula.
    siga: "siga", //Título da Coluna com o código SIGA da disciplina da aula.
    turno: "período", //Título da Coluna com o período do curso.
    materia: "disciplina", //Título da Coluna com o nome da disciplina/matéria da aula.
    professor: "docente", //Título da Coluna com o nome do professor da aula.
    sala: "local de aula", //Título da Coluna o local/sala da aula.
    info: "informação auxiliar" //(não se preocupar muito, qualquer coluna além das anteriores será considerada como informação adicional)
}

//Essas são as fontes dos dados, caso haja necessidade de alterar as fontes, ou adicionar novas, basta colocar os links/endereços dentro dessa variável, seguindo o formato chave: valor (chave é o nome da fonte, valor é o link/endereço da fonte)
const sources = [
    {
        URL: REMOVIDO, //URL da planilha de horários (API ou página pública do Google Sheets)
        FileType: "tsv", //Tipo do arquivo da planilha de horários (pode ser "tsv", "csv" ou "json")
    },
    {
        URL: REMOVIDO, //URL da planilha de agendas (API ou página pública do Google Sheets)
        // agndsLocal: `./downloadedSources/agendas.tsv`, //Links de exemplo para testes offline.
        FileType: "tsv", //Tipo do arquivo da planilha de agendas (pode ser "tsv", "csv" ou "json")
    }
];

//Essa é a fonte da informação de última atualização da planilha, caso haja necessidade de alterar, basta colocar o link/endereçoda fonte nessa variável, seguindo o formato chave: valor (chave é o nome da fonte, valor é o link/endereço da fonte)
const excelLastEditedSource = REMOVIDO; //URL da planilha de informações de última atualização (API ou página pública do Google Sheets)
// const excelLastEditedSource = "./downloadedSources/atualiza.tsv"; //Links de exemplo para testes offline.