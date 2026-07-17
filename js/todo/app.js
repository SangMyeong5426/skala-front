import { load, save } from "./storage.js";

function toKey(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

const todayKey = toKey(new Date());

let holidays = {};
let todos = load().map(t => t.date ? t : { ...t, date: todayKey });
let currentFilter = "all";
let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
let selectedDate = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();

const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const emptyMsg = document.getElementById("emptyMsg");
const summary = document.getElementById("summary");
const filterButtons = document.querySelectorAll(".filter-btn");
const calTitle = document.getElementById("calTitle");
const calGrid = document.getElementById("calGrid");
const dateTitle = document.getElementById("dateTitle");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") return;

    todos.push({ id: nextId++, text, done: false, date: selectedDate });
    input.value = "";
    save(todos);
    render();
});

list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.matches(".todo-check")) {
        const todo = todos.find(t => t.id === id);
        todo.done = e.target.checked;
    } else if (e.target.matches(".todo-delete")) {
        todos = todos.filter(t => t.id !== id);
    } else {
        return;
    }

    save(todos);
    render();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        filterButtons.forEach(b => b.classList.toggle("active", b === btn));
        render();
    });
});

calGrid.addEventListener("click", (e) => {
    const day = e.target.closest(".day");
    if (!day) return;
    selectedDate = day.dataset.date;
    render();
});

prevMonthBtn.addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
    }
    renderCalendar();
});

function renderCalendar() {
    calTitle.textContent = `${viewYear}년 ${viewMonth + 1}월`;
    calGrid.innerHTML = "";

    const counts = {};
    todos.forEach(t => {
        counts[t.date] = (counts[t.date] || 0) + 1;
    });

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calGrid.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= lastDate; d++) {
        const key = toKey(new Date(viewYear, viewMonth, d));
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "day";
        btn.dataset.date = key;
        if (key === todayKey) btn.classList.add("today");
        if (key === selectedDate) btn.classList.add("selected");
        if (holidays[key]) btn.classList.add("holiday");
        btn.innerHTML = `<span>${d}</span>` +
            (counts[key] ? `<span class="day-count">${counts[key]}</span>` : "");
        calGrid.appendChild(btn);
    }
}

function renderList() {
    list.innerHTML = "";

    const dayTodos = todos.filter(t => t.date === selectedDate);
    const visible = dayTodos.filter(t => {
        if (currentFilter === "active") return !t.done;
        if (currentFilter === "done") return t.done;
        return true;
    });

    visible.forEach(todo => {
        const li = document.createElement("li");
        li.className = "todo-item" + (todo.done ? " done" : "");
        li.dataset.id = todo.id;
        li.innerHTML = `
            <input type="checkbox" class="todo-check" ${todo.done ? "checked" : ""} />
            <span class="todo-text"></span>
            <button type="button" class="todo-delete" aria-label="삭제">✕</button>
        `;
        li.querySelector(".todo-text").textContent = todo.text;
        list.appendChild(li);
    });

    emptyMsg.hidden = visible.length !== 0;

    const [, m, d] = selectedDate.split("-");
    dateTitle.textContent = `${Number(m)}월 ${Number(d)}일의 할 일`;
    if (holidays[selectedDate]) {
        const badge = document.createElement("span");
        badge.className = "holiday-name";
        badge.textContent = holidays[selectedDate];
        dateTitle.appendChild(badge);
    }

    const doneCount = dayTodos.filter(t => t.done).length;
    summary.textContent = `전체 ${dayTodos.length}개 · 완료 ${doneCount}개`;
}

function render() {
    renderCalendar();
    renderList();
}

async function loadHolidays() {
    try {
        const res = await fetch("../../js/todo/holidays.json");
        if (!res.ok) throw new Error("응답 오류");
        holidays = await res.json();
    } catch {
        holidays = {};
    }
    render();
}

render();
loadHolidays();
