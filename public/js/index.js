let pagina = 1;
const produtosPorPagina = 30; // 6 colunas × 5 linhas
let produtos = [];

const searchInput = document.querySelector('.search-bar input');
const resultadosDiv = document.querySelector('.resultados-busca');
const gridProdutos = document.querySelector(".produtos-grid");

// Carrega os produtos (da API)
async function carregarProdutos() {
  try {
    const res = await fetch('/api/produtos');
    produtos = await res.json();
    mostrarPagina();
    atualizarPaginacao();
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

// Mostra os produtos da página atual
function mostrarPagina() {
  const inicio = (pagina - 1) * produtosPorPagina;
  const fim = inicio + produtosPorPagina;
  gridProdutos.innerHTML = "";

  produtos.slice(inicio, fim).forEach(p => {
    const div = document.createElement("div");
    div.className = "produto-card";
    div.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <strong>${p.nome}</strong>
      <span>R$ ${p.preco.toFixed(2)}</span>
    `;
    gridProdutos.appendChild(div);
  });
}

// Cria os botões de paginação
function atualizarPaginacao() {
  const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);
  const container = document.getElementById("numeros-paginas");
  container.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === pagina) ? "ativo" : "";
    btn.addEventListener("click", () => {
      pagina = i;
      mostrarPagina();
      atualizarPaginacao();
    });
    container.appendChild(btn);
  }

  document.getElementById("prev").disabled = (pagina === 1);
  document.getElementById("next").disabled = (pagina === totalPaginas);
}

// Botões de navegação
document.getElementById("prev").addEventListener("click", () => {
  if (pagina > 1) {
    pagina--;
    mostrarPagina();
    atualizarPaginacao();
  }
});

document.getElementById("next").addEventListener("click", () => {
  const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);
  if (pagina < totalPaginas) {
    pagina++;
    mostrarPagina();
    atualizarPaginacao();
  }
});

// Exibe resultados da pesquisa sem remover a grade original
function exibirResultados(filtro = '') {
  resultadosDiv.innerHTML = '';

  if (!filtro) {
    resultadosDiv.style.display = 'none';
    return;
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  if (produtosFiltrados.length === 0) {
    resultadosDiv.innerHTML = '<p>Nenhum produto encontrado.</p>';
    resultadosDiv.style.display = 'block';
    return;
  }

  produtosFiltrados.forEach(produto => {
    const item = document.createElement('div');
    item.classList.add('resultado-item');
    item.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="resultado-info">
        <strong>${produto.nome}</strong>
        <span>R$ ${produto.preco.toFixed(2)}</span>
      </div>
    `;
    resultadosDiv.appendChild(item);
  });

  resultadosDiv.style.display = 'block';
}

// Busca dinâmica enquanto digita
searchInput.addEventListener('input', () => {
  const filtro = searchInput.value.trim();
  exibirResultados(filtro);
});

// Inicia o carregamento dos produtos
carregarProdutos();
