/*lista de dividas*/
const ulElement = document.querySelector('#app ul');
/*modal com os campos para preencher as dividas */
const modal = document.querySelector('#modal');
/*botao para salvar o valor em caixa */
const btn_caixa = document.querySelector('#app button#cad_caixa');
/*botao pra cadastrar divida */
const btnCad = document.querySelector('#footer-style button#btn-cadastro');

const inputDesc = document.querySelector('#app input#desc');
const inputValor = document.querySelector('#app input#valor');
const buttonElement = document.querySelector('#app button#btn-cad');
const buttonClose = document.querySelector('#app button#close');
const inputCaixa = document.querySelector('#app #caixa');
const saldoElement = document.querySelector('#app #saldo');
const dividaElement = document.querySelector('#app #divida');

window.onload = function(e){ 
   setCaixa();
   somaTodo();
}
	/**MASCARA PARA FORMATAR MOEDA */
	const Mask = {
		apply(input,func){
			setTimeout(()=>{
			 input.value =  Mask[func](input.value)      
			},1)
		},
		formatBRL(value){
			const expReg = /\D/g;
			value = value.replace(expReg ,"");
			return new Intl.NumberFormat('pt-BR',{
				style:'currency',
				currency:'BRL'
			}).format(value /100)
		},
		formatPrice(price){
      return new Intl.NumberFormat('pt-BR',{
        style:'currency',
        currency:'BRL'
      }).format(price /100)
    } 
	}
	
	const todos = JSON.parse(localStorage.getItem('list_Todo')) || [];
	/*adiciona items ao array*/
	function addTodos() {
		/*let valorFormatado =  new Intl.NumberFormat('pt-br',
		{style:'currency',currency:"BRL"}).format(inputValor.value);
		*/
		let todoLista ={
			descricao:inputDesc.value,
			valor:inputValor.value.replace(/\D/g,"")
		} 
		
		if(todoLista.valor == ''){
			buttonElement.setAttribute('disabled','disabled');
		}
			todos.push(todoLista);
			inputDesc.value = '';
			inputValor.value = '';
			renderTodoList();
			saveToStorage();
		
	}
	/*lista os items cadastrados*/
	function renderTodoList(){
		deletaConta();
		somaTodo();
	}
	function deletaConta(){
		ulElement.innerHTML = '';
		for(todo of todos){
			/*cria a lista*/
			let todoElement = document.createElement('li');
			
			/*copia o texto para o li*/
			/* 	let res = new Intl.NumberFormat('pt-br',
			{style:'currency',currency:"BRL"}).format(todo.valor); */
			let todoText = document.createTextNode(`${todo.descricao}${Mask.formatBRL(todo.valor)}`)
			
			/*pega a posição a ser excluida*/
			let pos = todos.indexOf(todo);
			/*cria e adiciona o link de excluir*/
			let excluirElemento = document.createElement('a');
			let alterarElemento = document.createElement('a');
			excluirElemento.setAttribute('onclick', 'deletaTodo('+ pos +')');
			alterarElemento.setAttribute('onclick', 'alteraTodo('+ pos +')');
			alterarElemento.classList.add('editar');
			excluirElemento.classList.add('excluir');
			excluirElemento.setAttribute('href', "#", )
			alterarElemento.setAttribute('href', "#")
			let textoExcluir = document.createTextNode('X');
			let textoAlterar = document.createTextNode('editar');
			excluirElemento.appendChild(textoExcluir);
			alterarElemento.appendChild(textoAlterar);
			
			/*adiciona o texto ao li*/
			todoElement.appendChild(todoText);
			todoElement.appendChild(excluirElemento);
			todoElement.appendChild(alterarElemento);
			
			/*adiciona o li ao ul*/
			ulElement.appendChild(todoElement);
		}
	}
	
	function somaTodo() {
		let resultado = 0;
		
		for(todo of todos){
			let aux = todo.valor.replace(/\D/g,"")
			resultado += parseFloat(aux)		
		}
		dividaElement.innerHTML = Mask.formatPrice(resultado);
		let saldoTotal = parseFloat(inputCaixa.value.replace(/\D/g,"")) - resultado;
		
		if(saldoTotal > 0){
			saldoElement.classList.add('green');
			saldoElement.classList.remove('red');
		}
		else{
			saldoElement.classList.add('red');
			saldoElement.classList.remove('green');
		}
		saldoElement.innerHTML = Mask.formatPrice(saldoTotal);
	}
	function setCaixa(){
		inputCaixa.value = Mask.formatPrice(JSON.parse(localStorage.getItem('valor_caixa')) || 0);    
		somaTodo();
	}
	function alteraTodo(pos) {
		console.log(todos[pos])
	}
	/*deleta item*/
	function deletaTodo(pos) {
		todos.splice(pos, 1 );
		renderTodoList();
		saveToStorage();
	}
	/*salva no starage*/
	function saveToStorage(){
		localStorage.setItem('list_Todo',JSON.stringify(todos));
	}
	
	
	function modalOn(){
		modal.classList.add("modal");
		modal.classList.remove("removeModal");
		
	}
	function modalOff(){
		modal.classList.remove("modal");
		modal.classList.add("removeModal");
		
	}
	/**original*/
	function getCaixa(){
		let valorCaixa = parseFloat(JSON.parse(localStorage.getItem('valor_caixa')) || 0); 
		let valor = parseFloat(inputCaixa.value.replace(/\D/g,""))
		if(valor <=0 ){
			localStorage.setItem('valor_caixa',JSON.stringify(valor));
		}else{
			let resultado = valorCaixa + valor
			localStorage.setItem('valor_caixa',JSON.stringify(resultado));
			}
		setCaixa();
		
	}
	/* function getCaixa(){
		let valorCaixa = parseFloat(JSON.parse(localStorage.getItem('valor_caixa')).replace(/\D/g,"").replace(/\D/g,"") || 0); 
		let valor = parseFloat(inputCaixa.value.replace(/\D/g,""))
		let resultado = valorCaixa + valor
		console.log(Mask.formatPrice(resultado))
	} */
	/*cadastra o item a lista*/
	buttonElement.onclick = addTodos;
	btnCad.onclick = modalOn;
	buttonClose.onclick = modalOff; 
	btn_caixa.onclick = getCaixa;
	
	/*cria o style do botao*/
	//modal.style.display = 'none';
	
	//chama a funcao para mostra a lista
	renderTodoList();