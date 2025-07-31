async function listarProdutos() {
  const res = await fetch("/api/produtos");
  const produtos = await res.json();
  const lista = document.getElementById("lista-admin");
  lista.innerHTML = "";

  produtos.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <strong>${p.nome}</strong>
      <span>R$ ${p.preco.toFixed(2)}</span>
      <button onclick="remover(${p.id})">Excluir</button>
    `;
    lista.appendChild(li);
  });
}


document.getElementById("form-produto").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
 const dados = Object.fromEntries(formData);
  const res = await fetch("/api/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  if (res.ok) {
    e.target.reset();
    listarProdutos(); // atualiza lista
  } else {
    const erro = await res.json();
    alert(erro.error || "Erro ao adicionar produto");
  }
});

async function remover(id) {
  await fetch(`/api/produtos/${id}`, { method: "DELETE" });
  listarProdutos();
}

listarProdutos();
