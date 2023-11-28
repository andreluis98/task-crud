const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();


let lista_produtos = {
  produtos: [
    { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
    { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
    { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
    { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
    { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" },
  ]
};

app.use((req, res, next) => {
  console.log(`Data: ${new Date()} - Method: ${req.method} - URL: ${req.url}`);
  next();
});

morgan.token('type', function (req, res) { return req.headers['content-type'] });

app.get('/', (req, res) => {
  res.send(`Hello to API World<br>
        <a href="/api/produtos">API de Produtos</a>`);
});


app.get('/api/produtos', (req, res) => {
  let sort = req.query.sort;
  let produtos = lista_produtos.produtos;

  if (sort) {
    produtos = produtos.sort((a, b) => a[sort].localeCompare(b[sort]));
  }

  res.status(200).json(produtos);
});


app.get('/api/produtos/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let produto = lista_produtos.produtos.find(p => p.id === id);

  if (produto) {
    res.status(200).json(produto);
  } else {
    res.status(404).json({ message: 'Produto não encontrado.' });
  }
});


app.post('/api/produtos', express.json(), (req, res) => {
  let novoProduto = req.body;
  novoProduto.id = lista_produtos.produtos.length + 1;
  lista_produtos.produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});


app.put('/api/produtos/:id', express.json(), (req, res) => {
  let id = parseInt(req.params.id);
  let index = lista_produtos.produtos.findIndex(p => p.id === id);

  if (index !== -1) {
    lista_produtos.produtos[index] = { ...lista_produtos.produtos[index], ...req.body };
    res.status(200).json(lista_produtos.produtos[index]);
  } else {
    res.status(404).json({ message: 'Produto não encontrado.' });
  }
});


app.delete('/api/produtos/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let index = lista_produtos.produtos.findIndex(p => p.id === id);

  if (index !== -1) {
    let produtoRemovido = lista_produtos.produtos.splice(index, 1);
    res.status(200).json(produtoRemovido[0]);
  } else {
    res.status(404).json({ message: 'Produto não encontrado.' });
  }
});


app.use((req, res) => {
  res.status(404).send(`<h2>Erro 404 - Recurso não encontrado</h2>`);
});


require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static(path.join(__dirname, '/public')));

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
