// 모듈 분리 실습 : 데이터와 "가짜 서버 응답"을 담당하는 파일
export const messages = [
    "오늘도 좋은 하루 되세요!",
    "꾸준함이 실력을 만듭니다.",
    "작은 실습이 쌓여 큰 실력이 됩니다."
];

// setTimeout 으로 네트워크 지연을 흉내낸 비동기 함수 (Promise 반환)
export function fetchMessage(delay = 1500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            resolve(messages[randomIndex]);
        }, delay);
    });
}

// TODO: delay 기본값(1500)을 바꿔서 지연 시간이 달라지는지 확인해보세요
