const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let editTodo = null;

// Function to add a new todo
const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (inputText.length === 0) {
        alert("Task cannot be empty!");
        return;
    }

    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    if (todos.some(todo => todo.text === inputText)) {
        alert("Task already exists!");
        return;
    }

    if (addBtn.value === "Edit") {
        editLocalTodos(editTodo.target.parentElement, inputText);
        editTodo.target.parentElement.querySelector("p").innerHTML = inputText;
        addBtn.value = "Add";
        inputBox.value = "";
    } else {
        const li = document.createElement("li");

        // Checkbox for completion
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("taskCheckbox");
        li.appendChild(checkbox);

        // Task description
        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
        inputBox.value = "";

        saveLocalTodos(inputText, false);
    }
};

// Function to update (Edit/Delete/Complete) a todo
const updateTodo = (e) => {
    if (e.target.classList.contains("deleteBtn")) {
        deleteLocalTodos(e.target.parentElement);
        e.target.parentElement.remove();
    }

    if (e.target.classList.contains("editBtn")) {
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
    }

    if (e.target.classList.contains("taskCheckbox")) {
        e.target.nextElementSibling.classList.toggle("completed");
        updateCompletion(e.target.nextElementSibling.innerHTML, e.target.checked);
    }
};

// Save to local storage
const saveLocalTodos = (todo, completed) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push({ text: todo, completed: completed });
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Get todos from local storage
const getLocalTodos = () => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(todo => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("taskCheckbox");
        checkbox.checked = todo.completed;
        li.appendChild(checkbox);

        const p = document.createElement("p");
        p.innerHTML = todo.text;
        if (todo.completed) p.classList.add("completed");
        li.appendChild(p);

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
};

// Function to update an existing task in local storage ✅ **(Fixed)**
const editLocalTodos = (todoElement, newText) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    let oldText = todoElement.querySelector("p").innerHTML;
    let todoIndex = todos.findIndex(todo => todo.text === oldText);

    if (todoIndex !== -1) {
        todos[todoIndex].text = newText; // Update the task text
        localStorage.setItem("todos", JSON.stringify(todos));
    }
};

// Update completion status
const updateCompletion = (todoText, completed) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    todos.find(todo => todo.text === todoText).completed = completed;
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Delete todo from local storage
const deleteLocalTodos = (todo) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    todos = todos.filter(t => t.text !== todo.children[1].innerHTML);
    localStorage.setItem("todos", JSON.stringify(todos));
};

document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', updateTodo);
