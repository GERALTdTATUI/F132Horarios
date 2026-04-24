//Arquivo de template para injeção de valores às variáveis dentro do arquivo parameters.js

/* 
A forma de trabalhar as variáveis nesse projeto gira em torno do arquivo parameters.js - o link de onde o site
recolhe os dados, a declaração dos filtros de palavras, o nomes dos títulos das colunas, tudo fica nesse
arquivo.

Para permitir a publicação desse projeto sem vazamento explícito de dados e, para uma apresentação mais neutra
do código, foi desenvolvida essa dinâmica do arquivo de parâmentos (no intuito de centralizar variáveis fundamentais)
e o arquivo de template (para injetar variáveis no arquivo de parâmetros usando comandos de build.)

Dentro do versel, o seguinte comando foi digitado como build-override: "./build.sh && echo Pronto".
No arquivo build.sh existe um comando de terminal linux que procura as variáveis abaixo que se encontram entre "#"
e as substituem pelos valores verdadeiros declarados dentro das variáveis de ambiente do projeto na dash do versel.

Assim. Quando uma build do projeto é publicada pelo versel, o comando de build lê esse arquivo e subistitui as
variáveis dentro de parameters.js pelos valores certos seguindo a estrutura desse arquivo de template.

*/

const clmnHdrs = "#clmnHdrs#";
const sources = "#sources#";
const excelLastEditedSource = "#excelLastEditedSource#";
const hideFilters = "#hideFilters#"
const ignoredWordFilters = "#ignoredWordFilters#";
const ignoredExclusiveFilters = "#ignoredExclusiveFilters#";