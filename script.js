// API base URL
const API = "http://localhost:5000/api/tasks";

const inputBarBox = document.getElementById("Input_Bar_Box");
const TasksContainer = document.getElementById("Tasks_Container");

// Fetch all tasks on load
async function showTask() {
    const res = await fetch(API);
    const tasks = await res.json(); 
    TasksContainer.innerHTML = ""; // clear existing

    tasks.forEach(task => addTaskToUI(task));  
    updateProgress();
}

// Add task to UI
function addTaskToUI(task) {
    let TaskData = document.createElement("li");
    TaskData.innerHTML = task.title;
    TaskData.dataset.id = task.id;

    if (task.completed) TaskData.classList.add("checked");

    let Span = document.createElement("SPAN");
    Span.innerHTML = "\u00D7";

    Span.onclick = async function () {
        await deleteTask(task.id);
        TaskData.remove();
        updateProgress();
    };

    TaskData.appendChild(Span);
    TasksContainer.appendChild(TaskData);
}

// Create task on backend
async function addTask() {
    if (inputBarBox.value === "") {
        alert("You need to write Something to Add Task.");
        return;
    }

    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: inputBarBox.value })
    });

    const newTask = await res.json();
    addTaskToUI(newTask);
    inputBarBox.value = "";
    updateProgress();
}

// Handle toggle + delete clicks
TasksContainer.addEventListener("click", async function (e) {
    if (e.target.tagName === "LI") {
        const li = e.target;
        const id = li.dataset.id;
        const completed = !li.classList.contains("checked");

        await updateTask(id, { completed });
        li.classList.toggle("checked");
        updateProgress();
    }
}, false);

// Update task on backend
async function updateTask(id, patch) {
    await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
    });
}

// Delete task on backend
async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
}

// Update progress bar
function updateProgress() {
    const work_to_be_Done = TasksContainer.querySelectorAll("li");
    const work_Completed = TasksContainer.querySelectorAll(".checked");
    const current_Situation = document.getElementById("Progress_Data");
    const Number_of_Tasks = document.getElementById("Number_of_Tasks");

    const work_Done_Percentage =
        (work_Completed.length / work_to_be_Done.length) * 100 || 0;

    current_Situation.style.width = `${work_Done_Percentage}%`;
    Number_of_Tasks.textContent = `${work_Completed.length} / ${work_to_be_Done.length}`;
}

// Load tasks on startup
showTask();


// const inputBarBox = document.getElementById("Input_Bar_Box");
// const TasksContainer = document.getElementById("Tasks_Container");
// function addTask() 
// {
//     if (inputBarBox.value === '')
//         alert("You need to write Something to Add Task.");
//     else 
//     {
//         let TaskData = document.createElement("li");
//         TaskData.innerHTML = inputBarBox.value;
//         TasksContainer.appendChild(TaskData);
//         let Span = document.createElement("SPAN");
//         Span.innerHTML = "\u00D7"; 
//         Span.onclick = function () 
//         {
//             TaskData.remove();
//             saveData();
//             updateProgress();
//         };
//         TaskData.appendChild(Span);
//         saveData();
//         updateProgress();
//     }
//     inputBarBox.value = "";
// }
// TasksContainer.addEventListener("click", function(e) 
// {
//     if(e.target.tagName === "LI") 
//     {
//         e.target.classList.toggle("checked");
//         saveData();
//         updateProgress();
//     }
//     else if(e.target.tagName === "SPAN")
//     {
//         e.target.parentElement.remove();
//         saveData();
//         updateProgress();
//     }
// }, false);

// function saveData()
// {
//     localStorage.setItem("data", TasksContainer.innerHTML);
// }
// function showTask() 
// {
//     TasksContainer.innerHTML = localStorage.getItem("data") || "";
//     updateProgress();
// }

// function updateProgress() 
// {
//     const work_to_be_Done = TasksContainer.querySelectorAll("li");
//     const work_Completed = TasksContainer.querySelectorAll(".checked");
//     const current_Situation = document.getElementById("Progress_Data");
//     const Number_of_Tasks = document.getElementById("Number_of_Tasks");
//     const work_Done_Percentage = (work_Completed.length / work_to_be_Done.length) * 100 || 0;
//     current_Situation.style.width = `${work_Done_Percentage}%`;
//     Number_of_Tasks.textContent = `${work_Completed.length} / ${work_to_be_Done.length}`;
// }
// showTask();