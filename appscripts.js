function doPost(e) {
  const dados = e.parameter;

  // Se for uma solicitação de cotação
  if (dados.fornecedor && dados.emailFornecedor) {
    const sheet = SpreadsheetApp.openById("1G-aR2s900nDW6dMmj0PLceMq6QDzcB3r04OGWvGdTO8").getSheetByName("RFQs");
    sheet.appendRow([
      new Date(),
      dados.descricao,
      dados.quantidade,
      dados.orcamento,
      dados.categoria,
      dados.fornecedor,
      dados.emailFornecedor
    ]);

    // Enviar e-mail para o fornecedor
    const assunto = `Nova solicitação de cotação - ${dados.categoria}`;
    const corpo = `
Olá ${dados.fornecedor},

Você recebeu uma nova solicitação de cotação:

📦 Descrição: ${dados.descricao}
🔢 Quantidade: ${dados.quantidade}
💰 Orçamento: R$ ${dados.orcamento}
🏷️ Categoria: ${dados.categoria}

Por favor, responda com sua proposta o quanto antes.

Atenciosamente,  
Equipe Nice Shot!
    `;

    MailApp.sendEmail(dados.emailFornecedor, assunto, corpo);

    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  }

  // Se for uma requisição de filtro
  if (dados.categoria) {
    const fornecedores = filtrarFornecedoresPorCategoria(dados.categoria);
    return ContentService
      .createTextOutput(JSON.stringify(fornecedores))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput("Requisição inválida").setMimeType(ContentService.MimeType.TEXT);
}

function filtrarFornecedoresPorCategoria(categoria) {
  const planilha = SpreadsheetApp.openById("1G-aR2s900nDW6dMmj0PLceMq6QDzcB3r04OGWvGdTO8");
  const aba = planilha.getSheetByName("Base de Fornecedores");
  const dados = aba.getDataRange().getValues();
  const cabecalhos = dados.shift();

  const fornecedores = dados.map(linha => {
    const fornecedor = {};
    cabecalhos.forEach((coluna, i) => {
      fornecedor[coluna.toLowerCase()] = linha[i];
    });
    return fornecedor;
  });

  return fornecedores.filter(f => f.categoria === categoria);
}