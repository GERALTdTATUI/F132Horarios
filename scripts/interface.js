var schPreferences;

//Define se o tema é escuro ou claro
function chgTheme(bt) { let cssVars = document.querySelector(':root').style;
    if ($(bt).css('transform') == 'none' || bt === 'light') { //LightTheme
        $('#sld1').css('transform', 'translateX(70%)');
        $('#sld1').css('background-color', '#dcdcdc');
        $('#ftaLogo').attr('src', './assets/logos/fatecLogoLight.png');
        $('#ftaLogoSt').attr('srcset', './assets/logos/fatecLogoLightShort.png');
        cssVars.setProperty('--bkgClr', '#c9e2d7');
        cssVars.setProperty('--Dft', 'black');
    
        document.cookie = 'thmPref=light; max-age=315360000; samesite=strict;';
    }

    else { //Dark Theme
        $('#sld1').css('transform', 'none');
        $('#sld1').css('background-color', '#0a0a0a');
        $('#ftaLogo').attr('src', './assets/logos/fatecLogoDark.png');
        $('#ftaLogoSt').attr('srcset', './assets/logos/fatecLogoDarkShort.png');
        cssVars.setProperty('--bkgClr', 'black');
        cssVars.setProperty('--Dft', '#F7F1E5');
    
        document.cookie = 'thmPref=dark; max-age=315360000; samesite=strict;';
    }
}

//Define as paletas de cor do Site
function chgPltt(pltt) { let cssVars = document.querySelector(':root').style,
    palettes = [
        ['#2a4a7d','#1F6E8C','#2E8A99','#2E8A9980','#3bb4c7'], ['#2a4949','#2e8181','#37745f','#37745f80','#57b997'],
        ['#4C4B16','#898121','#b58b0b','#b58b0b80','#e6ad05'], ['#952323','#A73121','#db8646','#db864680','#eb9d62'],
        ['#451952','#662549','#AE445A','#AE445A80','#d84c68'], ['#1b1315','#444444','#747474','#74747480','#bbbbbb'],
    ];

    cssVars.setProperty('--HrBlk', palettes[pltt][0]);
    cssVars.setProperty('--TtlClr', palettes[pltt][1]);
    cssVars.setProperty('--itClss', palettes[pltt][2]);
    cssVars.setProperty('--bgClss', palettes[pltt][3]);
    cssVars.setProperty('--bgClssHlgt', palettes[pltt][4]);

    $('#ldImg').attr('src', `./assets/ldIcon/ld${pltt}.png`)

    document.cookie = `clrPref=${pltt}; max-age=315360000; samesite=strict;`;
}

//Esconde o painel de pesquisa
function hideSrch(clickOff) { //Comando para ocultar o balão de seleção de curso
    const btSize = window.innerWidth > 530 ? 60 : 50;

    if (clickOff) {        
        setTimeout(() => {
            $("#schAra").children().hide()
            $("#schAra").children("#srcImg").show()
        }, 75);

        $("#schAraBkg").hide();
        $("#fndBt").attr("disabled", true);
        $("#lastChangeStatus").css("padding-right", btSize + 30);

        $('#prsnBox').css('flex-direction', 'column');

        $("#schAra").height($("#schAra").height());
        $("#schAra").height(btSize);
        $("#schAra").width(btSize);
        
        $("#schAra").addClass("SearchAreaOff");
    }

    else {        
        setTimeout(() => {
            $("#schAra").children("#srcImg").hide()
            $("#schAra").children("#Flgs").show()
            $("#schAra").children(".prsnBox").show()
            
            $("#schAra").height("")
            $("#schAra").width("")
        }, 100)
        $("#schAra").height(400)
        $("#schAra").width(400)

        $("#schAraBkg").show();
        $("#lastChangeStatus").css("padding-right", "0");

        $("#schAra").removeClass("SearchAreaOff");
    }
}

//Função experimental para permitir a pesquisa de nomes usando o teclado (não utilizada)
function showList(focus) {
    switch (focus){
        case 1: alert(); $('#tchrList')[0].style.display = 'block'; break
        default: console.log(); $('#tchrList')[0].style.display = 'none'; break
    }
}


function fndStdt() { //Função que gera o layout de seleção de curso ao clicar no botão "ALUNO"
    $("#sltAll").show().children().show();
    $("#prof").hide(); $("#room").hide(); $("#clss").hide(); $("#tchrList").hide();
    $("#fndBt").show();
    $("#sltAll").css("display", "flex");

    $("#fndBt").attr("onclick", "fndTable(0)"); //Altera qual função o botão chama
    $("#fndBt").text("Encontrar Horários"); //Muda o texto para "Encontrar Horários"
    
    if($("#course").prop("selectedIndex") !== 0) { //Reativa 0 botão se os campos já tiverem filtros
        $("#fndBt").attr("disabled", false);
    }
}

function fndTchr() { //Função que gera o layout de seleção de professor ao clicar no botão "PROFESSOR"
    $("#sltAll").show().children().hide();
    $("#prof").show(); $("#fndBt").show();
    $("#svSch").show();

    $("#sltAll").css("display", "flex");

    $("#fndBt").attr("onclick", "fndTable(1)"); //Altera qual função o botão chama
    $("#fndBt").text("Encontrar Horários"); //Muda o texto para "Encontrar Horários"

    if ($("#prof").prop("selectedIndex") !== 0) {//Reativa 0 botão se os campos já tiverem filtros
        $("#fndBt").attr("disabled", false);
    }
}

function fndClsR() { //Função que gera o layout de seleção de salas ao clicar no botão "SALAS"
    $("#sltAll").show().children().hide();
    $("#room").show(); $("#fndBt").show();
    $("#svSch").show();


    if ($("#room").prop("selectedIndex") !== 0) { //Reativa 0 botão se os campos já tiverem filtros
        $("#fndBt").attr("disabled", false);
        $("#fndBt").attr("onclick", "fndTable(2)"); //Altera qual função o botão chama
    }
    else {
        $("#fndBt").attr("onclick", "fndTable(3)"); //Altera qual função o botão chama
        $("#fndBt").text("Salas livres"); //Muda o texto para "Salas Livres" (não utilizado)
    }
}

function fndClss() { //Função que gera o layout de seleção de disciplina ao clicar no botão "DISCIPLINA"
    $("#sltAll").show().children().hide();
    $("#clss").show(); $("#fndBt").show();
    $("#svSch").show();

    $("#sltAll").css("display", "flex");

    $("#fndBt").attr("onclick", "fndTable(4)"); //Altera qual função o botão chama
    $("#fndBt").text("Encontrar Horários"); //Muda o texto para "Encontrar Horários"

    if ($("#clss").prop("selectedIndex") !== 0) {//Reativa 0 botão se os campos já tiverem filtros
        $("#fndBt").attr("disabled", false);
    }
}


//Função para realizar a pesquisa
function fndTable(type) { let opts;

    //Coleta dos critérios baseado no tipo de pesquisa escolhida
    switch(type) {
        case 0: opts = [$("#course").val(), $("#smstr").val(), $("#time").val()]
            for(let opt of opts) if (/--/.test(opt)) return;
        break;
        case 1: opts = $("#prof").val(); break;
        case 2: opts = $("#room").val(); break;
        case 4: opts = $("#clss").val(); break;
        default: opts = 'Salas Livres'; break;
    }
    
    //Salve a pesquisa (indefinidamente) em um cookie caso a opção tenha sido marcada pelo usuário
    if ($('#svSchIpnt').is(':checked'))
        document.cookie = `schPref=${[opts, type]}; max-age=315360000; samesite=strict;`;

    //Armezana a última pesquisa por 2 minutos (caso o usuário saia da página sem querer)
    document.cookie = `prvSrch=${[opts, type]}; max-age=120; samesite=strict;`;

    $(".prsnBox").css("flex-direction", "column"); //Voltam os botões a posição normal
    $('.container').remove(); //Ao fazer uma pesquisa, a tabela anterior é descartada
    formTable(fullData, opts, type, clssSz); // Chama a função para iniciar a criação da tabela
    hideSrch(true); // Esconde o menu
}

//Função para dar reset nas pequisas salvas
function resetSavedSearch() {
    document.cookie = 'schPref=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
}





// Triggers
//Trigger para detecar se a página vai carregar com, ou sem, o filtro de professores
$(document).ready(() => {
    const f132OGfilters = sessionStorage.getItem("f132OGfilters");
    
    //Se a variável "teacherFilterEnable" for 1, ele habilita o filtro de professores
    if (f132OGfilters){
        $("#prsnBt3").show();
        $("#prsnBt4").show();
    }
    else {
        $("#prsnBt3").hide();
        $("#prsnBt4").hide();
    }




    //Função para ajustar o tamanho da viewport e de elementos relacionados ao redimensionar a janela ou ao carregar a página
    function windRsz() { let vwptSz = [window.innerHeight, window.devicePixelRatio];
        document.querySelector(':root').style.setProperty('--vwtHgt', vwptSz[0]+'px');

        $(".SearchAreaOff").length && hideSrch(1)

        if (vwptSz[1] > 1){
            $('#ftaLogoSt').attr('media', '(max-height: ' + 560 * vwptSz[1] + 'px)');
        }
    } windRsz();

    function debounce() { let timeoutId;
        return function () { clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            windRsz()
        }, 100);
        };
    }
    
    $(window).resize(debounce());
})

//Trigger para trocar "Salas Livres" para "Encontrar Horários"
$('#room').change(() => {
    $("#fndBt").attr("onclick", "fndTable(2)"); //Altera qual função o botão chama
    $("#fndBt").text("Encontrar Horários");
})

// Trigger do campo de semestre e turno
$("#course").change(() => {
    /*
    Ao selecionar um curso, a opções de semestre e período compatível são obtidas em tempo real
    para evitar filtros não disponíveis
    */

    let slctdCourse = $("#course").val(); //Identificando o curso selecionado pelo user
    let lastSelection = { //identificando o último semestre e período selecionados
        '#smstr': $('#smstr').val(), 
        '#time': $('#time').val() 
    };

    $('#smstr').children().not(':first').remove(); //removendo todas as opções de semestre presentes
    $('#time').children().not(':first').remove(); //removendo todas as opções de período presentes

    for (let field of ['#smstr','#time']) { let Fonts = FilterFlds[slctdCourse][field];
        
        for (let font of Fonts) {
            let optTxt = font.toString().toUpperCase();
            let opt = document.createElement("option");
                opt.setAttribute("value", optTxt);
                opt.innerHTML = optTxt;

            $(field).prop("disabled", false);
            $(field).append(opt);

            if (lastSelection[field] === optTxt)
                $(field).val(optTxt);
        }
        
    } $("#fndBt").attr("disabled", false); //Habilita o botão após selecionar um valor
});

// Trigger de campos do professor
$("#prof").change(() => {
    $("#fndBt").attr("disabled", false); //Habilita o botão após selecionar um valor
});

// Trigger de campos das salas
$("#room").change(() => {
    $("#fndBt").attr("disabled", false); //Habilita o botão após selecionar um valor
});

// Trigger de campos das salas
$("#clss").change(() => {
    $("#fndBt").attr("disabled", false); //Habilita o botão após selecionar um valor
});