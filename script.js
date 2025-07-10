document.getElementById("rfqForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const descricao = this.descricao.value;
  const quantidade = this.quantidade.value;
  const orcamento = this.orcamento.value;
  const categoria = this.categoria.value;

  const formData = new URLSearchParams();
  formData.append("categoria", categoria);

  fetch('https://script.google.com/macros/s/AKfycbzuvvhDf94oWRkFdLVy1KpjB85ZbXyFx-RLif9_79zytRDyk4R96TGxDByPk1A4aJBlsQ/exec', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(fornecedores => {
      const cardsHTML = fornecedores.map(f =>
        `<div class="cards">
          <h2>${f.nome}</h2>
          <p>${f.email}</p>
          <button type="button" class="btnCotacao"
            data-nome="${f.nome}"
            data-email="${f.email}"
            data-descricao="${descricao}"
            data-quantidade="${quantidade}"
            data-orcamento="${orcamento}"
            data-categoria="${categoria}">
            Solicitar cotação
          </button>
        </div>`
      ).join("");

      const container = document.getElementById("resultadoCards");
      container.innerHTML = cardsHTML;
      container.scrollIntoView({ behavior: "smooth" });
      document.getElementById("formularioRFQ").style.display = "none";

      document.querySelectorAll(".btnCotacao").forEach(botao => {
        botao.addEventListener("click", function () {
          const formData = new URLSearchParams();
          formData.append("descricao", this.dataset.descricao);
          formData.append("quantidade", this.dataset.quantidade);
          formData.append("orcamento", this.dataset.orcamento);
          formData.append("categoria", this.dataset.categoria);
          formData.append("fornecedor", this.dataset.nome);
          formData.append("emailFornecedor", this.dataset.email);

          fetch('https://script.google.com/macros/s/AKfycbzuvvhDf94oWRkFdLVy1KpjB85ZbXyFx-RLif9_79zytRDyk4R96TGxDByPk1A4aJBlsQ/exec', {
            method: 'POST',
            body: formData
          })
            .then(res => res.text())
            .then(resp => {
              console.log("Cotação enviada:", resp);
              alert(`Cotação solicitada para ${formData.get("fornecedor")} com sucesso! ✅`);
            })
            .catch(err => {
              console.error("Erro ao enviar:", err);
              alert("Erro ao solicitar cotação. 😢");
            });
        });
      });
    })
    .catch(err => {
      console.error("Erro ao buscar fornecedores:", err);
      alert("Erro ao carregar fornecedores. 😢");
    });
});