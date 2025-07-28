const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Permite receber JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// Caminho do arquivo JSON
const dataDir = path.join(__dirname, "data");
const produtosFile = path.join(dataDir, "produtos.json");

// Garante que a pasta e o arquivo existem
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(produtosFile)) {
  fs.writeFileSync(produtosFile, "[]", "utf8");
}

// Funções auxiliares
function getProdutos() {
  return JSON.parse(fs.readFileSync(produtosFile, "utf8"));
}
function saveProdutos(produtos) {
  fs.writeFileSync(produtosFile, JSON.stringify(produtos, null, 2), "utf8");
}

// Rota para pegar produtos
app.get("/api/produtos", (req, res) => {
  res.json(getProdutos());
});

// Rota para adicionar produto
app.post("/api/produtos", (req, res) => {
  const { nome, preco, imagem } = req.body;

  if (!nome || !preco || !imagem) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  const produtos = getProdutos();
  const novoProduto = {
    id: Date.now(),
    nome,
    preco: parseFloat(preco),
    imagem
  };

  produtos.push(novoProduto);
  saveProdutos(produtos);

  console.log("Produto adicionado:", novoProduto);
  res.json(novoProduto);
});

// Rota para excluir produto
app.delete("/api/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produtos = getProdutos().filter(p => p.id !== id);
  saveProdutos(produtos);
  res.json({ message: "Produto removido" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
