const blockInput = document.getElementById("blockInput");
const addBlockBtn = document.getElementById("addBlock");
const blocksContainer = document.getElementById("blocksContainer");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const blockTitle = document.getElementById("blockTitle");

let blocks = JSON.parse(localStorage.getItem("blocks")) || [];
let activeBlock = null;

// Рендер блоков
function renderBlocks() {
    blocksContainer.innerHTML = "";

    blocks.forEach((block, index) => {
    const div = document.createElement("div");
    div.classList.add("block-item");

    // текст
    const span = document.createElement("span");
    span.textContent = block.title;

    // кнопка удаления
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // чтобы не открывался блок
        blocks.splice(index, 1);

        if (activeBlock === index) {
            activeBlock = null;
        }

        saveAndRender();
    });

    div.appendChild(span);
    div.appendChild(deleteBtn);

    if (activeBlock === index) {
        div.classList.add("active");
    }

    div.addEventListener("click", () => {
        activeBlock = index;
        renderBlocks();
        renderTasks();
    });

    blocksContainer.appendChild(div);
});
}

// Рендер задач
function renderTasks() {
    taskList.innerHTML = "";

    if (activeBlock === null) {
        blockTitle.textContent = "Выберите блок";
        return;
    }

    blockTitle.textContent = blocks[activeBlock].title;

    blocks[activeBlock].tasks.forEach((task, i) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.done) li.classList.add("done");

        li.addEventListener("click", () => {
            task.done = !task.done;
            saveAndRender();
        });

        const del = document.createElement("button");
        del.textContent = "❌";

        del.addEventListener("click", (e) => {
            e.stopPropagation();
            blocks[activeBlock].tasks.splice(i, 1);
            saveAndRender();
        });

        li.appendChild(del);
        taskList.appendChild(li);
    });
}

// Добавить блок
addBlockBtn.addEventListener("click", () => {
    if (blockInput.value === "") return;

    blocks.push({
        title: blockInput.value,
        tasks: []
    });

    blockInput.value = "";
    saveAndRender();
});

// Добавить задачу
addTaskBtn.addEventListener("click", () => {
    if (activeBlock === null) return;
    if (taskInput.value === "") return;

    blocks[activeBlock].tasks.push({
        text: taskInput.value,
        done: false
    });

    taskInput.value = "";
    saveAndRender();
});

// Сохранение
function saveAndRender() {
    localStorage.setItem("blocks", JSON.stringify(blocks));
    renderBlocks();
    renderTasks();
}

renderBlocks();
renderTasks();