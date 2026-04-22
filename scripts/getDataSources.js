async function schSrcs(sourceList = data_sources) {
  var dataList = new Array();
  
  try {
    for (let source of sourceList) {
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
  const source = excelLastEditedSource
  const res = await fetch(source.URL);
  const dataRow = source.InfoPosition !== undefined ? source.InfoPosition[0] : 0;
  const dataCol = source.InfoPosition !== undefined ? source.InfoPosition[1] : 0;
  let data, targetInfo;

  switch (source.FileType) {
    case "json": 
      data = await res.json()
      targetInfo = Object.values(data[dataRow])[dataCol]
    break

    case "csv":
      data = await res.text();
      targetInfo = data.split("\n")[dataRow].split(",")[dataCol].trim();
    break

    case "tsv":
      data = await res.text();
      targetInfo = data.split("\n")[dataRow].split("\t")[dataCol].trim();
    break
  }

  return targetInfo;
}