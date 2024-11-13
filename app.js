const API_URL = "https://6733e8a8a042ab85d1185748.mockapi.io/tareas"; 
// Obtener y mostrar las tareas


async function getTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

// Función para mostrar las tareas en el DOM
function displayTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";  // Limpiar el contenedor antes de agregar las tareas
    
    tasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.detail}</p>
            </div>
            <button onclick="playTaskDetail('${task.detail}')">▶️</button>
        `;
        taskList.appendChild(taskCard);
    });
}

// Crear una nueva tarea
async function createTask() {
    const title = document.getElementById("task-title").value;
    const detail = document.getElementById("task-detail").value;
    const newTask = { title, detail, status: "pendiente", createdAt: new Date().toISOString() };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
        closeCreateTaskForm();
        getTasks();
    } catch (error) {
        console.error("Error al crear tarea:", error);
    }
}

// Función para abrir el modal de Crear Tarea
function showCreateTaskForm() {
    document.getElementById("create-task-modal").showModal();
}

// Función para cerrar el modal de Crear Tarea
function closeCreateTaskForm() {
    document.getElementById("create-task-modal").close();
}

// Función para abrir/cerrar el menú
function toggleMenu() {
    const menuModal = document.getElementById("menu-modal");
    if (menuModal.open) {
        menuModal.close();
    } else {
        menuModal.showModal();
    }
}

// Función para reproducir detalles de la tarea
function playTaskDetail(taskDetail) {
    const utterance = new SpeechSynthesisUtterance(taskDetail);
    const config = JSON.parse(localStorage.getItem("audioConfig")) || { rate: 1, lang: "es-ES" };
    utterance.rate = config.rate;
    utterance.lang = config.lang;
    window.speechSynthesis.speak(utterance);
}

// Cargar las tareas al cargar la página
document.addEventListener("DOMContentLoaded", getTasks);
