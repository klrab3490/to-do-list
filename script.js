// Load tasksByDate from localStorage if available
let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {
    "2025-07-28": ["Finish homework", "Buy groceries", "Call John"],
    "2025-07-29": ["Attend meeting", "Go for a run"],
    "2025-07-30": ["Prepare presentation", "Read a book"],
};

// Function to add a new task
function addTask(event) {
    console.log("Button Pressed");
    event.preventDefault();
    const taskDate = document.getElementById("task-date").value;
    const taskText = document.getElementById("task-text").value.trim();
    if (!taskText) return; // Do not add empty tasks

    if (!tasksByDate[taskDate]) {
        tasksByDate[taskDate] = [];
    }

    // Always store as object { text, done }
    tasksByDate[taskDate].push({ text: taskText, done: false });
    saveTasks();
    location.reload();
}

// Save tasksByDate to localStorage
function saveTasks() {
    localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
}

// Utility to delete a task and cleanup empty dates
function deleteTask(date, idx) {
    tasksByDate[date].splice(idx, 1);

    // Remove date if empty
    if (tasksByDate[date].length === 0) {
        delete tasksByDate[date];
    }

    saveTasks();
    location.reload();
}

// Get today's date in YYYY-MM-DD format
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;

// Render tasks for a given date
function renderTasks(date, container) {
    const tasks = tasksByDate[date] || [];
    if (tasks.length === 0 && date === todayStr) {
        const li = document.createElement("li");
        li.textContent = "No tasks for today!";
        container.appendChild(li);
        return;
    }

    tasks.forEach((task, idx) => {
        const li = document.createElement("li");
        li.className = "flex items-center justify-between";
        let taskObj = typeof task === "object" ? task : { text: task, done: false };
        li.innerHTML = `
            <input type="checkbox" class="mr-2" ${taskObj.done ? "checked" : ""}>
            <span style="text-decoration:${taskObj.done ? "line-through" : "none"}">${taskObj.text}</span>
            <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        `;
        const checkbox = li.querySelector("input[type='checkbox']");
        const span = li.querySelector("span");
        const deleteBtn = li.querySelector("button");

        checkbox.addEventListener("change", function () {
            taskObj.done = checkbox.checked;
            span.style.textDecoration = checkbox.checked ? "line-through" : "none";
            tasksByDate[date][idx] = taskObj;
            saveTasks();
        });

        deleteBtn.addEventListener("click", function () {
            deleteTask(date, idx);
        });

        container.appendChild(li);
    });
}

// Render today's tasks
const todayTaskList = document.getElementById("today-task-list");
renderTasks(todayStr, todayTaskList);

// Render other dates' tasks
const otherDatesTasksDiv = document.getElementById("other-dates-tasks");
Object.entries(tasksByDate).forEach(([date, tasks]) => {
    if (date === todayStr) return;

    const dateCard = document.createElement("div");
    dateCard.className = "rounded-xl shadow-lg border border-gray-200 bg-white flex flex-col overflow-hidden transition transform hover:scale-[1.02]";

    // Date header
    const header = document.createElement("div");
    header.className = "bg-blue-600 text-white p-3 font-semibold text-center";
    header.textContent = new Date(date).toDateString(); // e.g. Mon Jul 28 2025
    dateCard.appendChild(header);

    // Task list
    const ul = document.createElement("ul");
    ul.className = "p-4 space-y-3";
    if (tasks.length === 0) {
        const li = document.createElement("li");
        li.className = "text-gray-500 text-center";
        li.textContent = "No tasks for this date.";
        ul.appendChild(li);
    } else {
        renderTasks(date, ul);
    }

    dateCard.appendChild(ul);
    otherDatesTasksDiv.appendChild(dateCard);
});
