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

// Caminhos dos arquivos
const dataDir = path.join(__dirname, "data");
const produtosFile = path.join(dataDir, "produtos.json");
const lojasFile = path.join(dataDir, "lojas.json");

// Garante que a pasta e os arquivos existem
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(produtosFile)) fs.writeFileSync(produtosFile, "[]", "utf8");
if (!fs.existsSync(lojasFile)) fs.writeFileSync(lojasFile, "[]", "utf8");

// Funções auxiliares
const getProdutos = () => JSON.parse(fs.readFileSync(produtosFile, "utf8"));
const saveProdutos = (produtos) =>
  fs.writeFileSync(produtosFile, JSON.stringify(produtos, null, 2), "utf8");

const getLojas = () => JSON.parse(fs.readFileSync(lojasFile, "utf8"));
const saveLojas = (lojas) =>
  fs.writeFileSync(lojasFile, JSON.stringify(lojas, null, 2), "utf8");

// ROTA: Listar produtos
app.get("/api/produtos", (req, res) => {
  res.json(getProdutos());
});
app.get('/api/lojas', (req, res) => {
  const lojas = getLojas();
  res.json(lojas);
});
// ROTA: Adicionar produto
app.post("/api/produtos", (req, res) => {
  let { nome, preco, imagem } = req.body;
  preco = parseFloat(preco);

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof imagem !== "string" ||
    imagem.trim() === "" ||
    isNaN(preco)
  ) {
    return res
      .status(400)
      .json({ error: "Preencha todos os campos corretamente!" });
  }

  const produtos = getProdutos();
  const novoProduto = {
    id: Date.now(),
    nome,
    preco,
    imagem,
  };

  produtos.push(novoProduto);
  saveProdutos(produtos);

  console.log("Produto adicionado:", novoProduto);
  res.json(novoProduto);
});

// ROTA: Excluir produto
app.delete("/api/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produtos = getProdutos().filter((p) => p.id !== id);
  saveProdutos(produtos);
  res.json({ message: "Produto removido" });
});

// ROTA: Adicionar loja
app.post("/api/lojas", (req, res) => {
  const { nome, email, categoria } = req.body;

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof categoria !== "string" ||
    categoria.trim() === ""
  ) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  const lojas = getLojas();
  const novaLoja = {
    id: Date.now(),
    nome,
    email,
    categoria,
  };

  lojas.push(novaLoja);
  saveLojas(lojas);

  console.log("Loja cadastrada:", novaLoja);
  res.json(novaLoja);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
