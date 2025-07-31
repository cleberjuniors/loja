const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Caminhos
const dataDir = path.join(__dirname, '..', 'data');
const lojasFile = path.join(dataDir, 'lojas.json');

// Garante que os arquivos existam
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(lojasFile)) fs.writeFileSync(lojasFile, '[]', 'utf8');

// Funções auxiliares
function getLojas() {
  return JSON.parse(fs.readFileSync(lojasFile, 'utf8') || '[]');
}

function saveLojas(lojas) {
  fs.writeFileSync(lojasFile, JSON.stringify(lojas, null, 2), 'utf8');
}

// POST /api/lojas - cadastra nova loja
router.post('/', (req, res) => {
  const { nome, url, logo, descricao, contato, endereco } = req.body;

  if (!nome || !url || !contato) {
    return res.status(400).json({ error: 'Preencha os campos obrigatórios!' });
  }

  const lojas = getLojas();

  if (lojas.find(l => l.url === url)) {
    return res.status(400).json({ error: 'URL da loja já está em uso.' });
  }

  const novaLoja = {
    id: Date.now(),
    nome,
    url,
    logo: logo || '',
    descricao: descricao || '',
    contato,
    endereco: endereco || '',
  };

  lojas.push(novaLoja);
  saveLojas(lojas);

  res.status(201).json(novaLoja);
});

// GET /api/lojas - lista todas as lojas
router.get('/', (req, res) => {
  res.json(getLojas());
});

// GET /api/lojas/:url - retorna dados da loja
router.get('/:url', (req, res) => {
  const lojas = getLojas();
  const loja = lojas.find(l => l.url === req.params.url);
  if (!loja) return res.status(404).json({ error: 'Loja não encontrada.' });
  res.json(loja);
});

module.exports = router;
fetch('/api/lojas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Loja do Cleber',
    url: 'loja-do-cleber',
    logo: 'https://exemplo.com/logo.png',
    descricao: 'Minha loja top',
    contato: '11999999999',
    endereco: 'Rua Exemplo, 123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Loja cadastrada:', data);
})
.catch(err => {
  console.error('Erro ao cadastrar loja:', err);
});