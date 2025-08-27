// Dados dos gibis
const comics = [
    {
        id: 1,
        title: "Turma da Mónica - Edição Especial",
        description: "Uma aventura clássica da turma mais amada do Brasil.",
        price: 19.90,
        image: "Turma da Mónica"
    },
    {
        id: 2,
        title: "Batman - O Cavaleiro das Trevas",
        description: "A obra-prima de Frank Miller que redefiniu o Batman.",
        price: 49.90,
        image: "Batman"
    },
    {
        id: 3,
        title: "X-Men - Fênix Negra",
        description: "A saga clássica dos X-Men com a Fênix Negra.",
        price: 39.90,
        image: "X-Men"
    },
    {
        id: 4,
        title: "Homem-Aranha - A Última Caçada",
        description: "Uma das histórias mais marcantes do Homem-Aranha.",
        price: 29.90,
        image: "Homem-Aranha"
    },
    {
        id: 5,
        title: "Watchmen",
        description: "A revolucionária graphic novel de Alan Moore.",
        price: 69.90,
        image: "Watchmen"
    },
    {
        id: 6,
        title: "V de Vingança",
        description: "A distopia clássica de Alan Moore e David Lloyd.",
        price: 45.90,
        image: "V de Vingança"
    },
    {
        id: 7,
        title: "Superman - Entre a Foice e o Martelo",
        description: "Superman em uma Terra alternativa soviética.",
        price: 34.90,
        image: "Superman"
    },
    {
        id: 8,
        title: "Sandman - Volume 1",
        description: "A premiada série de Neil Gaiman sobre o Senhor dos Sonhos.",
        price: 59.90,
        image: "Sandman"
    }
];

// Carrinho de compras
let cart = [];
let cartCount = 0;

// Elementos do DOM
const comicsGrid = document.querySelector('.comics-grid');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Inicializar a loja
function initStore() {
    renderComics();
    loadCart();
    setupEventListeners();
}

// Renderizar os gibis na página
function renderComics() {
    comicsGrid.innerHTML = '';
    
    comics.forEach(comic => {
        const comicCard = document.createElement('div');
        comicCard.classList.add('comic-card');
        comicCard.innerHTML = `
            <div class="comic-image">${comic.image}</div>
            <div class="comic-info">
                <h3 class="comic-title">${comic.title}</h3>
                <p class="comic-description">${comic.description}</p>
                <p class="comic-price">R$ ${comic.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${comic.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        comicsGrid.appendChild(comicCard);
    });
}

// Configurar os event listeners
function setupEventListeners() {
    // Abrir carrinho
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('open');
        overlay.classList.add('active');
        renderCartItems();
    });
    
    // Fechar carrinho
    closeCart.addEventListener('click', closeCartModal);
    overlay.addEventListener('click', closeCartModal);
    
    // Adicionar ao carrinho
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const comicId = parseInt(e.target.getAttribute('data-id'));
            addToCart(comicId);
        }
        
        // Remover item do carrinho
        if (e.target.classList.contains('remove-item')) {
            const comicId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(comicId);
        }
        
        // Alterar quantidade
        if (e.target.classList.contains('quantity-btn')) {
            const comicId = parseInt(e.target.getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            updateQuantity(comicId, isIncrease);
        }
    });
}

// Fechar o modal do carrinho
function closeCartModal() {
    cartModal.classList.remove('open');
    overlay.classList.remove('active');
}

// Adicionar item ao carrinho
function addToCart(comicId) {
    const comic = comics.find(item => item.id === comicId);
    const existingItem = cart.find(item => item.id === comicId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...comic,
            quantity: 1
        });
    }
    
    cartCount += 1;
    updateCartCount();
    saveCart();
    
    // Feedback visual
    const button = document.querySelector(`.add-to-cart[data-id="${comicId}"]`);
    button.textContent = "Adicionado!";
    button.style.backgroundColor = "var(--success)";
    
    setTimeout(() => {
        button.textContent = "Adicionar ao Carrinho";
        button.style.backgroundColor = "var(--primary)";
    }, 1500);
}

// Remover item do carrinho
function removeFromCart(comicId) {
    const itemIndex = cart.findIndex(item => item.id === comicId);
    
    if (itemIndex !== -1) {
        cartCount -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        updateCartCount();
        saveCart();
        renderCartItems();
    }
}

// Atualizar quantidade de um item
function updateQuantity(comicId, isIncrease) {
    const item = cart.find(item => item.id === comicId);
    
    if (item) {
        if (isIncrease) {
            item.quantity += 1;
            cartCount += 1;
        } else {
            if (item.quantity > 1) {
                item.quantity -= 1;
                cartCount -= 1;
            } else {
                removeFromCart(comicId);
                return;
            }
        }
        
        updateCartCount();
        saveCart();
        renderCartItems();
    }
}

// Renderizar itens do carrinho
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateCartTotal();
}

// Atualizar o total do carrinho
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar contador do carrinho
function updateCartCount() {
    cartCountElement.textContent = cartCount;
}

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount);
}

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    const savedCartCount = localStorage.getItem('cartCount');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = parseInt(savedCartCount) || 0;
        updateCartCount();
    }
}

// Inicializar a loja quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initStore);
