let cart = [];

// Função para alternar e salvar o Modo Escuro
function toggleDark() {
    const isDark = document.body.classList.toggle("dark");
    // Salva a escolha do usuário (true ou false)
    localStorage.setItem("darkMode", isDark);
}

// 🔒 FUNÇÃO QUE CARREGA AS PREFERÊNCIAS ASSIM QUE A PÁGINA ABRE
document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o usuário já tinha deixado o modo escuro ativo antes
    const darkModeSaved = localStorage.getItem("darkMode");

    if (darkModeSaved === "true") {
        document.body.classList.add("dark");
    }

    // Configuração do overlay (carrinho)
    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.addEventListener("click", toggleCart);
    }
});

// --- FUNÇÕES DO CARRINHO (MANTIDAS) ---

function addToCart(name, price) {
    let item = cart.find(i => i.name === name);
    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const totalDisplay = document.getElementById("total");

    if (!cartItems) return; // Evita erro na página "Sobre" que não tem carrinho

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;

        cartItems.innerHTML += `
        <div class="cart-item">
            <strong>${item.name}</strong><br>
            R$ ${item.price},00
            <div class="qty-control">
                <button onclick="changeQty(${index}, -1)">-</button>
                ${item.qty}
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
            <button onclick="removeItem(${index})">Remover</button>
        </div>
        `;
    });

    if (cartCount) cartCount.innerText = count;
    if (totalDisplay) totalDisplay.innerText = "Total: R$ " + total + ",00";
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    const modal = document.getElementById("cartModal");
    const overlay = document.getElementById("overlay");
    if (modal && overlay) {
        modal.classList.toggle("active");
        overlay.classList.toggle("active");
    }
}

function finalizarPedido() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    let mensagem = "Olá! Gostaria de fazer o pedido:%0A";
    let total = 0;

    cart.forEach(item => {
        mensagem += `- ${item.name} (x${item.qty})%0A`;
        total += item.price * item.qty;
    });

    mensagem += `%0ATotal: R$ ${total},00`;
    mensagem += `%0AForma de pagamento: ${pagamento}`;

    window.open(`https://wa.me/5517992245879?text=${mensagem}`);
}