const taskInput = document.querySelector("#task-input");
const addtaskbtn = document.querySelector("#add-task-button");
const taskList = document.querySelector("#task-list");
let tasks = [];
let currentFilter = 'all';
let pendingTaskText = "";

// 1. Add Task Button logic
function addTask() {
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("First Write Something");
        return;
    }
    pendingTaskText = taskValue;
    document.getElementById("priority-modal").style.display = "flex";
}

// 2. Priority buttons trigger
document.querySelectorAll(".p-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const selectedPriority = btn.getAttribute("data-p");
        finalizeTask(selectedPriority);
    });
});

// 3. Save Task to Server
function finalizeTask(priority) {
    const taskData = {
        title: pendingTaskText,
        priority: priority
    };
    fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    })
        .then(res => res.json())
        .then(data => {
            console.log("Server ka answer:", data);
            loadTasksFromServer();
            document.getElementById("priority-modal").style.display = "none";
            taskInput.value = "";
            pendingTaskText = "";
        })
        .catch(err => console.log(err));
}

// 4. Render UI
function renderTask() {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') {
            return true;
        }
        if (currentFilter === 'completed-list') {
            return task.completed;
        }
        return task.priority === currentFilter;
    });
    filteredTasks.forEach((task) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        if (task.priority) {
            taskCard.classList.add(task.priority);
        }
        if (task.completed) {
            taskCard.classList.add("completed");
        }
        taskCard.innerHTML = `<input type="checkbox" class="task-check" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
<span class="task-title"> ${task.title}</span>
<i class="fa-solid fa-trash delete-icon" data-id="${task.id}"></i>
`;
        taskList.appendChild(taskCard);
    });

    // Count aur Progress Bar
    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;

    const totalElements = document.getElementById("total-count");
    const completedElements = document.getElementById("completed-count");

    if (totalElements && completedElements) {
        totalElements.innerText = totalCount;
        completedElements.innerText = completedCount;
    }
    updateProgressBar(completedCount, totalCount);
}

// 5. Progress Bar Logic
function updateProgressBar(completed, total) {
    const progressBar = document.getElementById("progress-fill");
    if (!progressBar) {
        return;
    }
    if (total === 0) {
        progressBar.style.width = "0%";
        return;
    }
    const percentage = Math.round((completed / total) * 100);
    progressBar.style.width = percentage + "%";
}

// 6. Handle Clicks inside Task List (Trash & Checkbox both)
taskList.addEventListener("click", (e) => {
    // TRASH ICON CLICK
    if (e.target.classList.contains("delete-icon")) {
        const id = Number(e.target.getAttribute("data-id"));
        fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
                loadTasksFromServer(); // Delete hone ke baad server se list refresh karo
            })
            .catch(err => console.log(err));
    }

    // CHECKBOX CLICK
    if (e.target.classList.contains("task-check")) {
        const idToToggle = Number(e.target.getAttribute("data-id"));
        toggleTask(idToToggle);
    }
});

// 7. Input Events
addtaskbtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// 8. Toggle Task Completion Status
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTask();
}

// 9. Filter Buttons Logic
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        document.querySelectorAll(".filter-btn").forEach(li => li.classList.remove("active"));
        button.classList.add("active");
        currentFilter = category;
        renderTask();
    });
});

// 10. Fetch Data From Server
function loadTasksFromServer() {
    fetch('http://localhost:3000/api/tasks')
        .then(res => res.json())
        .then(data => {
            console.log("server sy aya hua data", data);
            tasks = data;
            renderTask();
        })
        .catch(error => console.log(error));
}

// 11. Initial Onload Trigger
window.onload = loadTasksFromServer;