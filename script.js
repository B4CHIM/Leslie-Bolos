let carrinho = [];

function toggleCart() {
    document.getElementById("cartModal").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function toggleDark() {
    const isDark = document.body.classList.toggle("dark");
    // Salva a escolha (true ou false) no navegador
    localStorage.setItem("darkMode", isDark);
}

// 🔒 EXECUTA ASSIM QUE A PÁGINA CARREGA
document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o usuário já tinha deixado o modo escuro ativo
    const darkModeSaved = localStorage.getItem("darkMode");

    if (darkModeSaved === "true") {
        document.body.classList.add("dark");
    }
});

function addToCart(nome, preco) {

    const produtoExistente = carrinho.find(item => item.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

function aumentar(index) {
    carrinho[index].quantidade++;
    atualizarCarrinho();
}

function diminuir(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }
    atualizarCarrinho();
}

function remover(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {

    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("total");
    const cartCount = document.getElementById("cartCount");

    cartItems.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach((produto, index) => {

        total += produto.preco * produto.quantidade;
        quantidadeTotal += produto.quantidade;

        const item = document.createElement("div");
        item.classList.add("cart-item");

        item.innerHTML = `
            <p><strong>${produto.nome}</strong></p>
            <p>R$ ${produto.preco.toFixed(2)}</p>

            <div class="qty-control">
                <button class="qty-btn" onclick="diminuir(${index})">-</button>
                <span class="qty-number">${produto.quantidade}</span>
                <button class="qty-btn" onclick="aumentar(${index})">+</button>
            </div>

            <button class="remove-btn" onclick="remover(${index})">
                Remover
            </button>
            <hr>
        `;

        cartItems.appendChild(item);
    });

    totalElement.innerText = "Total: R$ " + total.toFixed(2);
    cartCount.innerText = quantidadeTotal;
}

function finalizarPedido() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá, gostaria de fazer o pedido:%0A%0A";
    let total = 0;

    carrinho.forEach(produto => {
        mensagem += `- ${produto.nome} (${produto.quantidade}x) - R$ ${(produto.preco * produto.quantidade).toFixed(2)}%0A`;
        total += produto.preco * produto.quantidade;
    });

    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;

    mensagem += `%0AForma de pagamento: ${pagamento}`;
    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

    window.open(`https://wa.me/5517992245879?text=${mensagem}`, "_blank");
}