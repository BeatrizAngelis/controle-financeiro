// Selecionando elemntos html e armazenando em variaveis
const tbody = document.querySelector("tbody"); 
const descItem = document.querySelector("#desc"); //descrição
const amount = document.querySelector("#amount"); //quantia
const type = document.querySelector("#type"); //tipo entrada ou saida
const btnAdd = document.querySelector("#btnAdd"); //btn incluir
const incomes = document.querySelector(".incomes"); //entrada
const expenses = document.querySelector(".expenses"); //saida
const total = document.querySelector(".total"); //total
const btnLimp = document.querySelector("#btnLimp"); //btn limpar tudo

let items = []; //Variavel declarada para armazenar items da lista

// Função que é chamada quando o botão "Adicionar" é clicado
btnAdd.onclick = () => {
  // Verificando se todos os campos obrigatórios foram preenchidos
    if (descItem.value === "" || amount.value === "" || type.value === "") {
       alert("Preencha todos os campos!")
       return
        // exibe um alerta se algum campo estiver vazio
    }
  
    // exibe um alerta se algum campo estiver vazio
    items.push({
      desc: descItem.value,
      amount: Math.abs(amount.value).toFixed(2),
      type: type.value,
    });
  
    setItensBD();  // atualizando a lista 
  
    loadItens(); // atualizando a exibição da lista
  
     // Limpando os campos de descrição e valor
    descItem.value = "";
    amount.value = "";
  };

  //Limpar tudo dentro da tabela
  btnLimp.onclick = () => {
    const confirmClear = confirm('Tem certeza que deseja excluir todos os itens?');

  if (confirmClear) {
    // Limpar o array de itens
    items = [];
  
    setItensBD(); //salvar a lista vazia no local storage
  
    loadItens(); //atualizar a tabela
  }}

  // Função que remove um item da lista
  function deleteItem(index) {// remove o item do array na posição "index"
    items.splice(index, 1);
    setItensBD();
    loadItens();
  }

  // Função que insere um item na tabela HTML
  function insertItem(item, index) {
    // Criando uma nova linha <tr> na tabela
    let tr = document.createElement("tr"); //cria uma linha (let é uma variavel que só serve para esse local)
  
    // Adicionando as células <td> com os valores
    //limpa a linha(innerHTML)
    tr.innerHTML = ` 
      <td>${item.desc}</td>
      <td>R$ ${item.amount}</td>
      <td class="columnType">${
        item.type === "Entrada"
          ? '<i class="bx bxs-chevron-up-circle"></i>'//se receber entrada vai ter esse icone
          : '<i class="bx bxs-chevron-down-circle"></i>'//senão, vai receber esse
      }</td>

      <td class="columnAction"> 
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
      </td>
    `;
  
    tbody.appendChild(tr);// adicionando a nova linha à tabela HTML
  }

  function loadItens() {
    items = getItensBD(); // obtendo a lista do localstorage
    
    tbody.innerHTML = ""; // limpando a tabela HTML antes de adicionar os itens atualizados
    // Iterando sobre a lista de transações e adicionando cada item na tabela HTML
    items.forEach((item, index) => {
      insertItem(item, index); //adicionar um novo item na tabela
    });
  
    getTotals(); //calcula o total de entradas, o total de saídas e o total geral. 
  }
  
  //Calcular total
  function getTotals() {
    const amountIncomes = items
      .filter((item) => item.type === "Entrada")
      .map((transaction) => Number(transaction.amount));
  
    const amountExpenses = items
      .filter((item) => item.type === "Saida")
      .map((transaction) => Number(transaction.amount));
  
    const totalIncomes = amountIncomes
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2);
  
    const totalExpenses = Math.abs(
      amountExpenses.reduce((acc, cur) => acc + cur, 0)
    ).toFixed(2);
  
    const totalItems = (totalIncomes - totalExpenses).toFixed(2);
  
    incomes.innerHTML = totalIncomes;
    expenses.innerHTML = totalExpenses;
    total.innerHTML = totalItems;
  }

  const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? []; //é usado para recuperar um valor armazenado no localstorage
  const setItensBD = () => //esta função é utilizada para armazenar um valor no local storage
    localStorage.setItem("db_items", JSON.stringify(items)); //para armazenar os dados, utilizaremos o formato JSON e esta função transforma um objeto em string com sintaxe adequado ao JSON
  
  loadItens();
