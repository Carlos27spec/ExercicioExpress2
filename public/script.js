const form = document.getElementById("formPet");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const quantidade = document.getElementById("quantidade").value;
    const preco = document.getElementById("preco").value;

    if (!validarProduto(nome,quantidade,preco)) {
        mostrarErro()
        return;
    }

    esconderErro();

    const resposta = await fetch("/produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            quantidade: Number(quantidade),
            preco: parseFloat(preco.replace(",", "."))
        })
    });

    const produto = await resposta.json();

    console.log(produto);

    form.reset();

    carregarProdutos();
});

async function carregarProdutos() {

    const resposta = await fetch("/produtos");

    const produtos = await resposta.json();

    const lista = document.getElementById("listaProdutos");

    lista.innerHTML = "";

    produtos.forEach((produto) => {

        const item = document.createElement("div");
        item.classList.add("item-produto");

        const info = document.createElement("span");
        info.textContent = `${produto.nome} — Qtd: ${produto.quantidade} — R$ ${produto.preco.toFixed(2)}`;

        item.appendChild(info);

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.addEventListener("click", () => editarProduto(produto));

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", () => excluirProduto(produto.id));

        item.appendChild(botaoEditar);
        item.appendChild(botaoExcluir);

        lista.appendChild(item);
    });

    atualizarTotal(produtos);
}

function atualizarTotal(produtos) {

    const total = produtos.reduce((soma, produto) => {
        return soma + (produto.quantidade * produto.preco);
    }, 0);

    document.getElementById("totalCompra").textContent = `Total: R$ ${total.toFixed(2)}`;
}

function editarProduto(produto) {
    document.getElementById("editarID").value = produto.id;
    document.getElementById("editarNome").value = produto.nome;
    document.getElementById("editarQuantidade").value = produto.quantidade;
    document.getElementById("editarPreco").value = produto.preco;

    document.getElementById("Edicao").style.display = "block";
}

function descartarEdicao() {
    document.getElementById("Edicao").style.display = "none";
}

async function salvarEdicao() {

    const id = document.getElementById("editarID").value;
    const nome = document.getElementById("editarNome").value;
    const quantidade = document.getElementById("editarQuantidade").value;
    const preco = document.getElementById("editarPreco").value;

    const resposta = await fetch(`/produtos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            quantidade: Number(quantidade),
            preco: Number(preco)
        })
    });

    const produtoAtualizado = await resposta.json();

    console.log(produtoAtualizado);

    document.getElementById("Edicao").style.display = "none";

    carregarProdutos();
}

async function excluirProduto(id) {

    const resposta = await fetch(`/produtos/${id}`, {
        method: "DELETE"
    });

    const resultado = await resposta.json();

    console.log(resultado);

    carregarProdutos();
}

carregarProdutos();

const palavraChave = "gol2026rebaixado";

function palavraChave(...valores) {
    return valores.some(valor => 
        valor.trim().toLowerCase().includes(palavraChave)
    );
}



function validarProduto(nome, quantidade, preco) {
    const nomeValido = nome.trim().length > 0;
    const quantidadeValida = /^[0-9]+$/.test(quantidade.trim());
    const precoValido = /^[0-9]+([,.][0-9]{1,2})?$/.test(preco.trim());

    if (palavraChave(nome,quantidade,preco)){
        return false;
    }
    return nomeValido && quantidadeValida && precoValido
}

