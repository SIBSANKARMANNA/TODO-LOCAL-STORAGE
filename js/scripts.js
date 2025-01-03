// Select elements
const taskInput = document.getElementById('task-input');
const startDateInput = document.getElementById('start-date');
const completionDateInput = document.getElementById('completion-date');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const complete_taskBtn=document.getElementById('complete-task-btn');
const all_task_Btn=document.getElementById('all-task-btn');

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add a task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const startDate = startDateInput.value;
    const completionDate = completionDateInput.value;

    if (taskText && startDate && completionDate) {
        const task = {
            text: taskText,
            startDate: startDate,
            completionDate: completionDate,
            completed: false
        }; // Create a task object

        addTaskToDOM(task); // Add task to the DOM
        saveTaskToLocalStorage(task); // Save task to local storage

        // Clear input fields
        taskInput.value = '';
        startDateInput.value = '';
        completionDateInput.value = '';
    } else {
        alert('Please fill in all fields (task, start date, and completion date).');
    }
});

// Add task to DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <span class="${task.completed ? 'completed' : ' '}">${task.text}</span>
            <small>Start: ${task.startDate} | Complete: ${task.completionDate}</small>
        </div>
        <div>
            <button class="task-btn complete">${task.completed ? 'Complete' : 'Not Complete'}</button>
            <button class="task-btn delete">Delete</button>
            <button class="task-btn edit">Edit</button>
        </div>
    `;

    // Handle task actions
    li.querySelector('.complete').addEventListener('click', () => toggleTaskCompletion(task.text, li));
    li.querySelector('.delete').addEventListener('click', () => deleteTask(task.text, li));
    li.querySelector('.edit').addEventListener('click',()=> editTask(task.text,li));


    taskList.appendChild(li);
}

// Toggle task completion
function toggleTaskCompletion(taskText, li) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(t => t.text === taskText);

    if (task) {
        task.completed = !task.completed; // Toggle completed status
        li.querySelector('span').classList.toggle('completed'); // Update DOM
        li.querySelector('.complete').textContent = task.completed ? 'Complete' : 'Not Complete'; // Update button text
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save changes
    }
}

// Delete a task
function deleteTask(taskText, li) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== taskText); // Remove task
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save changes
    taskList.removeChild(li); // Remove from DOM
}

function editTask(taskText, li) {
    // Retrieve tasks from local storage
    let tasks = getTasksFromLocalStorage();

    // Find the task to be edited
    const taskIndex = tasks.findIndex(task => task.text === taskText);

    if (taskIndex !== -1) {
        // Create a form-like prompt to update task and completion date
        const newTaskText = prompt("Edit your task:", tasks[taskIndex].text);

        if (newTaskText) {
            // Ask for a new completion date using a date picker
            const newCompletionDate = prompt("Enter a new completion date (YYYY-MM-DD):", tasks[taskIndex].completionDate);
            
            // Validate the entered date
            if (newCompletionDate && /^\d{4}-\d{2}-\d{2}$/.test(newCompletionDate)) {
                // Update task text and completion date
                tasks[taskIndex].text = newTaskText;
                tasks[taskIndex].completionDate = newCompletionDate;

                // Save updated tasks to local storage
                localStorage.setItem('tasks', JSON.stringify(tasks));

                // Update the task in the DOM
                li.querySelector('span').textContent = newTaskText;
                li.querySelector('small').textContent = `Start: ${tasks[taskIndex].startDate} | Complete: ${tasks[taskIndex].completionDate}`;

                alert("Task updated successfully!");
            } else {
                alert("Invalid date format. Please try again.");
            }
        }
    } else {
        alert("Task not found!");
    }
}




// Load tasks from local storage
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
}

// Save task to local storage
function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task); // Add new task
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save to local storage
}

// Get tasks from local storage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function comPleteTask(){
    complete_taskBtn.addEventListener("click",()=>{
        const tasks=getTasksFromLocalStorage();
        const complete_tasks=tasks.filter(task=>task.completed==true);
        taskList.innerHTML = "";
        complete_tasks.forEach(task => addTaskToDOM(task));
    });
}
function allTasks(){
    all_task_Btn.addEventListener("click",()=>{
        const tasks=getTasksFromLocalStorage();
        taskList.innerHTML="";
        tasks.forEach(task=>addTaskToDOM(task));
    });
}

comPleteTask();
allTasks();