const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal();
})

// FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// FECHAR O MODAL QUANDO CLICAR EM FECHAR
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// VERIFICA E PEGA O NOME E PREÇO DO ITEM
menu.addEventListener("click", function(event){

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))   
        
        addToCart(name, price)
    }
    
})

// FUNÇÃO PARA ADICIONAR AO CARRINHO
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }
    else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

// ATUALIZA O CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium mt-3">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                    <button class="remove-from-cart-btn"
                    data-name="${item.name}">Remover</button>
            </div>
            `

            total += item.price * item.quantity;

            cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// REMOVER O ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function(event){

    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
        
    }
})

// FUNÇÃO PARA REMOVER O ITEM DO CARRINHO
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal()
        
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressWarn.classList.add("hidden")
    }
})

// FINALIZAR O PEDIDO
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "O restaurante está fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        return;
    }

    // ENVIAR O PEDIDO PARA O WHATSAPP
    const cartItems = cart.map((item) => {
        return(` ${item.name} | Quantidade: (${item.quantity}) | Preço: ${item.price} `)
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "5511945402503"

    window.open(`https://wa.me/${phone}?text=${message} | Endereço: ${addressInput.value}`, "_blank")

    cart.length = 0;
    updateCartModal();
    
    
})

// VERIFICAR A HORA E MANIPULAR O CARD DO HORÁRIO
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <= 22; 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}
else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

