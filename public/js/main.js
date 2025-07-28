async function carregarProdutos() {
  const res = await fetch("/api/produtos");
  const produtos = await res.json();

  const container = document.getElementById("produtos");
  container.innerHTML = "";

  produtos.forEach(p => {
    const card = document.createElement("div");
    card.className = "produto-card";
    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}" />
      <strong>${p.nome}</strong>
      <span>R$ ${p.preco.toFixed(2)}</span>
      
    `;
    container.appendChild(card);
  });
}

carregarProdutos();

function adicionarCarrinho(id) {
  alert(`Produto ${id} adicionado ao carrinho!`);
}
