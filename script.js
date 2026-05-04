let tarefas = [];
let editandoIndex = null;
let filtroAtual = "todas";

document.getElementById("btnCadastrar").addEventListener("click", cadastrar);

document.getElementById("lista").addEventListener("click", function(e) {
    if (e.target.classList.contains("texto-tarefa")) {
        let index = e.target.getAttribute("data-index");
        alternarConclusao(index);
    }

    if (e.target.classList.contains("editar")) {
        let index = e.target.getAttribute("data-index");
        editar(index);
    }

    if (e.target.classList.contains("remover")) {
        let index = e.target.getAttribute("data-index");
        remover(index);

    if (confirm("Deseja excluir essa tarefa?")) {
}
    }

    if (e.target.classList.contains("checkbox")) {
    let index = Number(e.target.getAttribute("data-index"));
    alternarConclusao(index);
}

document.querySelectorAll(".filtros button").forEach(btn => {
    btn.classList.remove("ativo");
});

e.target.classList.add("ativo");

});

document.getElementById("filtroTodas").addEventListener("click", function() {
    filtroAtual = "todas";
    atualizarFiltroAtivo(this);
    atualizarLista();
});

document.getElementById("filtroConcluidas").addEventListener("click", function() {
    filtroAtual = "concluidas";
    atualizarFiltroAtivo(this);
    atualizarLista();
});

document.getElementById("filtroPendentes").addEventListener("click", function() {
    filtroAtual = "pendentes";
    atualizarFiltroAtivo(this);
    atualizarLista();
});

let dados = localStorage.getItem("tarefas");

if (dados) {
    tarefas = JSON.parse(dados);
}

atualizarLista();

function cadastrar() {
    let texto = document.getElementById("tarefa").value;

    let botao = document.getElementById("btnCadastrar");
        botao.textContent = "Salvando...";
        botao.disabled = true;

    if (!texto) {
        mostrarMensagem("Digite uma tarefa!", "erro");
        return;
    }

    if (editandoIndex !== null) {

        tarefas[editandoIndex] = {
            texto,
            concluida: tarefas[editandoIndex].concluida
        };

        editandoIndex = null;

        document.getElementById("btnCadastrar").textContent = "Cadastrar";

        mostrarMensagem("Tarefa editada com sucesso!", "sucesso");

    } else {

        tarefas.push({ texto, concluida: false });

        mostrarMensagem("Tarefa adicionada com sucesso!", "sucesso");

    }

      botao.textContent = "Cadastrar";
      botao.disabled = false;

    salvarNoLocalStorage();
    atualizarLista();

    document.getElementById("tarefa").value = "";
}

function atualizarLista() {
    let lista = document.getElementById("lista");

    let tarefasFiltradas = tarefas.map((tarefa, indexOriginal) => {
    return {
        texto: tarefa.texto,
        concluida: tarefa.concluida,
        indexOriginal: indexOriginal
    };
});

if (filtroAtual === "concluidas") {
    tarefasFiltradas = tarefasFiltradas.filter(t => t.concluida);
}

if (filtroAtual === "pendentes") {
    tarefasFiltradas = tarefasFiltradas.filter(t => !t.concluida);
}

if (tarefasFiltradas.length === 0) {
    lista.innerHTML = "<p>Nenhuma tarefa encontrada</p>";
    return;
}

    lista.innerHTML = tarefasFiltradas.map(t => `
    <li class="${t.concluida ? 'concluida' : ''}">
        <div>
            <input type="checkbox"
                   class="checkbox"
                   data-index="${t.indexOriginal}"
                   ${t.concluida ? "checked" : ""}>

            <span class="texto-tarefa">
                ${t.texto}
            </span>
        </div>

        <div>
            <button class="editar" data-index="${t.indexOriginal}">Editar</button>
            <button class="remover" data-index="${t.indexOriginal}">Remover</button>
        </div>
    </li>
`).join('');
}

function editar(index) {
    if (!tarefas[index]) {
        return;
    }

    document.getElementById("tarefa").value = tarefas[index].texto;
    editandoIndex = index;

    document.getElementById("btnCadastrar").textContent = "Salvar edição";
}

function remover(index) {
    tarefas.splice(index, 1);
    salvarNoLocalStorage();
    atualizarLista();
}

function alternarConclusao(index) {
    index = Number(index);

    if (!tarefas[index]) {
        console.log("Tarefa não encontrada. Índice:", index);
        return;
    }

    tarefas[index].concluida = !tarefas[index].concluida;

    salvarNoLocalStorage();
    atualizarLista();
}

function atualizarFiltroAtivo(botaoClicado) {
    document.querySelectorAll(".filtros button").forEach(botao => {
        botao.classList.remove("ativo");
    });

    botaoClicado.classList.add("ativo");
}

function mostrarMensagem(texto, tipo) {
    let mensagem = document.getElementById("mensagem");

    mensagem.textContent = texto;
    mensagem.className = tipo + " show";

    setTimeout(() => {
        mensagem.className = "";
    }, 2000);
}

function salvarNoLocalStorage() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}