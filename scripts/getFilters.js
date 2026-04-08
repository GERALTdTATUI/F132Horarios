function getFltrsFlds(data) { let ltCourses = new Object(), ltTchr = new Array(), ltRoom = new Array(), ltClss = new Array(), Fields = new Object();
    // console.log(data);
    // console.time("teste");


    for (let line of data) {
      if (
        typeof ltCourses[line[clmnHdrs.curso]] === 'undefined' &&
        !ignoredWordFilters.curso.some(word => new RegExp(word, "i").test(line[clmnHdrs.curso])) &&
        !ignoredWordFilters.curso.some(word => new RegExp(word, "i").test(line[clmnHdrs.materia])) &&
        !ignoredExclusiveFilters.geral.some(word => line[clmnHdrs.curso] === word)
      ){ ltCourses[line[clmnHdrs.curso]] = {'smstr': [], 'time': []}; }
        

      if (
        typeof ltCourses[line[clmnHdrs.curso]] !== 'undefined' &&
        !ltCourses[line[clmnHdrs.curso]]['smstr'].includes(line[clmnHdrs.semestre]) &&

        !ignoredWordFilters.semestre.some(word => new RegExp(word, "i").test(line[clmnHdrs.semestre])) &&
        !ignoredExclusiveFilters.semestre.some(word => line[clmnHdrs.semestre] === word) &&

        !ignoredWordFilters.geral.some(word => new RegExp(word, "i").test(line[clmnHdrs.semestre])) &&
        !ignoredExclusiveFilters.geral.some(word => line[clmnHdrs.semestre] === word)

      ){ ltCourses[line[clmnHdrs.curso]]['smstr'].push(line[clmnHdrs.semestre]); }
      

      if (
        typeof ltCourses[line[clmnHdrs.curso]] !== 'undefined' &&
        !ltCourses[line[clmnHdrs.curso]]['time'].includes(line[clmnHdrs.turno]) &&

        !ignoredWordFilters.turno.some(word => new RegExp(word, "i").test(line[clmnHdrs.turno])) &&
        !ignoredExclusiveFilters.turno.some(word => line[clmnHdrs.turno] === word) &&

        !ignoredWordFilters.geral.some(word => new RegExp(word, "i").test(line[clmnHdrs.turno])) &&
        !ignoredExclusiveFilters.geral.some(word => line[clmnHdrs.turno] === word)

      ){ ltCourses[line[clmnHdrs.curso]]['time'].push(line[clmnHdrs.turno]); }


      if (
        !ltTchr.includes(line[clmnHdrs.professor]) &&
        !ignoredWordFilters.professor.some(word => new RegExp(word, "i").test(line[clmnHdrs.professor])) &&
        !ignoredExclusiveFilters.professor.some(word => line[clmnHdrs.professor] === word) &&

        !ignoredWordFilters.geral.some(word => new RegExp(word, "i").test(line[clmnHdrs.professor])) &&
        !ignoredExclusiveFilters.geral.some(word => line[clmnHdrs.professor] === word)

      ){ ltTchr.push(line[clmnHdrs.professor]); }


      if (
        !ltRoom.includes(line[clmnHdrs.sala]) &&

        !ignoredWordFilters.sala.some(word => new RegExp(word, "i").test(line[clmnHdrs.sala])) &&
        !ignoredExclusiveFilters.sala.some(word => line[clmnHdrs.sala] === word) &&

        !ignoredWordFilters.geral.some(word => new RegExp(word, "i").test(line[clmnHdrs.sala])) &&
        !ignoredExclusiveFilters.geral.some(word => line[clmnHdrs.sala] === word)
      ){ ltRoom.push(line[clmnHdrs.sala]); }


      if (
        !ltClss.includes(line[clmnHdrs.materia]) &&

        !ignoredWordFilters.materia.some(word => new RegExp(word, "i").test(line[clmnHdrs.materia])) &&
        !ignoredExclusiveFilters.materia.some(word => line[clmnHdrs.materia] === word) &&

        !ignoredWordFilters.geral.some(word => new RegExp(word, "i").test(line[clmnHdrs.materia])) &&
        !ignoredExclusiveFilters.geral.some(word => line[clmnHdrs.materia] === word)
      ){ ltClss.push(line[clmnHdrs.materia]); }
    }


    ltTchr.sort().forEach(tchr => {
      let optItem = document.createElement("div");
      optItem.classList.add("option_beta");
      optItem.dataset.value = tchr;
      optItem.innerHTML += tchr;
    
      $('#prof').children(".options_beta").append(optItem);
    });

    ltRoom.sort().forEach(room => {
      let optItem = document.createElement("div");
      optItem.classList.add("option_beta");
      optItem.dataset.value = room;
      optItem.innerHTML += room;
    
      $('#room').children(".options_beta").append(optItem);
    });

    ltClss.sort().forEach(clss => {
      let optItem = document.createElement("div");
      optItem.classList.add("option_beta");
      optItem.dataset.value = clss;
      optItem.innerHTML += clss;
    
      $('#clss').children(".options_beta").append(optItem);
    });

    // console.log();
    // console.timeEnd("teste");
    return createFilterObjectItems(ltCourses);
}


function getFltrsFldsOG(data) { let ltCourse = new Array(), ltTchr = new Array(), ltRoom = new Array(), ltSmstr = new Array(), ltTime = new Array();
    // console.log(data);
  
    for (let line of data){
        ltCourse.push(line[clmnHdrs.curso]);
        ltSmstr.push(line[clmnHdrs.semestre]);
        ltTime.push(line[clmnHdrs.turno]);
        ltTchr.push(line[clmnHdrs.professor]);
        ltRoom.push(line[clmnHdrs.sala]);
    }

    ltCourse = new Set(ltCourse.sort().filter(x => (x != "" && !(new RegExp('etec', 'i').test(x)) && !(new RegExp('novotec', 'i').test(x)))));
    ltTchr = new Set(ltTchr.sort().filter(x => (x != "" && !(new RegExp('etec', 'i').test(x)) && !(new RegExp('novotec', 'i').test(x)))));
    ltSmstr = new Set(ltSmstr.sort().filter(x => (x != "")));
    ltTime = new Set(ltTime.sort().filter(x => (x != "")));
    ltRoom.push('P1 - SALA DE MIXAÇÃO/MASTERIRAZÃO');
    ltRoom = new Set(ltRoom.sort().filter(x => (x != "")));
  
    for (let item of ltCourse) {
      let optItem = document.createElement("input");
      optItem.setAttribute('type', 'checkbox');
      optItem.value = item;

      let optLabel = document.createElement('label');
      optLabel.setAttribute('for', '');

      optLabel.setAttribute('class', 'ftLbl');
      optItem.setAttribute('class', 'ftCkB');

      optLabel.append(optItem);
      optLabel.innerHTML += item;
      $('#course').append(optLabel);
    }
  
    for (let sms of ltSmstr) {
      let optItem = document.createElement("input");
      optItem.setAttribute('type', 'checkbox');
      optItem.value = sms;

      let optLabel = document.createElement('label');
      optLabel.setAttribute('for', '');

      optLabel.setAttribute('class', 'ftLbl');
      optItem.setAttribute('class', 'ftCkB');

      optLabel.append(optItem);
      optLabel.innerHTML +=  sms;
      $('smstr').append(optLabel);
    }
  
    for (let tm of ltTime) {
      let optItem = document.createElement("input");
      optItem.setAttribute('type', 'checkbox');
      optItem.value = tm;

      let optLabel = document.createElement('label');
      optLabel.setAttribute('for', '');

      optLabel.setAttribute('class', 'ftLbl');
      optItem.setAttribute('class', 'ftCkB');

      optLabel.append(optItem);
      optLabel.innerHTML += tm;
      $('time').append(optLabel);
    }
    
    for (let tchr of ltTchr) { let optItem = document.createElement("input");
      optItem.setAttribute('type', 'checkbox');
      if(!(new RegExp('etec', 'i').test(tchr))) {
        optItem.value = tchr;

        let optLabel = document.createElement('label');
        optLabel.setAttribute('for', '');

          optLabel.setAttribute('class', 'ftLbl');
          optItem.setAttribute('class', 'ftCkB');

        optLabel.append(optItem);
        optLabel.innerHTML += tchr;
        $('#prof').append(optLabel);
      }
    }
    
    for (let clss of ltRoom) { let optItem = document.createElement("input");
      optItem.setAttribute('type', 'checkbox');
      optItem.value = clss;

      let optLabel = document.createElement('label');
      optLabel.setAttribute('for', '');

      optLabel.setAttribute('class', 'ftLbl');
      optItem.setAttribute('class', 'ftCkB');

      optLabel.append(optItem);
      optLabel.innerHTML += clss;
      $('#class').append(optLabel);
    }
  }

function createFilterObjectItems (filtersArray) {
  let nwCourses = new Object();

  Object.keys(filtersArray).sort().forEach(key => {
    
    let optItem = document.createElement("div");
    optItem.classList.add("option_beta");
    optItem.dataset.value = key;
    optItem.innerHTML += key;
  
    $('#course').children(".options_beta").append(optItem);

    filtersArray[key]['smstr'].sort();
    filtersArray[key]['time'].sort();

    nwCourses[key] = filtersArray[key];

  }); return nwCourses;
}