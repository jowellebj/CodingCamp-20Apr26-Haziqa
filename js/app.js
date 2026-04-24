// --- DOM Elements ---
const greetingEl = document.getElementById('greeting');
const nameEl = document.getElementById('user-name');
const dateEl = document.getElementById('date-display');
const timerEl = document.getElementById('timer');
const todoList = document.getElementById('todo-list');
const linksContainer = document.getElementById('links-container');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateClock();
    setInterval(updateClock, 1000);
    renderTodos();
    renderLinks();
});

// --- Greeting & Clock ---
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    dateEl.innerText = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    let greet = "Good night";
    if (hours < 12) greet = "Good morning";
    else if (hours < 18) greet = "Good afternoon";
    else greet = "Good evening";
    
    greetingEl.firstChild.textContent = `${greet}, `;
}

// --- Theme & Persistence ---
document.getElementById('theme-toggle').addEventListener('click', () => {
    const newTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
});

nameEl.addEventListener('input', () => localStorage.setItem('username', nameEl.innerText));

function loadSettings() {
    document.body.dataset.theme = localStorage.getItem('theme') || 'light';
    nameEl.innerText = localStorage.getItem('username') || 'User';
}

// --- Pomodoro Timer ---
let timerInterval;
let timeLeft = 1500;

document.getElementById('start-timer').addEventListener('click', () => {
    if (timerInterval) return;
    const customTime = document.getElementById('pomo-duration').value;
    if (timeLeft === 1500 && customTime !== 25) timeLeft = customTime * 60;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time is up!");
        }
    }, 1000);
});

document.getElementById('stop-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = document.getElementById('pomo-duration').value * 60;
    updateTimerDisplay();
});

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
}

// --- To-Do Logic ---
let todos = JSON.parse(localStorage.getItem('todos')) || [];

document.getElementById('add-todo').addEventListener('click', () => {
    const input = document.getElementById('todo-input');
    if (input.value) {
        todos.push({ text: input.value, done: false });
        input.value = '';
        saveAndRenderTodos();
    }
});

function saveAndRenderTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''}`;
        li.innerHTML = `
            <span onclick="toggleTodo(${index})">${todo.text}</span>
            <button onclick="deleteTodo(${index})">×</button>
        `;
        todoList.appendChild(li);
    });
}

window.toggleTodo = (index) => {
    todos[index].done = !todos[index].done;
    saveAndRenderTodos();
};

window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveAndRenderTodos();
};

// --- Quick Links ---
let links = JSON.parse(localStorage.getItem('links')) || [];

document.getElementById('add-link').addEventListener('click', () => {
    const name = document.getElementById('link-name').value;
    const url = document.getElementById('link-url').value;
    if (name && url) {
        links.push({ name, url });
        saveAndRenderLinks();
    }
});

function saveAndRenderLinks() {
    localStorage.setItem('links', JSON.stringify(links));
    renderLinks();
}

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'quick-link';
        a.target = '_blank';
        a.innerText = link.name;
        linksContainer.appendChild(a);
    });
}
