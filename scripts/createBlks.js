var resultTable; /* Variável global volátil, definida para armazenar os compromissos referentes à pesquisa
do usuário, evitando a consulta cíclica da fonte de dados completa para formar os blocos de horário. */

function formTable(table, filters, type, size) {
  //table = dados da planilha fonte; filters = critérios escolhidos pelo usuário;
  //type = tipo de pesquisa (0 - pesquisa de curso, usando 3 critérios: turma, semestre e turno)
  //size = variável extra, retorna a quantidade de cadeiras disponível em uma sala (apenas para a pesquisa de sala)

  type = filters !== "Salas Livres" ? type : 3 

  console.log(filters, type)

  //Identificando qual tipo de pesquisa foi feita pelo usuário
  let info;
  switch (type) {
    case 0: //0 - pesquisa de curso, usa as funções com 3 critérios de pesquisa
      info = getInfoStdnt(table, filters); //chamado da função cololetora dos compos condizentes com os filtros dos alunos
      if (info[0].size == 0 || info[1].size == 0)
        return;
    break

    case 3: //3 - pesquisa de disponibilidade, sem critério (retorna valores para as salas vagas)
      info = getInfoVacancy(table, filters);
      if (info[0].size == 0 || info[1].size == 0 || info[2].size == 0)
        return;
    break

    default: //padrão, ou 1 - pesquisa de professor, disciplina ou sala, usando apenas 1 critério
      info = getInfoSingle(table, filters);
      console.log(info);
      if (info[0].size == 0 || info[1].size == 0)
        return;
    break
  }


  //container que abriga os blocos de aula
  let cnt = document.createElement('div');
  cnt.setAttribute('class', 'container');

  //Título da pesquisa (apenas o objeto)
  let title = document.createElement('div');
  title.setAttribute("class", "infoTitle");

  let ttxt = document.createElement('p');

  //Apresenta os críterios da pesquisa no título. Ex: "Grade horária de: *Automação Industrial*, *1º*, *Noturno*"
  if (typeof filters === "string") ttxt.innerHTML = `GRADE HORÁRIA DE: ${filters}`;
  else ttxt.innerHTML = "GRADE HORÁRIA DE: " + filters.join(' ');

  //Na pesquisa de sala, um texto dizendo a quantidade de cadeiras da sala será incluido no título
  if (type === 2 && size[filters] !== undefined) ttxt.innerHTML += size[filters];

  title.append(ttxt);
  /* 
    A variável size[filters] mapea uma das entradas no aquivo ./scripts/classes.json
  Esse arquivo representa a quantidade de alunos/cadeira disponível na sala
  
  O arquivo 'classes.json' segue o formato '{ "Nome da sala": " - *X* Cadeiras",' 
  Onde *X* representa a quantidade de cadeiras e " - *X* Cadeiras" será adicionado ao título da pesquisa
  Ex: "Grade horária de: P1 - LABORATÓRIO MULTI 1 - 20 Cadeiras"
  */

  //criação do objeto que comportará as colunas da tabela
  let columns = document.createElement('div'); 
  columns.setAttribute("class", "Tables");
  columns.setAttribute("id", "Tables");
  
  //criação do objeto título da coluna com as horas
  let hrTitle = document.createElement('div');
  let hrtxt = document.createElement('p');
  hrtxt.innerHTML = 'Hora'
  hrTitle.append(hrtxt);
  hrTitle.setAttribute("class", "HourTitle"); 

  //criação da coluna que comportará as células contendo os horários
  let hrColumn = document.createElement('div'); 
  hrColumn.setAttribute("class", "HourColumn"); 
  hrColumn.append(hrTitle);

  //Criando as células com os horários obtidos nas funções "getInfoStdnt", "getInfoVacancy" ou "getInfoSingle"
  //apreendendo-as à coluna de horários e apreendendo a coluna de horários ao objeto das colunas
  for (let hour of info[0]) {
    let hrBlk = document.createElement("div"); 
    let hrbltxt = document.createElement('p');
    hrbltxt.innerHTML = hour
    hrBlk.append(hrbltxt);
    hrBlk.setAttribute("class", "Hours"); 
    hrColumn.append(hrBlk); 
  } columns.append(hrColumn);
  
  
  switch (type) {
    //Há uma função dedicada para formar os blocos da tabela caso a pesquisa por "Salas Livres" (caso 3) seja a escolhida
    case 3: formColumnsVacancy(resultTable, info[0], info[1], info[2], columns); break;
    //Caso contrário a função padrão "formColumns" será chamada
    default: formColumns(resultTable, info[0], info[1], filters, columns, type); break;
  }

  //Ao final da formação dos blocos as colunas dos dias já foram apreendidas ao grupo das colunas
  //resta apreender o título e as colunas ao container principal.
  cnt.append(title);
  cnt.append(columns);

  $('body').append(cnt); //Por fim apreendemos o container ao corpo do site e assim se forma a tabela

  snapToday(document.querySelector('.Tables'), info[1]); //Chama a função para destacar a coluna com o dia de atual
}

//Função que adiciona uma animação para destacar a coluna do dia atual (fazendo a coluna piscar por alguns segundos)
function snapToday(tbl, days) { let tDay = new Date().getDay();
  let sDay = new RegExp(new Date().toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace(/\./g, ''));

  for(let day of days)
    if((parseInt(day) === tDay || sDay.test(day)) && window.innerWidth < 530) {

      tbl.scrollTo({
        left: (tDay-1) * (tbl.clientWidth - 20
          ),
        behavior: 'smooth'
      });
      
      return;
    }
}

//Função para formar as colunas da tabela
function formColumns(data, hours, days, atrr, columns, type) {

  // console.log(data)

  //A função, basicamente, cicla pelos dias e horários obtidos nas funções "getInfoStdnt" ou "getInfoSingle"
  for (let day of days) {
    //Criando um títlo para cada dia obtido no loop
    let dayTitle = document.createElement('div');
    let dttxt = document.createElement('p');
    dttxt.innerHTML = day;
    // console.log(day);
    dayTitle.append(dttxt);
    dayTitle.setAttribute("class", "DayTitle");

    //Criando uma coluna para cada dia obtido no loop
    let clssColumn = document.createElement('div'); 
    clssColumn.setAttribute("class", "ClassColumn"); 
    clssColumn.append(dayTitle); 

    for (let hour of hours) { //Ciclando as horas presentes nesse dia
      //Criando um objeto para comportar os dados dos compromissos
      let multiClasses = document.createElement('div');
      multiClasses.setAttribute("class", "ClassEmpty");

      for (let line of data){ //Ciclando as informações da planilha buscando compromissos nos dias e horários
        if (line[clmnHdrs.dia].slice(5) == day && line[clmnHdrs.hora] == hour) {

          switch (type) {
            case 0: //Caso seja uma pesquisa de curso, esse critérios devem ser compatéveis
              if (line[clmnHdrs.curso] == atrr[0] && line[clmnHdrs.semestre] == atrr[1] && line[clmnHdrs.turno] == atrr[2] && line[clmnHdrs.materia] != '') {
                //Caso um compromisso seja compatível, um bloco é criado para ele
                multiClasses.appendChild(createClassBlkData(line, type)); break; }
            break;
          
            default: //Caso outro tipo de pesquisa seja feita, esses são os critérios analizados
              if (
                (line[clmnHdrs.professor] == atrr || line[clmnHdrs.sala] == atrr || line[clmnHdrs.materia] == atrr) &&
                line[clmnHdrs.materia] != '' && line[clmnHdrs.semestre] != '' && line[clmnHdrs.curso] != '') {
                  //Caso um compromisso seja compatível, um bloco é criado para ele
                  multiClasses.appendChild(createClassBlkData(line, type)); break; }
            break;
          }
        }
      }

      //Caso apenas um bloco tenha sido criado dentro o objeto "multiClasses", então esse será o multiClasses,
      if ($(multiClasses).children().length == 1) clssColumn.appendChild(multiClasses.firstElementChild);

      //Caso contrário, ele será dividido em frações e suas "crianças" receberão a classe "clssBlkDvd"
      else {        
        const newMultclasses = document.createElement('div');
        newMultclasses.setAttribute('class', 'ClassEmpty')

        Array.from($(multiClasses).children()).forEach((child, index) => {
          const blkContainer = document.createElement("div");
          const blkHeader = document.createElement('div');
          const blkHdrTxt = document.createElement('h1');
          
          $(blkContainer).addClass('clssBlkDvdContainer');
          $(blkHeader).addClass("clssBlkDvdHdr");
          $(child).attr('class', 'clssBlkDvd');

          blkHdrTxt.innerHTML = $(child).data().value || "SITUAÇÃO " + String.fromCharCode(65 + index);

          blkHeader.appendChild(blkHdrTxt);
          blkContainer.appendChild(blkHeader);
          blkContainer.appendChild(child);
          newMultclasses.appendChild(blkContainer);
        });
        
        clssColumn.appendChild(newMultclasses);
      }

      //Caso o dia do loop seja compatível com o dia atual, a classe "TodayClass" será adicionada aos blocos da coluna
      if (new RegExp(new Date().toLocaleDateString('pt-BR', { weekday: 'short' }), 'i').test(day.slice(5))) {
        $(clssColumn).children(":not(:first-child)").addClass("TodayClass");
      }

    } columns.append(clssColumn); 
  } return columns; 
}

//Função para procurar os horários vagos das salas
function formColumnsVacancy(data, hours, days, allClss, columns) {

  /*  O princípio dessa função é exatamente igual ao da função padrão, mas, esta, ao invés de criar blocos baseados
  múltiplos critérios, ela filtra a ausencia desses critérios, retornando um bloco com a lista de salas vazias em
  tal dia e horário

  Sendo assim, não será necessário explicar esta função detalhadamente, pois ela é mais simples e compartilha da mesma
  lógica da função anterior
  */
  
  for (let day of days) {
    let dayTitle = document.createElement('div');
    let dttxt = document.createElement('p');
    dttxt.innerHTML = day;
    dayTitle.append(dttxt);
    dayTitle.setAttribute("class", "DayTitle");

    let clssColumn = document.createElement('div'); 
    clssColumn.setAttribute("class", "ClassColumn"); 
    clssColumn.append(dayTitle); 

    for (let hour of hours) { let usedClss = new Array();
      let vacancyBlk = document.createElement('div');
      vacancyBlk.setAttribute("class", "ClassEmpty");

      for (let line of data) {
        if (line[clmnHdrs.dia].slice(5) == day && line[clmnHdrs.hora] == hour)
          line[clmnHdrs.materia] !== '' && usedClss.push(line['local de aula']);
      }
      
      const non_usedClss = allClss.filter(x => !usedClss.includes(x));

      if (non_usedClss.length) vacancyBlk.setAttribute("class", "Classes");


      for(let clss of non_usedClss) {
        let ClssTtl = document.createElement('h1');
        ClssTtl.innerHTML = clss;
        ClssTtl.style.marginBottom = "50px";
        vacancyBlk.append(ClssTtl);
      }

      console.log("Todos: ",allClss, "EmUso:", usedClss, "Livres:", non_usedClss)

      clssColumn.append(vacancyBlk);
    } columns.append(clssColumn); 
  } return columns; 
}

//Função para criar os blocos de aula
function createClassBlkData(line, type) {

  //Criando os objetos bloco e os textos com as informações
  let clssBlk = document.createElement('div');
  line.turma !== undefined && clssBlk.setAttribute("data-value", line.turma);

  let text1 = document.createElement('h1'); text1.innerHTML = line[clmnHdrs.materia]; //Texto com a aula
  let text2 = document.createElement('h1'), clssLocal = line[clmnHdrs.sala]; // Texto com a sala
  // let text2 = document.createElement('a'), clssLocal = line[clmnHdrs.sala]; //Com link com MAPS
  // text2.setAttribute('href', `http://localhost:53604/index.html?value=${clssLocal}`); //Testes
  // text2.setAttribute('href', `https://fatectatui.edu.br/site4/mapas?value=${clssLocal}`); //Oficial
  text2.innerHTML = clssLocal;
  let text3 = document.createElement('h1'); text3.innerHTML = line[clmnHdrs.professor]; //Texto com o professor
  let text4 = document.createElement('h1'); text4.innerHTML = line[clmnHdrs.semestre]+" "+line[clmnHdrs.curso]; //Texto com a turma e semestre
  let pCdiv = document.createElement("div"); pCdiv.setAttribute("class", "pClasses"); //Texto com informações Extras

  //Caso a aula seja uma reserva, ela recebe uma sombra para destacá-la perante aulas fixas
  if (new RegExp('reser', 'i').test(line[clmnHdrs.materia])) {
    $(text1).css('background-color', '#00000059');
    $(text1).css('padding', '3px');
    $(text1).css('padding-left', '7px');
    $(text1).css('padding-right', '7px');
  }
    
  //Dependendo do tipo de pesquisa feita, os textos e a sua ordem de aparição diferentes
  switch (type) {
    case 0: clssBlk.append(text1); clssBlk.append(text2); clssBlk.append(text3); break;
    case 1: clssBlk.append(text1); clssBlk.append(text2); clssBlk.append(text4); break;
    case 2: clssBlk.append(text1); clssBlk.append(text4); clssBlk.append(text3); break;
    case 4: clssBlk.append(text4); clssBlk.append(text2); clssBlk.append(text3); break;
  }
  
  //Rodando as células presente na linha com o compromisso procurando por informações extras
  for (let item in line) {
    if (
      !Object.values(clmnHdrs).filter(x => x !== clmnHdrs.info).includes(item) &&
      item != "siga" &&
      item != "@odata.etag" &&
      item != "iteminternalid" &&
      line[item] != ""
    ){ //Caso haaja uma info extra, ela será apreendida no bloco de texto
      let textExtra = document.createElement('p'); textExtra.innerHTML = line[item];
      pCdiv.append(textExtra);
      clssBlk.append(pCdiv);
    }
  } clssBlk.setAttribute("class", "Classes");

  //O(s) objetos criando(s) são retornados para a funçãoPai para serem apreendidos na coluna
  return clssBlk;
}

//Essa função retorna dois arrays (ltHours, ltWdays), com os dias e horários de aulas conforme os critérios dos "Cursos"
function getInfoStdnt(data, atrr) {
  let ltHours = new Array, ltWdays = new Array;
  resultTable = new Array();

  for (let line of data) 
    if (
      line[clmnHdrs.curso] == atrr[0] && line[clmnHdrs.semestre] == atrr[1] && line[clmnHdrs.turno] == atrr[2] &&
      line[clmnHdrs.materia] != '' && line[clmnHdrs.professor] != '' && line[clmnHdrs.hora] != ''
    ) {

      resultTable.push(line);

      if (!ltWdays.includes(line[clmnHdrs.dia].slice(5)))
        ltWdays.push(line[clmnHdrs.dia].slice(5)); 
      if (!ltHours.includes(line[clmnHdrs.hora]))
        ltHours.push(line[clmnHdrs.hora]);
    }

  if (!ltHours.length || !ltWdays.length){
    console.error("Horários não encontrados", atrr)
    return alert("Não há horários para essa seleção");
  }

  ltHours.sort(); ltWdays = sortWeekdays(ltWdays);

  return [ltHours, ltWdays];
}

//Essa função retorna dois arrays (ltHours, ltWdays), com os dias e horários de aula conforme os critérios dos "Professor", ou "Sala"
function getInfoSingle(data, atrr) {
  let ltHours = new Array, ltWdays = new Array;
  resultTable = new Array();


  for (let line of data)
    if (
      (line[clmnHdrs.professor] == atrr || line[clmnHdrs.sala] == atrr || line[clmnHdrs.materia] == atrr) &&
      line[clmnHdrs.materia] != '' && line[clmnHdrs.semestre] != '' && line[clmnHdrs.curso] != '' && line[clmnHdrs.hora] != ''
      ){

        resultTable.push(line);

        if (!ltWdays.includes(line[clmnHdrs.dia].slice(5)))
          ltWdays.push(line[clmnHdrs.dia].slice(5));
        if (!ltHours.includes(line[clmnHdrs.hora]))
          ltHours.push(line[clmnHdrs.hora]);
      } 


  if (!ltHours.length || !ltWdays.length){
    console.error("Horários não encontrados", atrr)
    return alert("Não há horários para essa seleção");
  }

  ltHours.sort(); ltWdays = sortWeekdays(ltWdays);

  return [ltHours, ltWdays];
}

//Essa função retorna três arrays (ltHours, ltWdays), com os dias, horários e salas disponíveis (não utilizado)
function getInfoVacancy(data, atrr) {
  let ltHours = new Array(), ltWdays = new Array(), ltClssR = new Array();
  resultTable = data

  for (let line of data) {
    // console.log(line);
    if (line[clmnHdrs.materia] == '') {

      if (!ltWdays.includes(line[clmnHdrs.dia].slice(5)))
        ltWdays.push(line[clmnHdrs.dia].slice(5));
      if (!ltHours.includes(line[clmnHdrs.hora]))
        ltHours.push(line[clmnHdrs.hora]);
      if (!ltClssR.includes(line[clmnHdrs.sala]))
        ltClssR.push(line[clmnHdrs.sala]);
    }
  }

  ltHours.sort(); ltClssR.sort(); ltWdays = sortWeekdays(ltWdays);

  if (!ltHours.length || !ltWdays.length || !ltClssR.length){
    console.error("Horários não encontrados", atrr)
    return alert("Não há horários para essa seleção");
  }

  return [ltHours,  ltWdays, ltClssR];
}

function sortWeekdays(weekdays) {
  // Define an array with the correct order of weekdays
  const weekdayOrder = ["SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO", "DOMINGO"];

  // Custom sort function using the predefined order
  weekdays.sort((a, b) => {
      return weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b);
  });

  return weekdays;
}