const express = require("express");

const app = express();

let produtos = [];

app.use(express.json());
app.use(express.static("public"));

app.get("/produtos", (req, res) => {
    res.json(produtos);
});

app.post("/produtos", (req, res) => {

    const novoProduto = {
        id: Date.now(),
        nome: req.body.nome,
        quantidade: req.body.quantidade,
        preco: req.body.preco
    };

    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});

app.put("/produtos/:id", (req, res) => {

    const id = Number(req.params.id);

    const produto = produtos.find((produto) => produto.id === id);

    if (!produto) {
        return res.status(404).json({
            mensagem: "Produto não encontrado."
        });
    }

    produto.nome = req.body.nome;
    produto.quantidade = req.body.quantidade;
    produto.preco = req.body.preco;

    res.json(produto);
});

app.delete("/produtos/:id", (req, res) => {

    const id = Number(req.params.id);

    const indice = produtos.findIndex((produto) => produto.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Produto não encontrado."
        });
    }

    const produtoRemovido = produtos.splice(indice, 1);

    res.json({
        mensagem: "Produto removido com sucesso.",
        produto: produtoRemovido[0]
    });
});

app.listen(4000, () => {
    console.log("Servidor rodando em http://localhost:4000");
});