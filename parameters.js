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
    turma: "turma", //Título da Coluna contendo a turma (casos de divisão de turma: Turma A, Turma B).
    info: "informação auxiliar" //(não se preocupar muito, qualquer coluna além das anteriores será considerada como informação adicional)
}

//Essas são as fontes dos dados, caso haja necessidade de alterar as fontes, ou adicionar novas, basta colocar os links/endereços dentro dessa variável, seguindo o formato chave: valor (chave é o nome da fonte, valor é o link/endereço da fonte)
const data_sources = [
    {
        URL: `./exemple_sources/grade.csv`, //Links de exemplo para testes offline.
        FileType: "csv", //Tipo do arquivo da planilha de horários (pode ser "tsv", "csv" ou "json")
    },
    {
        URL: `./exemple_sources/agendas.tsv`, //Links de exemplo para testes offline.
        FileType: "tsv", //Tipo do arquivo da planilha de agendas (pode ser "tsv", "csv" ou "json")
    }
];

//Essa é a fonte da informação de última atualização da planilha, caso haja necessidade de alterar, basta colocar o link/endereçoda fonte nessa variável, seguindo o formato chave: valor (chave é o nome da fonte, valor é o link/endereço da fonte)
const excelLastEditedSource = {
    URL: "./exemple_sources/atualiza.tsv",
    FileType: "tsv",
    InfoPosition: [0,1]
}; //Links de exemplo para testes offline.

//LISTAS DE FILTROS PARA DESCARTAS
// A variáveis abaixo contém listas de palavras para serem filtradas durante o mapeamento dos dados.
// A lista de filtros é case-insensitive, ou seja, maiúsculas e minúsculas não diferem na hora de filtrar
// Ex: Filtrar "Hello" descarta "Hello", "hello", "hEllO" e qualquer variante possível

/* 
A estrutura dessas lista segue uma lógica baseado nas possíveis colunas de uma tabela de horários, sendo asism:
*Tipo de lista de filtros* => Existem dois tipos de filtros que serão explicados depois
{ => Abetura da lista (não mexer)
    geral: => Os valores antes dos dois pontos declaram qual item será filtrado, no caso, o item "geral" aplica um filtro pra todos os campos possíveis
    dia: => Filtra dias da semana "Segunda", "Terça-feira", "Qui", vai depender de como foram declarados na tabela
    hora: => Filtra os horários declarados na tabela ("10:00", "Manhã", "11 às 12", etc)
    curso: => Filtra os cursos declarado ("Gestão de TI", "Engenharia da Computação")
    semestre: => Filtra os semestres ("1°", "5º")
    siga: => Filtra o código SIG da aula ("ADC-4340") - caso exisitir
    turno: => Filtra o turno ("matutino", "Noturno")
    materia: => Filtra o nome da disciplina ("Comunicação e Expressão")
    professor: => Filtra os nomes dos professores ("Mário", "Sérgio")
    sala: => Filtra as salas de aula ("Sala 01", "Lab 2", "Math 3")
    info: => Filtra alguma palavra dentro da coluna de informações. ATENÇÃO: na lógica desse projeto, qualquer coluna extra vira uma coluna de informação
} => Fechamento da lista (não mexer)

*/

//Lista contendo filtro de exclusão baseados em palavras. Caso as palavras dentro do filtro estejam presentes na célula ela será descartada
// Caso eu filtre a palavra "Banana" todas as células que contiverem "Banana" serão descartadas. Isso inclui células escritas somente "Banana"
// e células contendo banana no começo, meio e fim da String. Ex: "Bananas contém potássio" seria descartada, assim com "Isso é uma Banana"
const ignoredWordFilters = {
    geral: [],
    dia: [],
    hora: [],
    curso: [
        "etec",
        "novotec",
        "reserv",
    ],
    semestre: [
    ],
    siga: [],
    turno: [],
    materia: [
        "etec",
        "novotec",
        "reserv",
    ],
    professor: [
        "etec",
        "novotec",
        "reserv",
    ],
    sala: [],
    info: [],
}

//Lista contendo filtros de exclusão exclusiva. Colocar uma string nessa lista a remove no processo de coleta de dados quando a paridade for perfeita.
// Ou seja, num caso onde eu coloquei como filtro a palavra "Cãmera", todas as células da tabela contendo extamente "Câmera" serão descartadas
// OBS: isso inclui os espaços " Câmera" != de "Câmera" e != "Câmera ". Caso sua ideia seja excluir uma célula que contenha a palavra dentro de uma frase, use o outro filtro
const ignoredExclusiveFilters = {
    geral: [
        "",
        " ",
        "-",
        " - ",
        undefined,
        null,
    ],
    dia: [],
    hora: [],
    curso: [],
    semestre: [
    ],
    siga: [],
    turno: [],
    materia: [],
    professor: [],
    sala: [],
    info: [],
}