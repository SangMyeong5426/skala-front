export const messages = [
    "스칼라에서 성장하기",
    "꾸준함을 무기로 성장하기.",
    "복습 괴물로 성장하기."
];

export function fetchMessage(delay = 1500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            resolve(messages[randomIndex]);
        }, delay);
    });
}