function formTableData(tableData, fileType) { //Função para converter a string (csv) em um array
  // console.log(tableData);
  let lines = tableData.split('\n').filter(x => x !== ''), headers;

  for (let line of lines) { //busca a linha dos headers e cria um array com eles
      if (new RegExp(clmnHdrs.dia, "i").test(line)){
        switch (fileType) {
          case "csv":
            headers = lines[lines.indexOf(line)].split(',').map(x => standardizeHeaders(x.trim())); //Para arquivos CSV
          break;

          case "tsv":
            headers = lines[lines.indexOf(line)].split('\t').map(x => standardizeHeaders(x.trim())); //Para arquivos TSV
          break;
        }
        
        lines = lines.splice(lines.indexOf(line) + 1);
        break;
      }
  }

  // console.log(headers, lines);

  let data = new Array(), clmnQtd = headers.length;
  
  //Cicla os dados da planilha os transforma em objetos JSON
  for (let i = 0; i < lines.length; i++) { /* console.log(line); */
    let line, nObj, obj = new Object();

    switch (fileType) {
      case "csv":
        line = lines[i].split(',').map(x => filterValues(x.trim())); //Para arquivos CSV
      break;

      case "tsv":
        line = lines[i].split('\t').map(x => filterValues(x.trim())); //Para arquivos TSV
      break;
    }

    // console.log(line);
    checkColumnsCount(lines, line, clmnQtd); //Função necessária apenas em arquivos não TSV
    
    for (let header of headers) {
        obj[header.toLowerCase()] = line[headers.indexOf(header)].toUpperCase();
    }

    nObj = normalize(obj, i); //Chamada da função normalize para ajustar os horários dos compromissos

    for(let obj of nObj) data.push(obj); //reinserindo os novos objetos reajustados no JSON final

  }
  return data;
}

function checkColumnsCount(table, row, columnCount){
  /* 
  Quando há erros na conversão do tipo de arquivo, fez-se necessário a aferição do número de células obtidas em 
  cada linha e o número de headers disponíveis na planilha    */
  /* 
  Teoricamente, dentro do contexto atual da Fatec, dentre esses 3 anos de uso da ferramenta, a utilização de 
  arquivos separados em tabulações (TSV) nunca resultou em erros de conversão.
  Sendo assim, essa função se faz, aparentemente, denecessária para arquivos tsv
  */
  if (row.length != columnCount) {
    return console.error(`
      Linha com quantidades de colunas incompatível (${columnCount};
      linha ${table.indexOf(table[i])} tem ${(row.length)} colunas)
      ${row}
    `);
  }
}

//Quando chamada, essa função substitui certos caracteres por um espaço vazio
function filterValues(value) {
  if (
    value == '-' ||
    value == ' ' ||
    value == null ||
    value == undefined ||
    new RegExp('dispon', 'i').test(value)
    ) value = ''; return value.trim();
}

//Quando chamada, essa função substitui os títulos das colunas por um formato padronizado, facilitando a manipulação dos dados posteriormente
function standardizeHeaders(value) {
  switch (true) {
    case /Dia/i.test(value):
      return clmnHdrs.dia;

    case /Horário/i.test(value):
      return clmnHdrs.hora;

    case /Curso/i.test(value):
      return clmnHdrs.curso;

    case /SEM/i.test(value):
      return clmnHdrs.semestre;

    case /SIGA/i.test(value):
      return clmnHdrs.siga;

    case /Período/i.test(value):
      return clmnHdrs.turno;

    case /Disciplina/i.test(value):
      return clmnHdrs.materia;

    case /Docente/i.test(value):
      return clmnHdrs.professor;

    case /Local/i.test(value):
      return clmnHdrs.sala;

    case /Informação/i.test(value):
      return clmnHdrs.info;

    default:
      return value.trim();

  }
}

//Função para normalizar os horários dos compromissos
function normalize(row, i) { let tm = row['horário'], tms = [];

  if (new RegExp('^.{2}H.{2} ÀS .{2}H.{2}$','i').test(row[clmnHdrs.hora])){

    /*
      De forma simples, essa função coleta os horários fornecidos em cada linha/compromisso da planilha e,
    usando algumas operações matemáticas, faz a aferição dos blocos de aula, identificando se os registros
    se tratam de aulas duplas normais ou quadruplas com intervalo no meio
      Caso sejam, de fato, aulas duplas, não serão alteradas. Caso sejam aulas quadruplas, será conferido
    se há 10 minutos de intervalo entre as aulas, caso hajam 10 minutos de intervalo, as aulas quadruplas
    serão separadas em dois blocos de aulas duplas.           */

    tm = tm.split(" ÀS ").map(x => x.split("H")); //Converte o formato 19H00 às 20H40 para arrays [[19,00],[20,40]]

    // console.log(row, tm)

    tm[0][0] = tm[0][0] * 60; tm[1][0] = tm[1][0] * 60; //Converte os valores de horas para minutos

    tm[0] = (parseInt(tm[0][0]) + parseInt(tm[0][1])); //remove os arrays secundários transformando os primários
    tm[1] = (parseInt(tm[1][0]) + parseInt(tm[1][1])); //no equavalende à soma dos secundários. Ex: [1140,1240]

    let tmCx, step;

    if (Number.isInteger(tmCx = ((tm[1] - tm[0]) - ((parseInt((tm[1] - tm[0]) / 100) - 1) * 10)) / 50) ||
        Number.isInteger(tmCx = ((tm[1] - tm[0]) - ((parseInt((tm[1] - tm[0]) / 100)) * 10)) / 50)
    ) {
      step = 2;
    }
    else if (Number.isInteger(tmCx = ((tm[1] - tm[0]) - ((parseInt((tm[1] - tm[0]) / 150) - 1) * 10)) / 50) ||
             Number.isInteger(tmCx = ((tm[1] - tm[0]) - (parseInt((tm[1] - tm[0]) / 150) * 10)) / 50)
    ) {
      step = 3;
    }
    else return tms = [row];


    if(tmCx > 1) { let tmCintv=0;
      
      for(let j=0; j<(tmCx); j++) {

        let rFrmt = [((tm[0] + tmCintv) + (50 * j)), ((tm[0] + tmCintv)) + (50 * (j + 1))];
        if ((j+1) % step == 0) tmCintv += 10;

        rFrmt[0] = String(parseInt(rFrmt[0] / 60)).padStart(2, '0') + "H" +
            String(rFrmt[0] - (60 * parseInt(rFrmt[0] / 60))).padStart(2, '0');
        rFrmt[1] = String(parseInt(rFrmt[1] / 60)).padStart(2, '0') + "H" +
            String(rFrmt[1] - (60 * parseInt(rFrmt[1] / 60))).padStart(2, '0');

        rFrmt = rFrmt[0]+" ÀS "+rFrmt[1];

        let newRow = { ...row };
        newRow[clmnHdrs.hora] = rFrmt;
        tms.push(newRow);

      } i += (tms.length - 1); return tms;
    }
  } return tms = [row]
}