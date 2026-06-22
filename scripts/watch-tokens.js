#!/usr/bin/env node

/**
 * JSON 토큰 파일 감시 스크립트
 * `npm run watch` 로 실행하면 root/foundation/*.json 변경 시
 * 자동으로 sync-tokens.js를 실행합니다.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT       = path.resolve(__dirname, '..');
const FOUNDATION = path.join(ROOT, 'root', 'foundation');

let debounceTimer = null;

function runSync(filename) {
  console.log(`\n[watch] ${filename} 변경 감지 → CSS 재생성 중...`);
  try {
    execSync('node scripts/sync-tokens.js', { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    console.error('[watch] 동기화 실패:', err.message);
  }
}

fs.watch(FOUNDATION, (event, filename) => {
  if (!filename || !filename.endsWith('.json')) return;
  clearTimeout(debounceTimer);
  // 에디터가 짧은 시간에 여러 write 이벤트를 발생시키므로 debounce 처리
  debounceTimer = setTimeout(() => runSync(filename), 150);
});

console.log('');
console.log('👀 토큰 감시 시작');
console.log(`   감시 경로: root/foundation/*.json`);
console.log('   JSON 파일을 저장하면 root/styles/ CSS가 자동 재생성됩니다.');
console.log('   종료: Ctrl+C');
console.log('');
