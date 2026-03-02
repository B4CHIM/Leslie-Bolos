function calcularFretePorCep(cep) {

    cep = cep.replace(/\D/g, "");

    if (cep.length !== 8) return null;

    let prefixo5 = parseInt(cep.substring(0, 5));

    // Centro
    if (prefixo5 >= 15010 && prefixo5 <= 15025) {
        return 5;
    }

    // Redentora / Boa Vista
    if (prefixo5 >= 15040 && prefixo5 <= 15057) {
        return 6;
    }

    // Zona Norte
    if (prefixo5 >= 15085 && prefixo5 <= 15092) {
        return 8;
    }

    // Zona Sul / Iguatemi
    if (prefixo5 >= 15093 && prefixo5 <= 15099) {
        return 9;
    }

    // Região 151xx
    if (prefixo5 >= 15100 && prefixo5 <= 15109) {
        return 10;
    }

    return null;
}

const telefone = "5517992245879";

let cart = [];
let total = 0;

// CARRINHO
function addToCart(nome, preco) {
    let itemExistente = cart.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        cart.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

function atualizarCarrinho() {
    let cartItems = document.getElementById("cartItems");
    let cartCount = document.getElementById("cartCount");
    let totalElement = document.getElementById("total");

    cartItems.innerHTML = "";
    total = 0;
    let quantidadeTotal = 0;

    cart.forEach((item, index) => {
        total += item.preco * item.quantidade;
        quantidadeTotal += item.quantidade;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.nome}</strong>
                    <div class="qty-control">
                        <button onclick="diminuir(${index})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="aumentar(${index})">+</button>
                    </div>
                </div>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
        `;
    });

    cartCount.innerText = quantidadeTotal;
    totalElement.innerText = "Total: R$ " + total.toFixed(2);
}

function aumentar(index) {
    cart[index].quantidade++;
    atualizarCarrinho();
}

function diminuir(index) {
    if (cart[index].quantidade > 1) {
        cart[index].quantidade--;
    } else {
        cart.splice(index, 1);
    }
    atualizarCarrinho();
}

function toggleCart() {
    document.getElementById("cartModal").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function toggleDark() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
}

document.addEventListener("DOMContentLoaded", function() {
    const darkModeSaved = localStorage.getItem("darkMode");

    if (darkModeSaved === "true") {
        document.body.classList.add("dark");
    }
});
// MOSTRAR CAMPO CEP
document.addEventListener("change", function (e) {
    if (e.target.name === "entrega") {
        let enderecoBox = document.getElementById("enderecoBox");

        if (e.target.value === "Entrega") {
            enderecoBox.style.display = "block";
        } else {
            enderecoBox.style.display = "none";
        }
    }
});
// FINALIZAR PEDIDO
let dadosPedidoTemp = {};

function finalizarPedido() {

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    let entrega = document.querySelector('input[name="entrega"]:checked').value;

    let frete = 0;
    let cepInformado = "";

    if (entrega === "Entrega") {

        cepInformado = document.getElementById("cep").value;

        if (cepInformado.trim() === "") {
            alert("Digite seu CEP.");
            return;
        }

        frete = calcularFretePorCep(cepInformado);

        if (frete === null) {
            alert("Ainda não entregamos nessa região.");
            return;
        }
    }

    let totalFinal = total + frete;

    // Guardar temporariamente
    dadosPedidoTemp = {
        pagamento,
        entrega,
        frete,
        cepInformado,
        totalFinal
    };

    mostrarResumo();
}

function mostrarResumo() {

    let resumo = document.getElementById("resumoConteudo");

    let html = "";

    cart.forEach(item => {
        html += `<p>${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}</p>`;
    });

    if (dadosPedidoTemp.entrega === "Entrega") {
        html += `<p>📦 CEP: ${dadosPedidoTemp.cepInformado}</p>`;
        html += `<p>🚚 Frete: R$ ${dadosPedidoTemp.frete.toFixed(2)}</p>`;
    }

    html += `<p><strong>Total: R$ ${dadosPedidoTemp.totalFinal.toFixed(2)}</strong></p>`;
    html += `<p>💰 Pagamento: ${dadosPedidoTemp.pagamento}</p>`;

    resumo.innerHTML = html;

    document.getElementById("resumoModal").style.display = "flex";
}

function fecharResumo() {
    document.getElementById("resumoModal").style.display = "none";
}

function confirmarEnvio() {

    let mensagem = "🍰 *Pedido - Leslie Bolos* %0A%0A";

    cart.forEach(item => {
        mensagem += `- ${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)} %0A`;
    });

    if (dadosPedidoTemp.entrega === "Entrega") {
        mensagem += `%0A📦 CEP: ${dadosPedidoTemp.cepInformado}`;
        mensagem += `%0A🚚 Frete: R$ ${dadosPedidoTemp.frete.toFixed(2)}`;
    }

    mensagem += `%0A%0A💰 Pagamento: ${dadosPedidoTemp.pagamento}`;
    mensagem += `%0A🧾 Total: R$ ${dadosPedidoTemp.totalFinal.toFixed(2)}`;

    let url = "https://wa.me/5517992245879?text=" + mensagem;

    window.location.href = url;
}