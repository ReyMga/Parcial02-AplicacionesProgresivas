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

// Mostrar las tareas en el DOM
function displayTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";  // Limpio contenedor antes de agregar las tareas
    
    tasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const taskTitle = document.createElement("div");
        taskTitle.className = "task-title";
        taskTitle.textContent = task.title;

        const taskDate = document.createElement("div");
        taskDate.className = "task-date";
        taskDate.textContent = new Date(task.createdAt).toLocaleString();

        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDate);

        const playButton = document.createElement("button");
        playButton.className = "play-button";
        playButton.innerHTML = "▶️";
        playButton.onclick = () => playTaskDetail(task.detail);

        taskCard.appendChild(taskInfo);
        taskCard.appendChild(playButton);

        taskList.appendChild(taskCard);
    });
}

// Crear nueva tarea
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
        getTasks(); // Actualiza la lista de tareas
    } catch (error) {
        console.error("Error al crear tarea:", error);
    }
}

// Función para abrir el formulario de creación de tarea
function showCreateTaskForm() {
    document.getElementById("create-task-modal").showModal();
}

// Función para cerrar el formulario de creación de tarea
function closeCreateTaskForm() {
    document.getElementById("create-task-modal").close();
}

// Reproducir detalles de la tarea en formato de audio
function playTaskDetail(taskDetail) {
    const utterance = new SpeechSynthesisUtterance(taskDetail);
    const config = JSON.parse(localStorage.getItem("audioConfig")) || { rate: 1, lang: "es-ES" };
    utterance.rate = config.rate;
    utterance.lang = config.lang;
    window.speechSynthesis.speak(utterance);
}

// Cargar las tareas al cargar la página
document.addEventListener("DOMContentLoaded", getTasks);
