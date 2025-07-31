app.get('/api/lojas', (req, res) => {
  const lojas = getLojas();
  res.json(lojas);
});
async function listarLojas() {
  try {
    const res = await fetch("/api/lojas");
    if (!res.ok) throw new Error("Erro ao buscar lojas");
    const lojas = await res.json();

    const lista = document.getElementById("lista-lojas");
    lista.innerHTML = "";

    lojas.forEach(loja => {
      const li = document.createElement("li");
      li.textContent = loja.nome; // adapte para mostrar o que quiser
      lista.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar lojas.");
  }
}

listarLojas();
