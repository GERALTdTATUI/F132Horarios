function getFltrsFlds(data) { let ltCourses = new Object(), ltTchr = new Array(), ltRoom = new Array(), ltClss = new Array(), Fields = new Object();
    // console.log(data);
    // console.time("teste");


    for (let line of data) {

      if (
        typeof ltCourses[line[clmnHdrs.curso]] === 'undefined' &&
        !(new RegExp('etec', 'i').test(line[clmnHdrs.curso])) &&
        !(new RegExp('novotec', 'i').test(line[clmnHdrs.curso])) &&
        !(new RegExp('reserv', 'i').test(line[clmnHdrs.materia])) &&
        line[clmnHdrs.curso] != "" &&
        line[clmnHdrs.curso] != " " &&
        line[clmnHdrs.curso] != "-" &&
        line[clmnHdrs.curso] != null
      ){ ltCourses[line[clmnHdrs.curso]] = {'#smstr': [], '#time': []}; }
        

      if (
        typeof ltCourses[line[clmnHdrs.curso]] !== 'undefined' &&
        !ltCourses[line[clmnHdrs.curso]]['#smstr'].includes(line[clmnHdrs.semestre]) &&
        line[clmnHdrs.semestre] != "" &&
        line[clmnHdrs.semestre] != " " &&
        line[clmnHdrs.semestre] != "-" &&
        line[clmnHdrs.semestre] != null
      ){ ltCourses[line[clmnHdrs.curso]]['#smstr'].push(line[clmnHdrs.semestre]); }
      

      if (
        typeof ltCourses[line[clmnHdrs.curso]] !== 'undefined' &&
        !ltCourses[line[clmnHdrs.curso]]['#time'].includes(line[clmnHdrs.turno]) &&
        line[clmnHdrs.turno] != "" &&
        line[clmnHdrs.turno] != " " &&
        line[clmnHdrs.turno] != "-" &&
        line[clmnHdrs.turno] != null
      ){ ltCourses[line[clmnHdrs.curso]]['#time'].push(line[clmnHdrs.turno]); }


      if (
        !(new RegExp('etec', 'i').test(line[clmnHdrs.professor])) &&
        !(new RegExp('novotec', 'i').test(line[clmnHdrs.professor])) &&
        !ltTchr.includes(line[clmnHdrs.professor]) &&
        line[clmnHdrs.professor] != "" &&
        line[clmnHdrs.professor] != " " &&
        line[clmnHdrs.professor] != "-" &&
        line[clmnHdrs.professor] != null
      ){ ltTchr.push(line[clmnHdrs.professor]); }


      if (
        !ltRoom.includes(line[clmnHdrs.sala]) &&
        line[clmnHdrs.sala] != "" &&
        line[clmnHdrs.sala] != " " &&
        line[clmnHdrs.sala] != "-" &&
        line[clmnHdrs.sala] != null
      ){ ltRoom.push(line[clmnHdrs.sala]); }


      if (
        // !(new RegExp('etec', 'i').test(line[clmnHdrs.materia])) &&
        // !(new RegExp('novotec', 'i').test(line[clmnHdrs.materia])) &&
        !ltClss.includes(line[clmnHdrs.materia]) &&
        line[clmnHdrs.materia] != "" &&
        line[clmnHdrs.materia] != " " &&
        line[clmnHdrs.materia] != "-" &&
        line[clmnHdrs.materia] != null
      ){ ltClss.push(line[clmnHdrs.materia]); }
    }


    ltTchr.sort().forEach(tchr => {
      let optItem = document.createElement("option");
      optItem.value = tchr; optItem.innerHTML += tchr;
    
      $('#prof').append(optItem);
    });

    ltRoom.sort().forEach(room => {
      let optItem = document.createElement("option");
      optItem.value = room; optItem.innerHTML += room;
    
      $('#room').append(optItem);
    });

    ltClss.sort().forEach(clss => {
      let optItem = document.createElement("option");
      optItem.value = clss; optItem.innerHTML += clss;
    
      $('#clss').append(optItem);
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
      $('#smstr').append(optLabel);
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
      $('#time').append(optLabel);
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
    
    let optItem = document.createElement("option");
    optItem.value = key; optItem.innerHTML += key;
  
    $('#course').append(optItem);

    filtersArray[key]['#smstr'].sort();
    filtersArray[key]['#time'].sort();

    nwCourses[key] = filtersArray[key];

  }); return nwCourses;
}