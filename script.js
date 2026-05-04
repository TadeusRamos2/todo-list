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

document.getElementById("filtroTodas").addEventListener("click", () => {
    filtroAtual = "todas";
    atualizarLista();
});

document.getElementById("filtroConcluidas").addEventListener("click", () => {
    filtroAtual = "concluidas";
    atualizarLista();
});

document.getElementById("filtroPendentes").addEventListener("click", () => {
    filtroAtual = "pendentes";
    atualizarLista();
});

let dados = localStorage.getItem("tarefas");

if (dados) {
    tarefas = JSON.parse(dados);
}

atualizarLista();

function cadastrar() {
    let texto = document.getElementById("tarefa").value;

    if (!texto) {
        alert("Digite uma tarefa!");
        return;
    }

    if (editandoIndex !== null) {
        tarefas[editandoIndex] = {
            texto: texto,
            concluida: tarefas[editandoIndex].concluida
        };

        editandoIndex = null;
    } else {
        tarefas.push({
            texto: texto,
            concluida: false
        });
    }
    document.getElementById("btnCadastrar").textContent = "Cadastrar";

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

function salvarNoLocalStorage() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}