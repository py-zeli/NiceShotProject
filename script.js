// ===================
// Base de fornecedores (mock)
// ===================
const fornecedores = [
  { nome: "Fornecedor XPTO", categoria: "ME01", email: "xpto@empresa.com" },
  { nome: "Tech Cloud", categoria: "ITSN", email: "cloud@empresa.com" },
  { nome: "Papel & Cia", categoria: "ME01", email: "contato@papelcia.com" }
];

// ===================
// Sidebar Accordion (caso ainda use)
// ===================
document.querySelectorAll(".accordion").forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.toggle("active");
    const panel = this.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});

// ===================
// Abrir e fechar formulário
// ===================
document.getElementById("abrirFormulario").addEventListener("click", () => {
  document.getElementById("formularioRFQ").style.display = "block";
});

document.getElementById("fecharFormulario").addEventListener("click", () => {
  document.getElementById("formularioRFQ").style.display = "none";
});

document.getElementById("rfqForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const descricao = this.descricao.value;
  const quantidade = this.quantidade.value;
  const orcamento = this.orcamento.value;
  const categoria = this.categoria.value;

  const filtrados = fornecedores.filter(f => f.categoria === categoria);

  const cardsHTML = filtrados.map((f, index) =>
    `<div class="cards">
      <h2>${f.nome}</h2>
      <p>${f.email}</p>
      <button class="btnCotacao" data-nome="${f.nome}" data-email="${f.email}" data-descricao="${descricao}" data-quantidade="${quantidade}" data-orcamento="${orcamento}" data-categoria="${categoria}">
        Solicitar cotação
      </button>
    </div>`
  ).join("");

  const container = document.getElementById("resultadoCards");
  container.innerHTML = cardsHTML;
  container.scrollIntoView({ behavior: "smooth" });

  // Fecha o formulário
  document.getElementById("formularioRFQ").style.display = "none";

  // Ativa o evento de clique para cada botão de cotação
  document.querySelectorAll(".btnCotacao").forEach(botao => {
    botao.addEventListener("click", function () {
      const dados = {
        descricao: this.dataset.descricao,
        quantidade: this.dataset.quantidade,
        orcamento: this.dataset.orcamento,
        categoria: this.dataset.categoria,
        fornecedor: this.dataset.nome,
        emailFornecedor: this.dataset.email
      };

      fetch('https://script.google.com/macros/s/AKfycbzuvvhDf94oWRkFdLVy1KpjB85ZbXyFx-RLif9_79zytRDyk4R96TGxDByPk1A4aJBlsQ/exec', {
        method: 'POST',
        body: JSON.stringify(dados),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.text())
      .then(resp => {
        console.log("Cotação enviada:", resp);
        alert(`Cotação solicitada para ${dados.fornecedor} com sucesso! ✅`);
      })
      .catch(err => {
        console.error("Erro ao enviar:", err);
        alert("Erro ao solicitar cotação. 😢");
      });
    });
  });
});