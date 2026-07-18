import { load, save } from "./storage.js";

function toKey(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

const todayKey = toKey(new Date());

let todos = load().map(t => t.date ? t : { ...t, date: todayKey });
let currentFilter = "all";
let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
let selectedDate = todayKey;
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();
let editingId = null;
let pulseId = null;
let feedbackTiers = null;

const FALLBACK_FEEDBACK = "오늘도 할 일을 하나씩 해나가 봐요!";

const REMOVE_ANIM_MS = 250;

const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const emptyMsg = document.getElementById("emptyMsg");
const emptyText = document.getElementById("emptyText");
const summaryText = document.getElementById("summaryText");
const feedbackMsg = document.getElementById("feedbackMsg");
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
        if (!todo) return;
        todo.done = e.target.checked;
        pulseId = id;
        save(todos);
        render();
    } else if (e.target.matches(".todo-delete")) {
        removeTodos(li, [id]);
    } else if (e.target.matches(".todo-edit")) {
        editingId = id;
        renderList();
    } else if (e.target.matches(".todo-save")) {
        saveEdit(li, id);
    } else if (e.target.matches(".todo-cancel")) {
        editingId = null;
        renderList();
    }
});

list.addEventListener("keydown", (e) => {
    if (!e.target.matches(".todo-edit-input")) return;
    const li = e.target.closest("li");
    const id = Number(li.dataset.id);

    if (e.key === "Enter") {
        e.preventDefault();
        saveEdit(li, id);
    } else if (e.key === "Escape") {
        editingId = null;
        renderList();
    }
});

function saveEdit(li, id) {
    const text = li.querySelector(".todo-edit-input").value.trim();
    if (text === "") return;
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    todo.text = text;
    editingId = null;
    save(todos);
    render();
}

function removeTodos(li, ids) {
    li.classList.add("removing");
    setTimeout(() => {
        todos = todos.filter(t => !ids.includes(t.id));
        save(todos);
        render();
    }, REMOVE_ANIM_MS);
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        editingId = null;
        filterButtons.forEach(b => b.classList.toggle("active", b === btn));
        render();
    });
});

calGrid.addEventListener("click", (e) => {
    const day = e.target.closest(".day");
    if (!day) return;
    selectedDate = day.dataset.date;
    editingId = null;
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
        const dateObj = new Date(viewYear, viewMonth, d);
        const key = toKey(dateObj);
        const weekday = dateObj.getDay();
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "day";
        btn.dataset.date = key;
        if (key === todayKey) btn.classList.add("today");
        if (key === selectedDate) btn.classList.add("selected");
        if (weekday === 0) btn.classList.add("sunday");
        if (weekday === 6) btn.classList.add("saturday");
        btn.innerHTML = `<span>${d}</span>` +
            (counts[key] ? `<span class="day-count">${counts[key]}</span>` : "");
        calGrid.appendChild(btn);
    }
}

const EMPTY_MESSAGES = {
    all: "오늘 등록된 할 일이 없어요.",
    active: "진행 중인 할 일이 없어요.",
    done: "아직 완료한 항목이 없어요.",
};

function renderList() {
    list.innerHTML = "";

    const dayTodos = todos.filter(t => t.date === selectedDate);
    const activeCount = dayTodos.filter(t => !t.done).length;
    const doneCount = dayTodos.filter(t => t.done).length;
    const counts = { all: dayTodos.length, active: activeCount, done: doneCount };

    document.querySelectorAll(".filter-count").forEach(el => {
        el.textContent = counts[el.dataset.countFor];
    });

    const visible = dayTodos.filter(t => {
        if (currentFilter === "active") return !t.done;
        if (currentFilter === "done") return t.done;
        return true;
    });

    visible.forEach(todo => {
        const li = document.createElement("li");
        li.className = "todo-item" + (todo.done ? " done" : "");
        li.dataset.id = todo.id;

        if (todo.id === editingId) {
            li.classList.add("editing");
            li.innerHTML = `
                <input type="text" class="todo-edit-input" />
                <div class="todo-actions">
                    <button type="button" class="todo-save">저장</button>
                    <button type="button" class="todo-cancel">취소</button>
                </div>
            `;
            const editInput = li.querySelector(".todo-edit-input");
            editInput.value = todo.text;
            list.appendChild(li);
            editInput.focus();
            editInput.select();
        } else {
            li.innerHTML = `
                <label class="todo-label">
                    <input type="checkbox" class="todo-check" ${todo.done ? "checked" : ""} />
                    <span class="todo-text"></span>
                </label>
                <div class="todo-actions">
                    <button type="button" class="todo-edit" aria-label="수정">✎</button>
                    <button type="button" class="todo-delete" aria-label="삭제">✕</button>
                </div>
            `;
            li.querySelector(".todo-text").textContent = todo.text;
            list.appendChild(li);
        }
    });

    if (pulseId !== null) {
        const target = list.querySelector(`[data-id="${pulseId}"]`);
        pulseId = null;
        if (target) {
            requestAnimationFrame(() => target.classList.add("pulse"));
        }
    }

    emptyMsg.hidden = visible.length !== 0;
    emptyText.textContent = EMPTY_MESSAGES[currentFilter] || EMPTY_MESSAGES.all;

    const [, m, d] = selectedDate.split("-");
    dateTitle.textContent = `${Number(m)}월 ${Number(d)}일의 할 일`;

    summaryText.textContent = `전체 ${dayTodos.length}개 · 완료 ${doneCount}개`;
    feedbackMsg.textContent = pickFeedbackMessage(dayTodos.length, doneCount);
}

function pickFeedbackMessage(total, done) {
    if (total === 0) return "오늘은 아직 등록된 할 일이 없어요.";
    if (!feedbackTiers) return FALLBACK_FEEDBACK;

    const percent = Math.round((done / total) * 100);
    const tier = feedbackTiers.find(t => percent >= t.min && percent <= t.max);
    return tier ? tier.message : FALLBACK_FEEDBACK;
}

function render() {
    renderCalendar();
    renderList();
}

async function loadFeedback() {
    try {
        const res = await fetch("../../../../js/todo/feedback.json");
        if (!res.ok) throw new Error("응답 오류");
        feedbackTiers = await res.json();
    } catch {
        feedbackTiers = null;
    }
    renderList();
}

render();
loadFeedback();
