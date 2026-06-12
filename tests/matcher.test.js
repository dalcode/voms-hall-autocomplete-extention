const test = require('node:test');
const assert = require('node:assert/strict');

const { normalize, match } = require('../extension/matcher.js');

const halls = [
    { name: 'CN 천년웨딩홀 일산점', addr: '경기 고양시 일산동구 중앙로 1080' },
    { name: 'DMC타워웨딩', addr: '서울 마포구 성암로 189' },
    { name: 'HW컨벤션센터', addr: '서울 종로구 자하문로 255' },
];

test('normalize: 공백을 제거하고 소문자로 변환한다', () => {
    assert.equal(normalize('CN 천년웨딩홀 일산점'), 'cn천년웨딩홀일산점');
});

test('normalize: null/undefined는 빈 문자열을 반환한다', () => {
    assert.equal(normalize(null), '');
    assert.equal(normalize(undefined), '');
});

test('match: 부분일치로 검색한다', () => {
    const result = match(halls, '웨딩');
    assert.deepEqual(
        result.map((h) => h.name),
        ['CN 천년웨딩홀 일산점', 'DMC타워웨딩'],
    );
});

test('match: 검색어의 공백·대소문자를 무시한다', () => {
    assert.equal(match(halls, 'cn 천년')[0].name, 'CN 천년웨딩홀 일산점');
    assert.equal(match(halls, 'dmc타워')[0].name, 'DMC타워웨딩');
});

test('match: 빈 검색어는 빈 배열을 반환한다', () => {
    assert.deepEqual(match(halls, ''), []);
    assert.deepEqual(match(halls, '   '), []);
});

test('match: limit 개수만큼만 반환한다', () => {
    const many = Array.from({ length: 15 }, (_, i) => ({ name: `홀${i}`, addr: '' }));
    assert.equal(match(many, '홀', 10).length, 10);
});

test('match: 일치 항목이 없으면 빈 배열', () => {
    assert.deepEqual(match(halls, '존재하지않는홀'), []);
});

test('match: halls가 배열이 아니면 빈 배열', () => {
    assert.deepEqual(match(null, '웨딩'), []);
    assert.deepEqual(match(undefined, '웨딩'), []);
});
