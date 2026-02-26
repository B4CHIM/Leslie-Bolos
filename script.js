let cart = [];

function addToCart(name, price){
    let item = cart.find(i => i.name === name);
    if(item){
        item.qty++;
    } else {
        cart.push({name, price, qty:1});
    }
    updateCart();
}

function updateCart(){
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const totalDisplay = document.getElementById("total");

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index)=>{
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

    cartCount.innerText = count;
    totalDisplay.innerText = "Total: R$ " + total + ",00";
}

function changeQty(index, change){
    cart[index].qty += change;
    if(cart[index].qty <= 0){
        cart.splice(index,1);
    }
    updateCart();
}

function removeItem(index){
    cart.splice(index,1);
    updateCart();
}

function toggleCart(){
    document.getElementById("cartModal").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function toggleDark(){
    document.body.classList.toggle("dark");
}

function finalizarPedido(){
    if(cart.length === 0){
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = document.querySelector('input[name="pagamento"]:checked').value;

    let mensagem = "Olá! Gostaria de fazer o pedido:%0A";
    let total = 0;

    cart.forEach(item=>{
        mensagem += `- ${item.name} (x${item.qty})%0A`;
        total += item.price * item.qty;
    });

    mensagem += `%0ATotal: R$ ${total},00`;
    mensagem += `%0AForma de pagamento: ${pagamento}`;

    window.open(`https://wa.me/5517992245879?text=${mensagem}`);
}

/* 🔒 GARANTE QUE O HTML CARREGOU */
document.addEventListener("DOMContentLoaded", function(){

    const overlay = document.getElementById("overlay");

    if(overlay){
        overlay.addEventListener("click", toggleCart);
    }

    document.addEventListener("keydown", function(event){
        if(event.key === "Escape"){
            document.getElementById("cartModal").classList.remove("active");
            document.getElementById("overlay").classList.remove("active");
        }
    });

});