async function schSrcs() {
  // const sourcesList = Object.entries(sources);
  var dataList = new Array();
  
  try {

    for (let source of sources) {
      const res = await fetch(source.URL);
      if (!res.ok) throw new Error(`Erro na primeira fonte (${source.URL})`);
      
      if (source.FileType === "json") {
        const jsonData = await res.json();
        dataList.push(jsonData);
      } else if (source.FileType === "csv" || source.FileType === "tsv") {
        const text = await res.text();
        dataList.push(formTableData(text, source.FileType));
      } else {
        throw new Error(`Tipo de arquivo desconhecido para a fonte ${source.URL}`);
      }
    }

    return dataList.flat();
  
  } catch (e) {
    console.error(e.message);
    alert("Erro: " + e.message);
  }
}

async function schLastEdited() {
  const res = await fetch(excelLastEditedSource);
  const data = await res.text();
  const targetInfo = data.split("\n")[0].split("\t")[1];
  

  return targetInfo.replace(" ", " às ");
}