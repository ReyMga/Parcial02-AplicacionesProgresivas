const API_URL = "https://6733e8a8a042ab85d1185748.mockapi.io/tareas"; 

// Obtener y mostrar las tareas
async function getTasks() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',  // Asegúrate de que la respuesta sea en JSON
            },
        });
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            console.error("Error en la respuesta de la API:", response.statusText);
        }
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
function createTask() {
    const taskTitle = document.getElementById("task-title").value;
    const taskDetail = document.getElementById("task-detail").value;

    if (taskTitle && taskDetail) {
        const newTask = {
            title: taskTitle,
            detail: taskDetail,
        };

        // Enviar la nueva tarea a MockAPI
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        })
        .then(response => response.json())
        .then(data => {
            closeCreateTaskForm(); 
            console.log('Tarea creada:', data); 
            Swal.fire({
                icon: 'success',
                title: 'Tarea creada',
                text: '¡La tarea se ha añadido correctamente!',
                confirmButtonColor: '#3085d6',
            })
        })
        .catch(error => {
            console.error("Error al crear la tarea:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar la tarea.',
                confirmButtonColor: '#d33',
            });
        });

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Campos vacíos',
            text: 'Por favor, completa todos los campos antes de guardar la tarea.',
            confirmButtonColor: '#d33',
        });
    }
}



// Función para abrir el modal de Crear Tarea
function showCreateTaskForm() {
    const modal = document.getElementById("create-task-modal");
    modal.showModal();  // Abre el modal
    document.getElementById("task-title").focus(); // Establece el foco en el campo de título
}

// Función para cerrar el modal de Crear Tarea
function closeCreateTaskForm() {
    const modal = document.getElementById("create-task-modal");
    modal.close();  // Cierra el modal
    document.getElementById("menu-button").focus(); // Vuelve el foco al botón de menú
}

// Función para eliminar una tarea
function deleteTask(taskId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Lógica para eliminar la tarea
            
            Swal.fire(
                'Borrado',
                'La tarea ha sido eliminada.',
                'success'
            );
        }
    });
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
