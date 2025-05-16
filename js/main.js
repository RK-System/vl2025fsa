/*** LISTA DE PRODUTOS ***/
// JSON de produtos
let products = [
  { id: "1", nome: "Camisa Xadrez - Rosa", preco: "R$ 39,90", img: "./assets/img/feminino/1.jpg", categoria: "feminino" },
  { id: "2", nome: "Casaco Xadrez - Branco", preco: "R$ 59,90", img: "./assets/img/feminino/2.jpg", categoria: "feminino" },
  { id: "3", nome: "Blusa Regata - Branca", preco: "R$ 29,90", img: "./assets/img/feminino/3.jpg", categoria: "feminino" },
  { id: "4", nome: "Blusinha - Bege", preco: "R$ 49,90", img: "./assets/img/feminino/4.jpg", categoria: "feminino" },
  { id: "5", nome: "Blusa 3/4 - Oncinha", preco: "R$ 49,90", img: "./assets/img/feminino/5.jpg", categoria: "feminino" },
  { id: "6", nome: "T-shirt - Preta", preco: "R$ 39,90", img: "./assets/img/feminino/6.jpg", categoria: "feminino" },
  { id: "7", nome: "Camisa Manga Longa Stitch - Rosa", preco: "R$ 39,90", img: "./assets/img/infantil/1.jpg", categoria: "infantil" },
  { id: "8", nome: "Camiseta Sonic - Branca", preco: "R$ 39,90", img: "./assets/img/infantil/2.jpg", categoria: "infantil" },
  { id: "9", nome: "Vestido Xadrez - Vermelho", preco: "R$ 59,90", img: "./assets/img/infantil/3.jpg", categoria: "infantil" },
  { id: "10", nome: "Camiseta Dinossauros - Amarela", preco: "R$ 24,90", img: "./assets/img/infantil/4.jpg", categoria: "infantil" },
  { id: "11", nome: "Blusa Minnie - Vermelha", preco: "R$ 49,90", img: "./assets/img/infantil/5.jpg", categoria: "infantil" },
  { id: "12", nome: "Vestido Oncinha", preco: "R$ 59,90", img: "./assets/img/infantil/6.jpg", categoria: "infantil" },
  { id: "13", nome: "Camisa Xadrez Manga Longa - Branca", preco: "R$ 49,90", img: "./assets/img/masculino/1.jpg", categoria: "masculino" },
  { id: "14", nome: "Blusa de Frio com Gola - Azul Escuro", preco: "R$ 69,90", img: "./assets/img/masculino/2.jpg", categoria: "masculino" },
  { id: "15", nome: "Camisa Rick and Morty - Preta", preco: "R$ 59,90", img: "./assets/img/masculino/3.jpg", categoria: "masculino" },
  { id: "16", nome: "Camisa Polo - Cinza", preco: "R$ 49,90", img: "./assets/img/masculino/4.jpg", categoria: "masculino" },
  { id: "17", nome: "Camisa Havaí - Azul Claro", preco: "R$ 24,90", img: "./assets/img/masculino/5.jpg", categoria: "masculino" },
  { id: "18", nome: "Camisa Manga Curta - Bege", preco: "R$ 34,90", img: "./assets/img/masculino/6.jpg", categoria: "masculino" },
];

// Estado
let currentCategory = "todos";  // Categoria inicial
let cartItems = [];
let searchResults = [];
let voltouDoWhatsapp = false;

// Verificar se o usuário voltou do WhatsApp
window.addEventListener('focus', function() {
  if (sessionStorage.getItem('saiuParaWhatsapp') === 'true') {
    voltouDoWhatsapp = true;
    sessionStorage.removeItem('saiuParaWhatsapp');
    exibirAlertaCarrinho("Você tem um pedido não finalizado. Deseja manter os itens no carrinho?", true);
  }
});

// Navegação
function setupNavigation() {
    document.getElementById("nav-todos").onclick = () => {
        currentCategory = "todos";
        generateProductElements();
    };
    document.getElementById("nav-feminino").onclick = () => {
        currentCategory = "feminino";
        generateProductElements();
    };
    document.getElementById("nav-infantil").onclick = () => {
        currentCategory = "infantil";
        generateProductElements();
    };
    document.getElementById("nav-masculino").onclick = () => {
        currentCategory = "masculino";
        generateProductElements();
    };
}

document.addEventListener("DOMContentLoaded", function () {
    setupNavigation(); // Sua chamada existente

    // *** ADICIONE O NOVO CÓDIGO AQUI ***
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoria = this.getAttribute('id').split('-')[1]; // Extrai a categoria do ID (ex: "todos" de "nav-todos")
            filtrarCategoria(categoria);
        });
    });

    // Para os links no modal de categorias:
    const modalCategoryLinks = document.querySelectorAll('#modalCategorias .list-group-item a');
    modalCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoria = this.getAttribute('id').split('-')[1]; // Extrai a categoria do ID (ex: "modal-todos")
            filtrarCategoria(categoria);
            const modalCategorias = bootstrap.Modal.getInstance(document.getElementById('modalCategorias'));
            if (modalCategorias) {
                modalCategorias.hide();
            }
        });
    });

    setupSearch();
    setupLgpd();
    generateProductElements();
});


// Busca
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (searchButton) {
    searchButton.onclick = function() { // Envolve a chamada em uma nova função
      searchProducts(null); // Chama searchProducts sem passar o objeto de evento
    };
  }

  if (searchInput) {
    searchInput.addEventListener("input", function() {
      if (this.value === "") {
        currentCategory = "todos";
        generateProductElements();
      }
    });

    searchInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        searchProducts(null); // Chama searchProducts sem passar o objeto de evento
      }
    });
  }
}

function searchProducts(searchTerm = null) {
  const searchInput = document.getElementById("search-input");
  let termo = "";

  const inputValue = searchTerm !== null ? searchTerm : searchInput?.value;

  if (inputValue) {
    termo = inputValue.toString().toLowerCase();
  } else {
    termo = "";
  }

  let productsToDisplay = products.filter(product => {
    const nomeIncludesTerm = product.nome.toLowerCase().includes(termo);
    const belongsToCategory = currentCategory === "todos" || product.categoria === currentCategory;
    return nomeIncludesTerm && belongsToCategory;
  });
  generateProductElements(productsToDisplay);
}

function filtrarCategoria(categoria) {
  currentCategory = categoria;
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput ? searchInput.value : "";
  searchProducts(searchTerm);
  window.scrollTo(0, 0);

  // Fechar o modal de categorias (se estiver visível)
  const modalCategorias = bootstrap.Modal.getInstance(document.getElementById('modalCategorias'));
  if (modalCategorias) {
    modalCategorias.hide();
  }
}

function generateProductElements(results = null) {
  let container = document.getElementById("product-container");
  container.innerHTML = ""; // Limpa o conteúdo

  let list = results || products;
  let filtered = [];

  if (results !== null) {
    filtered = results; // Se há resultados de busca, exibe-os diretamente
  } else if (currentCategory === "todos") {
    filtered = list; // Se a categoria é "todos", exibe todos os produtos
  } else {
    filtered = list.filter(p => p.categoria === currentCategory); // Filtra pela categoria
  }

  // Se não houver produtos filtrados, mostra mensagem
  if (filtered.length === 0) {
    let msg = document.createElement("p");
    msg.innerText = "Nenhum produto foi encontrado.";
    msg.className = "text-center";
    container.appendChild(msg);
  } else {
    // Criação dos elementos dos produtos filtrados
    for (let product of filtered) {
      let col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

      let card = document.createElement("div");
      card.className = "card h-100 d-flex flex-column justify-content-between align-items-center";
      card.setAttribute("data-categoria", product.categoria); // <<< adiciona a categoria como atributo no card

      let img = document.createElement("img");
      img.src = product.img;
      img.alt = `Imagem do produto: ${product.nome}`;

      img.className = "card-img-top mx-auto d-block";
      card.appendChild(img);

      let body = document.createElement("div");
      body.className = "card-body d-flex flex-column justify-content-center align-items-center";

      let title = document.createElement("h5");
      title.innerText = product.nome;
      title.className = "card-title text-center bold";
      body.appendChild(title);

      let price = document.createElement("p");
      price.innerText = product.preco;
      price.className = "card-text text-center";
      body.appendChild(price);

      card.appendChild(body);

      let footer = document.createElement("div");
      footer.className = "card-footer no-background d-flex justify-content-center";

      let button = document.createElement("input");
      button.type = "button";
      button.value = "Adicionar";
      button.className = "btn btn-primary btn-sm add-to-cart-btn"; // Adicionamos a classe add-to-cart-btn
      button.dataset.productId = product.id; // Vamos adicionar um atributo data-id para identificar o produto
      
      footer.appendChild(button);
      card.appendChild(footer);
      col.appendChild(card);
      container.appendChild(col);
    }
  }
}

// Carregamento
document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  setupSearch(); // Certifique-se que o setupSearch é chamado aqui
  setupLgpd();
  generateProductElements(); // Exibe todos os produtos inicialmente
    const productContainer = document.getElementById("product-container");
    if (productContainer) {
        productContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productId = event.target.dataset.productId;
                const productToAdd = products.find(p => p.id === productId);
                if (productToAdd) {
                    addItemToCart(productToAdd);
                }
            }
        });
    }
});

// Carrinho
function addItemToCart(product) {
  try {
      let existing = cartItems.find(p => p.id === product.id);
      if (existing) {
          existing.quantidade += 1;
          const mensagemAviso = `${product.nome}: Produto já está no carrinho! Quantidade atualizada.`;
          showToast('aviso', mensagemAviso);
      } else {
          cartItems.push({ ...product, quantidade: 1 });
          const mensagemSucesso = `${product.nome}: Produto adicionado ao carrinho!`;
          showToast('sucesso', mensagemSucesso);
      }
      updateCartModal();
      updateCartCount();
  } catch (error) {
      const mensagemErro = `${product.nome}: Erro ao adicionar o produto!`;
      showToast('erro', mensagemErro);
  }
}

// Função para mostrar o Toast correto
function showToast(tipo, mensagem) {
  let toastId = '';
  let textColorClass = '';

  switch (tipo) {
      case 'sucesso':
          toastId = 'toastSucesso';
          textColorClass = ''; // Já é branco por padrão em bg-success
          break;
      case 'aviso':
          toastId = 'toastAviso';
          textColorClass = 'text-dark';
          break;
      case 'erro':
          toastId = 'toastErro';
          textColorClass = ''; // Já é branco por padrão em bg-danger
          break;
      case 'info':
          toastId = 'toastCarrinhoLimpo';
          textColorClass = ''; // Já é branco por padrão em bg-info
          break;
      default:
          return;
  }

  const toastElement = document.getElementById(toastId);
  const toastBody = toastElement.querySelector('.toast-body');
  const toastHeader = toastElement.querySelector('.toast-header strong'); // Opcional: para mudar o título

  if (toastBody) {
      toastBody.innerText = mensagem;
      toastBody.className = `toast-body ${textColorClass}`; // Aplica a classe de cor do texto
  }

  if (toastHeader) {
      toastHeader.innerText = tipo.charAt(0).toUpperCase() + tipo.slice(1); // Opcional: atualiza o título
  }

  const bsToast = bootstrap.Toast.getOrCreateInstance(toastElement);
  bsToast.show();
}

function updateCartCount() {
  const contador = document.getElementById("carrinho-contador-desktop");
  let total = 0;
  for (let item of cartItems) {
    total += item.quantidade;
  }
  contador.innerText = total;

  // Resetando a animação forçadamente
  contador.style.animation = "none";
  contador.offsetHeight; // <<< truque para reiniciar animação
  contador.style.animation = "bounce 0.5s ease";

  // Adiciona animação de pulo
  contador.style.animation = 'bounce 0.5s';
  setTimeout(() => {
    contador.style.animation = 'none';
  }, 500);
}

// Local Storage para o carrinho
function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function limparCarrinho() {
  cartItems = []; // Zera o array de itens do carrinho
  saveCart(); // Salva o carrinho
  updateCartModal(); // Atualiza a listagem do carrinho
updateCartCount();
  // Limpar os campos de nome e endereço
  /*document.getElementById('nomeCliente').value = '';
  document.getElementById('enderecoCliente').value = '';
  document.getElementById('comentarioCliente').value = '';*/

  // Limpar o campo de valor pago
  const valorDinheiroInput = document.getElementById('valorDinheiro');
  if (valorDinheiroInput) {
      valorDinheiroInput.value = '';
  }

  // Resetar o valor do troco e a mensagem de troco insuficiente
  const valorTrocoSpan = document.getElementById('valorTroco');
  if (valorTrocoSpan) {
      valorTrocoSpan.innerText = '0,00';
  }
  const mensagemTrocoDiv = document.getElementById('mensagemTroco');
  if (mensagemTrocoDiv) {
      mensagemTrocoDiv.style.display = 'none';
      mensagemTrocoDiv.innerText = '';
  }

  // Desmarcar opções de pagamento e esconder campos relacionados
  const pagamentoDinheiro = document.getElementById('dinheiro');
  const pagamentoPix = document.getElementById('pix');
  const pagamentoCartao = document.getElementById('cartao');
  if (pagamentoDinheiro) pagamentoDinheiro.checked = false;
  if (pagamentoPix) pagamentoPix.checked = false;
  if (pagamentoCartao) pagamentoCartao.checked = false;
  document.getElementById('campoTroco').style.display = 'none';
  document.getElementById('detalhesPix').style.display = 'none';
}

function updateCartModal() {
    const container = document.getElementById("listaItensCarrinho");
    container.innerHTML = "";

    let totalGeral = 0;

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        let precoUnitario = parseFloat(item.preco.replace("R$", "").replace(",", "."));
        let totalItem = precoUnitario * item.quantidade;
        totalGeral += totalItem;

        let div = document.createElement("div");
        div.className = "d-flex align-items-center border-bottom mb-3 pb-2";
        div.setAttribute('data-id', item.id);

        // Miniatura da imagem
        const img = document.createElement("img");
        img.src = item.img;
        img.className = "img-thumbnail me-2";
        img.style.width = "60px";
        img.style.height = "60px";
        div.appendChild(img);

        // Info do produto
        let infoDiv = document.createElement("div");
        infoDiv.className = "flex-grow-1";

        infoDiv.innerHTML = `
            <strong>${item.nome}</strong><br>
            Preço unitário: R$ ${precoUnitario.toFixed(2).replace(".", ",")}<br>
            Quantidade: ${item.quantidade}<br>
            <strong>Total: R$ ${totalItem.toFixed(2).replace(".", ",")}</strong>
        `;
        div.appendChild(infoDiv);

        // Botões de ação
        let controls = document.createElement("div");
        controls.className = "d-flex flex-column align-items-center";

        const increaseButton = document.createElement("button");
        increaseButton.className = "btn btn-sm btn-success mb-1";
        increaseButton.onclick = () => increaseItem(i);
        increaseButton.innerText = "+";
        controls.appendChild(increaseButton);

        const decreaseButton = document.createElement("button");
        decreaseButton.className = "btn btn-sm btn-warning mb-1";
        decreaseButton.onclick = () => decreaseItem(i);
        decreaseButton.innerText = "-";
        controls.appendChild(decreaseButton);

        const removerButton = document.createElement("button");
        removerButton.className = "btn btn-sm btn-danger btn-remover-item"; // Adiciona a classe aqui
        removerButton.onclick = () => removeItem(i);
        removerButton.innerText = "X";
        controls.appendChild(removerButton);

        div.appendChild(controls);

        container.appendChild(div);
    }

 // Exibir total geral
    const totalCarrinhoElement = document.getElementById("totalCarrinho");
    if (cartItems.length > 0) {
        if (totalCarrinhoElement) {
            totalCarrinhoElement.innerText = ` ${totalGeral.toFixed(2).replace(".", ",")}`;
        } 
        calcularTrocoAutomatico(); // Chama calcularTrocoAutomatico após atualizar o modal
    } else {
        if (totalCarrinhoElement) {
            totalCarrinhoElement.innerText = `R$ 0,00`; // Reseta o valor para 0
        }
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";

        // Limpar os campos de nome e endereço quando o carrinho estiver vazio
        /*document.getElementById('nomeCliente').value = '';
        document.getElementById('enderecoCliente').value = '';
        document.getElementById('comentarioCliente').value = '';*/

        // Limpar o campo de valor pago quando o carrinho estiver vazio
        const valorDinheiroInput = document.getElementById('valorDinheiro');
        if (valorDinheiroInput) {
            valorDinheiroInput.value = '';
        }

        // Resetar o valor do troco e a mensagem de troco insuficiente quando o carrinho estiver vazio
        const valorTrocoSpan = document.getElementById('valorTroco');
        if (valorTrocoSpan) {
            valorTrocoSpan.innerText = '0,00';
        }
        const mensagemTrocoDiv = document.getElementById('mensagemTroco');
        if (mensagemTrocoDiv) {
            mensagemTrocoDiv.style.display = 'none';
            mensagemTrocoDiv.innerText = '';
        }

        // Desmarcar opções de pagamento e esconder campos relacionados
        const pagamentoDinheiro = document.getElementById('dinheiro');
        const pagamentoPix = document.getElementById('pix');
        const pagamentoCartao = document.getElementById('cartao');
        if (pagamentoDinheiro) pagamentoDinheiro.checked = false;
        if (pagamentoPix) pagamentoPix.checked = false;
        if (pagamentoCartao) pagamentoCartao.checked = false;
        document.getElementById('campoTroco').style.display = 'none';
        document.getElementById('detalhesPix').style.display = 'none';

        calcularTrocoAutomatico(); // Chama calcularTrocoAutomatico mesmo com carrinho vazio para resetar o troco
    }
}

function increaseItem(index) {
  cartItems[index].quantidade += 1;
  updateCartModal();
  updateCartCount();
}

function decreaseItem(index) {
  if (cartItems[index].quantidade > 1) {
    cartItems[index].quantidade -= 1;
  } else {
    cartItems.splice(index, 1); // Remove o item se a quantidade chegar a 0
  }
  updateCartModal();
  updateCartCount();
}

function removeItem(index) {
  cartItems.splice(index, 1);
  updateCartModal();
  updateCartCount();
}

function clearCart() {
  cartItems = [];
  updateCartModal();
  updateCartCount();
}

// LGPD
// Se quiser que só apareça dependendo da aceitação
/*function setupLgpd() { 
  if (!getCookie('lgpdConsent')) {
    document.getElementById('lgpdBanner').style.display = 'block';
  }
}*/
// ou sempre apareça dependendi da aceitsção
function setupLgpd() {
  const lgpdBannerElement = document.getElementById('lgpdBanner');
  if (lgpdBannerElement) {
    lgpdBannerElement.style.display = 'block';
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function acceptLgpd() {
  setCookie('lgpdConsent', 'accepted', 365);
  document.getElementById('lgpdBanner').style.display = 'none';
}

function declineLgpd() {
  setCookie('lgpdConsent', 'declined', 365);
  alert('Você recusou o uso de cookies!');
  document.getElementById('lgpdBanner').style.display = 'none';
}

// Tornar funções LGPD globais (chamadas no HTML)
window.acceptLgpd = acceptLgpd;
window.declineLgpd = declineLgpd;
window.addEventListener('DOMContentLoaded', setupLgpd);

// Fecha o menu colapsado ao clicar em um link ou botão dentro da navbar
  document.querySelectorAll('.navbar-collapse .nav-link, .navbar-collapse button').forEach(el => {
    el.addEventListener('click', () => {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
        collapseInstance.hide();
      }
    });
  });

// Navbar
document.getElementById('nav-todos').addEventListener('click', e => {
  e.preventDefault();
  filtrarCategoria('todos');
});
document.getElementById('nav-feminino').addEventListener('click', e => {
  e.preventDefault();
  filtrarCategoria('feminino');
});
document.getElementById('nav-infantil').addEventListener('click', e => {
  e.preventDefault();
  filtrarCategoria('infantil');
});
document.getElementById('nav-masculino').addEventListener('click', e => {
  e.preventDefault();
  filtrarCategoria('masculino');
});

// Mostra o botão quando rolar para baixo
window.onscroll = function() {
  const topButton = document.getElementById("top");
  if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
    topButton.classList.add("show"); // Mostra o botão
  } else {
    topButton.classList.remove("show"); // Esconde o botão
  }
};

// Rolagem suave para o topo
document.getElementById("top").addEventListener("click", function(event) {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Transição suave para o topo
  });
});

function mostrarCampoTroco() {
  const campoTroco = document.getElementById('campoTroco');
  const detalhesPix = document.getElementById('detalhesPix');
  campoTroco.style.display = document.getElementById('dinheiro').checked ? 'block' : 'none';
  detalhesPix.style.display = 'none';
}

function mostrarDetalhesPix() {
  const campoTroco = document.getElementById('campoTroco');
  const detalhesPix = document.getElementById('detalhesPix');
  detalhesPix.style.display = document.getElementById('pix').checked ? 'block' : 'none';
  campoTroco.style.display = 'none';
}

function esconderDetalhesPagamento() {
  document.getElementById('campoTroco').style.display = 'none';
  document.getElementById('detalhesPix').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
const detalhesPixDiv = document.getElementById('detalhesPix');
    if (detalhesPixDiv) {
        const copiarPixBotao = detalhesPixDiv.querySelector('.copiar-pix-botao');
        const chavePixElement = detalhesPixDiv.querySelector('p'); // Mantém esta linha

        if (copiarPixBotao && chavePixElement) {
            copiarPixBotao.addEventListener('click', function() {
                const chavePix = chavePixElement.querySelector('span').textContent.trim();
                navigator.clipboard.writeText(chavePix)
                    .then(() => {
                        showToast('sucesso', 'Chave Pix copiada!');
                        copiarPixBotao.classList.add('copiado');
                        setTimeout(() => {
                            copiarPixBotao.classList.remove('copiado');
                        }, 1000);
                    })
                    .catch(err => {                       
                       showToast('erro', 'ERRO ao copiar Chave Pix copiada!');
                    });
            });
        }
    }
});

function mostrarDetalhesPix() {
    const detalhesPixDiv = document.getElementById('detalhesPix');
    const pixRadio = document.getElementById('pix');

    if (detalhesPixDiv && pixRadio) {
        detalhesPixDiv.style.display = pixRadio.checked ? 'block' : 'none';
    }
}

// Chame a função uma vez no carregamento para definir o estado inicial
document.addEventListener('DOMContentLoaded', mostrarDetalhesPix);

function gerarCodigoAleatorio(tamanho) {
  const caracteres = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  let codigo = '';
  for (let i = 0; i < tamanho; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres.charAt(indiceAleatorio);
  }
  return codigo;
}

function finalizarVenda() {
  const nomeCliente = document.getElementById('nomeCliente').value.trim();
  const enderecoCliente = document.getElementById('enderecoCliente').value.trim();
  const formaPagamento = document.querySelector('input[name="pagamento"]:checked');
  const valorDinheiroInput = document.getElementById('valorDinheiro');
  const listaItensCarrinhoElem = document.getElementById('listaItensCarrinho');
  const itensCarrinhoDivs = listaItensCarrinhoElem.querySelectorAll('.d-flex.align-items-center.border-bottom.mb-3.pb-2');
  const totalCarrinhoElement = document.getElementById('totalCarrinho');
  const valorTrocoSpan = document.getElementById('valorTroco');
  const comentarioClienteInput = document.getElementById('comentarioCliente'); // Captura o textarea
    
    sessionStorage.setItem('saiuParaWhatsapp', 'true');
  saveCart(); // Já deve existir
  localStorage.setItem('pedidoWhatsAppIniciado', 'true');

  if (cartItems.length === 0) {
      showToast('aviso', 'O carrinho está vazio. Adicione itens antes de finalizar.');
      return;
  }

  if (!nomeCliente) {
      showToast('aviso', 'Por favor, informe seu nome.');
      document.getElementById('nomeCliente').focus();
      return;
  }

  if (!enderecoCliente) {
      showToast('aviso', 'Por favor, informe seu endereço.');
      document.getElementById('enderecoCliente').focus();
      return;
  }

  if (!formaPagamento) {
      showToast('aviso', 'Por favor, selecione a forma de pagamento.');
      return;
  }

  // Nova validação para pagamento em dinheiro
  if (formaPagamento.value === 'Dinheiro' && !valorDinheiroInput.value.trim()) {
      showToast('aviso', 'Por favor, informe o valor em dinheiro.');
      valorDinheiroInput.focus();
      return;
  }

  const agora = new Date();
  const dataHoraPedido = `${agora.toLocaleDateString()} ${agora.toLocaleTimeString()}`;

  const itensCarrinhoTexto = Array.from(itensCarrinhoDivs).map(itemDiv => {
      const nome = itemDiv.querySelector('strong').innerText;
      const itemId = itemDiv.getAttribute('data-id');
      const cartItem = cartItems.find(item => item.id === itemId);
      const quantidade = cartItem ? cartItem.quantidade : 1;
      const precoUnitario = parseFloat(cartItem ? cartItem.preco.replace('R$', '').replace(',', '.') : 0);
      const totalItem = precoUnitario * quantidade;
      const quantidadeFormatada = quantidade < 10 ? `0${quantidade}` : `${quantidade}`;
      return `° ${nome} - ${quantidadeFormatada} x R$ ${precoUnitario.toFixed(2).replace('.', ',')} = R$ ${totalItem.toFixed(2).replace('.', ',')}`;
  }).join('\n');

const codigoPedido = gerarCodigoAleatorio(10);

const totalGeralTexto = parseFloat(totalCarrinhoElement.innerText.replace(' ', '').replace('R$', '').replace(',', '.'));
  const totalGeralFormatado = totalGeralTexto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let mensagemWhatsapp = `*Pedido:* ${codigoPedido}\n${dataHoraPedido}\n\n*Nome:* ${nomeCliente}\n*Endereço:* ${enderecoCliente}\n\n*Itens:*\n${itensCarrinhoTexto}\n\n*Total Geral: R$* ${totalGeralFormatado}\n\n*Forma de Pagamento:* `;

  if (formaPagamento) {
    mensagemWhatsapp += formaPagamento.value;
    if (formaPagamento.value === 'Dinheiro') {
      if (valorDinheiroInput.value) {
        const valorDadoTexto = parseFloat(valorDinheiroInput.value.replace(',', '.'));
        const valorDadoFormatado = valorDadoTexto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        mensagemWhatsapp += ` - Valor dado: R$ ${valorDadoFormatado}`;
        if (valorTrocoSpan && valorTrocoSpan.innerText !== '0,00') {
          mensagemWhatsapp += ` - Troco: R$ ${valorTrocoSpan.innerText}`;
        }
      }
    } else if (formaPagamento.value === 'pix') {
      const chavePixElement = document.getElementById('chavePix');
      mensagemWhatsapp += ` *- Chave PIX:* ${chavePixElement.innerText}`;
    }
  } else {
    mensagemWhatsapp += 'Não selecionada';
  }
  
  if (comentarioClienteInput.value.trim()) {
    mensagemWhatsapp += `\n\n*Mensagem do Cliente:* ${comentarioClienteInput.value.trim()}`;
  }
  
  mensagemWhatsapp += '\n\n\n*OBS.:* O pedido será aprovado após conferência dos itens, quantidades, preços e totais.';

  const numeroWhatsapp = '75998886000'; // Substitua pelo seu número
  const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagemWhatsapp)}`;

  window.open(linkWhatsapp, '_blank');
  $('#carrinhoModal').modal('hide');
}

/*const numeroWhatsapp = '75998886000';
    const mensagemTesteNegrito = "*Teste de negrito via código*";
    const linkTeste = `https://wa.me/<span class="math-inline">\{numeroWhatsapp\}?text\=</span>{encodeURIComponent(mensagemTesteNegrito)}`;
    window.open(linkTeste, '_blank');
}*/
//ver se funciona IA MANDOU



// Chave PIX estática (você pode gerar dinamicamente ou buscar do seu backend)
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('chavePix').innerText = '75998886000';
});

// Modificação no modal-footer para adicionar o botão "FINALIZAR VENDA"
document.addEventListener('DOMContentLoaded', () => {
  const modalFooter = document.querySelector('#carrinhoModal .modal-footer');
  if (modalFooter) {
      const limparCarrinhoButton = modalFooter.querySelector('.btn-danger');
      const finalizarButton = modalFooter.querySelector('.btn-success');

      // Verifica se ambos os botões foram encontrados
      if (limparCarrinhoButton && finalizarButton) {
          // Verifica se os botões ainda são filhos do modalFooter antes de remover
          if (limparCarrinhoButton.parentNode === modalFooter && finalizarButton.parentNode === modalFooter) {
              // Remove os botões da ordem atual
              modalFooter.removeChild(limparCarrinhoButton);
              modalFooter.removeChild(finalizarButton);

              // Adiciona os botões na nova ordem desejada
              modalFooter.appendChild(limparCarrinhoButton);
              modalFooter.appendChild(finalizarButton);
          }
      }
  }
});

function calcularTrocoAutomatico() {
  const valorPagoStr = document.getElementById('valorDinheiro').value;
  const valorPago = parseFloat(valorPagoStr.replace(',', '.'));
  const totalCarrinhoElement = document.getElementById('totalCarrinho');
  const valorTrocoSpan = document.getElementById('valorTroco');

  if (valorTrocoSpan) { // Verifica se o elemento valorTroco existe
      if (totalCarrinhoElement) { // Verifica se o elemento totalCarrinho existe
          const totalCarrinhoStr = totalCarrinhoElement.innerText.replace('Total Geral: R$ ', '').replace(',', '.');
          const totalCarrinho = parseFloat(totalCarrinhoStr);

          if (!isNaN(valorPago) && !isNaN(totalCarrinho)) {
              const troco = valorPago - totalCarrinho;
              valorTrocoSpan.innerText = troco.toFixed(2).replace('.', ',');
              const mensagemTrocoDiv = document.getElementById('mensagemTroco');
              mensagemTrocoDiv.style.display = troco < 0 ? 'block' : 'none';              
              mensagemTrocoDiv.innerText = troco < 0 ? 'Valor pago é insuficiente!' : '';
          } else {
              valorTrocoSpan.innerText = '0,00';
              const mensagemTrocoDiv = document.getElementById('mensagemTroco');
              mensagemTrocoDiv.style.display = 'none';
              mensagemTrocoDiv.innerText = '';
          }
      } else {
          valorTrocoSpan.innerText = '0,00'; // Define o troco como 0 se o total não existir
          const mensagemTrocoDiv = document.getElementById('mensagemTroco');
          mensagemTrocoDiv.style.display = 'none';
          mensagemTrocoDiv.innerText = '';
      }
  } 
}