// 모듈 분리 실습 : 화면(DOM) 업데이트를 담당하는 파일
import { fetchMessage } from "./data.js";

const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");

console.log("1. 동기 코드: 이 줄은 즉시 실행됩니다.");

async function loadMessage() {
    statusEl.textContent = "메시지를 불러오는 중... (지연 데이터 관찰)";
    console.log("2. 비동기 함수 호출 시작 (아직 결과 없음)");

    const message = await fetchMessage(1500);

    statusEl.textContent = "완료!";
    outputEl.textContent = message;
    console.log("4. 지연 후 도착한 결과:", message);
}

loadMessage();

console.log("3. 동기 코드는 여기까지 먼저 끝나고, 비동기 결과(4번)는 나중에 도착합니다.");
