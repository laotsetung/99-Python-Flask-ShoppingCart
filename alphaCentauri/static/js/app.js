function salvarProdutos(id,nome,valor,img){ //salva produtos na variavel localStorage('produtos')
  let prods = "";
  prods = localStorage.getItem("produtos");
  let final = id + ':' + nome + ':' + valor + ':' + img;
  if(prods != ""){
    prods = prods + ';' + final;
  }else{
    prods = final;
  }
  
  localStorage.setItem("produtos", prods);
}

function limpaCarrinho(){ //Limpa TODOS os itens do carrinho e esconde o carrinho
  let cart = localStorage.getItem('carrinho');
  let cartArray = cart.split(';');
  cartArray.forEach(item => {
    let idT = item.split(':')[0].split('=')[1];
    removeCarrinho(idT);
  });

  localStorage.setItem("carrinho",'');
  hideCart();
}

function removeCarrinho(idRmv){ //Remove um item do carrinho
  let cart = localStorage.getItem('carrinho');
  let cartArray = cart.split(';');
  let cartFinal = '';

  cartArray.forEach(item => {
    let idT = item.split(':')[0].split('=')[1];
    if (idT != idRmv){
      if (cartFinal != ''){
        cartFinal += ';' + item;
      }else{
        cartFinal += item;
      }
    }else{
      btnCar = document.getElementById('carrin_'+idRmv);
      if(btnCar){
        btnCar.innerText = " Adicionar ao Carrinho";
        btnCar.disabled = false;
      }
    }
  });

  localStorage.setItem('carrinho',cartFinal);
  montaCarrinho();
}

function addInCarrinho(id){ //adciona um item no carrinho
  let cart = localStorage.getItem('carrinho');
  let cartArray = cart.split(';');
  
  let carrinho = '';
  let adiciona = true;

  if(cart != ""){
    cartArray.forEach(item => {
      let idT = item.split(':')[0].split('=')[1];
      if (idT){
        let valT = item.split(':')[1];

        if (idT != id){
          carrinho += 'id='+idT+':'+valT+';';
        }else{
          adiciona = false;
          carrinho += 'id='+idT+':'+parseInt(parseInt(valT)+1)+';';
        }
      }
    });
  }

  if (adiciona){
    carrinho += 'id='+id+':1;';
  }
  
  localStorage.setItem("carrinho",carrinho)
} //fim add In carrinho
  
function limpaProdutos(){ //limpa a variavel produtos para gerar ela denovo e nao multiplicar os items
  localStorage.setItem("produtos","");
}

function showCart(){ //Mostra o carrinho
  cartOverlay.classList.add('transparentBcg');
  cartDOM.classList.add('showCart');
}

function hideCart(){ //Esconde o carrinho
  cartOverlay.classList.remove('transparentBcg');
  cartDOM.classList.remove('showCart');
  calcQtde();
}

function montaCarrinho(){ //desenha o carrinho (acessa a variavel e monta todo o carrinho)
  cartContent.innerHTML = '';

  cart = localStorage.getItem('carrinho');
  cartAr = cart.split(';');

  produtos = localStorage.getItem('produtos');
  produtosAr = produtos.split(';');

  cartAr.forEach(item => {
    id = item.split(':')[0];
    id = id.split('=')[1];
    qtde = item.split(':')[1];
    
    if(id){
      produtosAr.forEach(produto => {
        idP = produto.split(':')[0];
        
        if (id == idP){
          //console.log(id + ' ; ' + idP);
          nomeP =  produto.split(':')[1];
          valorP = produto.split(':')[2];
          imgP = produto.split(':')[3];

          const div = document.createElement('div');
          div.classList.add('cart-item');
          div.innerHTML = `
          <img src="../static/imgs/produtos/${imgP}" alt="${nomeP}"/>
          <div>
              <h4> ${nomeP} </h4>
              <h5> R$${valorP} </h5>
              <span class="remove-item" data-id="${id}" onclick="removeCarrinho(${id})">remove</span>
          </div>
          <div>
              <img src="../static/imgs/icons/seta_cima.svg" alt="" style="width: 27px; height: 27px; cursor:pointer" data-id="${id}" class="addItem" onclick='add(${id})' "/>
              <p class="item-amount" id="item-amount_${id}"> ${qtde} </p>
              <img src="../static/imgs/icons/seta_baixo.svg" alt="" style="width: 27px; height: 30px; cursor:pointer" data-id=${id} class="removeItem" onclick='rmv(${id})'/>
          </div>`;
          cartContent.appendChild(div);

        }
      });
    }
    
  });

  valorTotal();
}

function add(id){ //Adiciona uma quantidade a mais no item dentro do carrinho
  cart = localStorage.getItem('carrinho');
  cartAr = cart.split(';');
  cartFinal = '';

  cartAr.forEach(item => {
    idC = item.split(':')[0].split('=')[1];
    if (idC == id){
      qtd = parseInt(item.split(':')[1]);

      qtd += 1;
      document.getElementById('item-amount_'+id).innerText = qtd;

      if (cartFinal != ''){
        cartFinal += ';id=' + idC + ':'+qtd;
      }else{
        cartFinal += 'id=' + idC + ':'+qtd;
      }
    }else{
      if (cartFinal != ''){
        cartFinal += ';' + item;
      }else{
        cartFinal += item;
      }
    }

  });

  localStorage.setItem('carrinho', cartFinal);
  valorTotal();
}

function rmv(id){ //remove uma quantidade do item no carrinho (se ficar 0 , remove o item)
  cart = localStorage.getItem('carrinho');
  cartAr = cart.split(';');
  cartFinal = '';

  cartAr.forEach(item => {
    idC = item.split(':')[0].split('=')[1];
    if (idC == id){
      qtd = parseInt(item.split(':')[1]);

      qtd -= 1;
      if(qtd < 1){
        removeCarrinho(idC);
        hideCart();
      }else{
        document.getElementById('item-amount_'+id).innerText = qtd;

        if (cartFinal != ''){
          cartFinal += ';id=' + idC + ':'+qtd;
        }else{
          cartFinal += 'id=' + idC + ':'+qtd;
        }
      }
    }else{
      if (cartFinal != ''){
        cartFinal += ';' + item;
      }else{
        cartFinal += item;
      }
    }

  });

  localStorage.setItem('carrinho', cartFinal);
  
  valorTotal();
}

function valorTotal(){ //calcula o valor
  cart = localStorage.getItem('carrinho');
  cartAr = cart.split(';');

  produtos = localStorage.getItem('produtos');
  produtosAr = produtos.split(';');

  total = 0.0;

  cartAr.forEach(item => {
    id = item.split(':')[0].split('=')[1];
    qtde = item.split(':')[1];
    
      produtosAr.forEach(produto => {
        idP = produto.split(':')[0];
        if (id == idP){
          valor = parseFloat(produto.split(':')[2]);
          total += parseFloat(valor * qtde);
        }
      });
    
  });

  document.getElementById('cart-total').innerText = total.toFixed(2);
}

function addCarrinho(id, e){ //funcao chamada quando clicar no botao, 'adiciona no carrinho'
  e.target.innerText =  "No Carrinho";
  e.target.disabled = true;
  addInCarrinho(id); //adiciona produto na memoria
  montaCarrinho(); //desenha
  showCart(); //mostra o carrinho na pagina
}


function calcQtde(){ //CALCULA qtde de itens no carrinho
  cart = localStorage.getItem('carrinho');
  cartAr = cart.split(';');
  qtdeFinal = 0;
  cartAr.forEach(item => {
    qtde = parseInt(item.split(':')[1]);
    if(qtde){
      qtdeFinal += qtde;
    }
  });
  
  cartItems.innerText = qtdeFinal;
}



function resizeIframe() { //aruma a largura e altura do IFRAME (descricao do produto)      
  //altura
  ifrm.style.height = ifrm.contentWindow.document.body.scrollHeight + 'px';
  //largura
  ifrm.style.width = ifrm.contentWindow.document.body.scrollWidth + 'px';
}

function abreDescricao(id){ //quando clicar no produto para mostrar a descricao
  ifrm.src = '/descricao/'+id;
  fundo.style.visibility = 'visible'
  
  div_ifrm.style.visibility = 'visible';
  div_ifrm.style.opacity = '100%';
}

function fechaDesc(){ //fechar o iframe e div que mostra a descricao do produto
  fundo.style.visibility = 'hidden';
  
  div_ifrm.style.opacity = '0%';
  setTimeout(div_ifrm.style.visibility = 'hidden',500);
  
  ifrm.src = ''
}

function bodyLoad(){ //função que reescala a div 'fechaDesc' para o tamanho TOTAL (height) da tela
  let body = document.body,
  html = document.documentElement;

  var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

  document.getElementById('fechaDesc').style.height = height+'px';

  cart = localStorage.getItem('carrinho');
  if (cart != ''){
    //console.log(cart);
    cartAr = cart.split(';');
    
    cartAr.forEach(item => {
      id = parseInt(item.split(':')[0].split('=')[1]);
      if(id){
        btnCar = document.getElementById('carrin_'+id);
        btnCar.innerText = "No Carrinho";
        btnCar.disabled = true;
      }
    });
  }

}
