const carrinho = document.querySelector('.carrinho')
const modal = document.querySelector('.modal')
const menu = document.querySelector('#menu')
const cartBtn = document.querySelector('#btn-cart')
const cartItens = document.querySelector('#cart-itens')
const cartTotal = document.querySelector('#cart-total')
const checkBtn = document.querySelector('.check-btn')
const cartCount = document.querySelector('#cart-count')
const addressInput = document.querySelector('#address')
const addressWarn = document.querySelector('#address-warn')
const addToCartBtn = document.querySelector('.add-to-cart-btn')
const home = document.querySelector('.home')
const endereco = document.querySelector('.endereco')


const cart = []


const ativarCarrinho = () => {

modal.classList.add('ativo')
updateCartModal()

}

const fecharCarrinho = () => {
    modal.classList.remove('ativo')
}

modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        fecharCarrinho()
    }

})

home.addEventListener('click', function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton) {
    const name = parentButton.getAttribute('data-name')
    const price = Number( parentButton.getAttribute('data-price'))
    

        addToCart(name, price)
    }
}) 

 function addToCart(name, price) {
    const existItem = cart.find(item => item.name === name)
    if(existItem) {
        existItem.quantity ++
        
        
    } else {
        cart.push({
            name,
            price,
            quantity: 1,

            

        })
    }
    
    updateCartModal()

    
    }

function updateCartModal() {
    cartItens.innerHTML = ''
    let total = 0


    cart.forEach(item => {
        const cartItemElement = document.createElement('div')

        cartItemElement.innerHTML = `
        <div class="item-adicionado">
            <div>
            <p>${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="item-preço">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-btn" data-name="${item.name}">
                Remover
                </button>
            </div>
        </div>
        <hr>
        `

        total += item.price * item.quantity
        

        cartItens.appendChild(cartItemElement)
        
    
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    cartCount.innerHTML = cart.length
    

}

 modal.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
        updateCartModal()
    }



})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)
    if(index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity --
            updateCartModal()
            return
            
        } 

        cart.splice(index, 1)
        
        
        updateCartModal()
        
        
        
        

    }

        
}

addressInput.addEventListener('input', function     (event) {
        let inputValue = event.target.value 
        if (inputValue !== "") {
            addressWarn.style.display = 'none'
        }
            


    })

checkBtn.addEventListener('click', function() {

    const isOpen = checkRestaurantOpen()
    if(!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
            },
            onClick: function(){} // Callback after click
          }).showToast();
      return

   }





    if(cart.length === 0) {
        alert('Adicione itens ao carrinho')
    } else if (addressInput.value === "") {
        addressWarn.style.display = 'block'
        return

    }

    //Envir o pedido para a api do whatsapp
    const cartItens = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: ${item.quantity} Preço: R$${item.price} |`
            
        )
    }).join("")
    const message = encodeURIComponent(cartItens)
    const phone = "77999012759"

    window.open(`https://wa.me/${phone}?text${message} Endereço:${addressInput.value} `, "_blank")

    cart.length = 0
    updateCartModal()
  
})

function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 23

}

const horario =  document.querySelector(".horario")
const isOpen = checkRestaurantOpen()
   
   
    if(isOpen) {
        horario.innerHTML += '<br> (Aberto)'
    } else {
        horario.style.backgroundColor = 'red'
        horario.innerHTML += '<br> (Fechado)'
    }