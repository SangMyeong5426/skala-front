const STORAGE_KEY = "skala-todos";

export function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
