let extCks = document.cookie.split('; ').map(x => x.split('=')); //Coleta os cookies do usuário
const cookies = new Object();

for(let ck of extCks) cookies[ck[0]] = ck[1]; //Cria um JSONarray com os cookies

if (cookies['thmPref']) chgTheme(cookies['thmPref']); //Muda o tema se o usuário definiu outro

if (cookies['clrPref']) chgPltt(cookies['clrPref']); //Muda a paleta de cores se o usuário definiu outra


function schCkFltrs(tblData, sz) {

    if (cookies['prvSrch']) { //Refaz uma pesquisa caso tenha sido feita a menos de 2 minutos
        cookies['prvSrch'] = cookies['prvSrch'].split(',');
        
        if (cookies['prvSrch'].length === 2)
        formTable(tblData, cookies['prvSrch'][0], parseInt(cookies['prvSrch'][1]), sz);
        
        else
        formTable(tblData, cookies['prvSrch'].slice(0,3), parseInt(cookies['prvSrch'][3]), sz);

        return hideSrch(true);
    }

    if (cookies['schPref']){ //Faz uma pesquisa salva pelo assim que o site carrega (isso caso tenham se passado os 2 minutos)
        cookies['schPref'] = cookies['schPref'].split(',');

        if (cookies['schPref'].length === 2)
        formTable(tblData, cookies['schPref'][0], parseInt(cookies['schPref'][1]), sz);
        
        else
        formTable(tblData, cookies['schPref'].slice(0,3), parseInt(cookies['schPref'][3]), sz);

        return hideSrch(true);
    }
}