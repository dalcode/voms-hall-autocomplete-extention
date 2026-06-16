# VOMS 웨딩홀 자동완성

웨딩잇 CRM(`bliuscompany.weddingit.co.kr`) 고객등록 폼의 **본식 장소** 입력란에, VOMS에 등록된 웨딩홀 목록을 자동완성으로 제공하는 Chrome 확장프로그램입니다.

[Chrome 웹스토어에서 설치](https://chromewebstore.google.com/detail/cpnjnddllghgohgjkkaldaglpgbjpokj)

## 왜 필요한가

VOMS DB에는 웨딩홀 마스터 목록(`voms_hall`)이 이미 관리되고 있는데, CRM 고객등록 화면에서는 매번 홀 이름을 손으로 입력해야 했습니다. 같은 홀이라도 입력하는 사람마다 표기가 달라지는 문제도 있었고요. 이 확장프로그램은 VOMS 목록을 그대로 자동완성 후보로 가져와 입력 속도와 표기 일관성을 둘 다 해결합니다.

## 동작 방식

```
[VOMS 서버]                         [Chrome 확장 (Manifest V3)]
public/api/hall_autocomplete.php    background.js (service worker)
(API 키 인증, JSON 응답)        ◄──    │ 설치 시 + 24시간마다 + 수동 갱신
                                       ▼
                                  chrome.storage.local (웨딩홀 목록 캐시)
                                       ▼
                                  content.js — #wm_wed_place 입력에
                                  커스텀 드롭다운 부착
```

1. 옵션 페이지에 VOMS API 주소와 API 키를 등록하면, service worker가 주기적으로(또는 수동으로) 목록을 받아와 로컬에 캐시합니다.
2. 고객등록 폼의 "본식 장소" 칸에 입력하면, 캐시에서 부분일치 검색해 최대 10개를 드롭다운으로 보여줍니다.
3. 키보드(`↑` `↓` `Enter` `Esc`), 마우스, 한글 IME 조합 입력 모두 지원합니다.

캐시 기반으로 동작하므로 네트워크 장애 시에도 직전에 받아온 목록으로 계속 자동완성이 동작하고, 캐시가 비어 있으면 조용히 비활성화되어 원래의 폼 입력을 방해하지 않습니다.

## 설치

### 웹스토어 (권장)

위 링크에서 설치하면 끝입니다. 별도 설정 화면에서 API 주소·키만 입력하면 됩니다.

### 개발자 모드 (소스에서 직접)

1. `chrome://extensions` 접속 → 우상단 **개발자 모드** 켜기
2. **압축해제된 확장 프로그램을 로드합니다** → 이 저장소의 `extension/` 폴더 선택

## 설정

1. 확장 아이콘 우클릭 → **옵션** (또는 `chrome://extensions` → 확장 카드 → 확장 프로그램 옵션)
2. **VOMS API URL**과 **API 키**(`HALL_API_KEY`)를 입력하고 저장
3. **목록 갱신** 클릭 → "웨딩홀 N개 (마지막 갱신: ...)"이 표시되면 정상

이후로는 24시간마다 자동으로 갱신되며, 필요할 때 옵션 페이지에서 수동으로 갱신할 수도 있습니다.

## 프로젝트 구조

```
extension/
  manifest.json    MV3 매니페스트
  matcher.js       부분일치 검색 로직 (공백·대소문자 무시)
  background.js    service worker — API fetch, 캐시, 24시간 알람
  content.js       자동완성 드롭다운 UI
  content.css      드롭다운 스타일
  options.html/js  설정 화면 (API 주소·키, 수동 갱신)
tests/
  matcher.test.js  matcher.js 단위 테스트 (node:test)
docs/
  privacy-policy.html              개인정보처리방침 (웹스토어 등록용)
  superpowers/specs, plans/        설계 문서·구현 계획
```

서버 측 API(`public/api/hall_autocomplete.php`, Bearer 키 인증)는 VOMS 본체 저장소에 있으며 이 저장소에는 포함되지 않습니다.

## 개발

```bash
node --test tests/matcher.test.js
```

기여 시 매칭 로직 변경은 `extension/matcher.js` + `tests/matcher.test.js`만으로 독립적으로 테스트할 수 있습니다. `content.js`는 실제 폼 페이지가 있어야 동작을 확인할 수 있어 별도 자동테스트는 없습니다.

## 개인정보처리방침

[privacy-policy.html](docs/privacy-policy.html) — 확장프로그램이 저장하는 정보(웨딩홀 캐시, API 설정)와 수집하지 않는 정보를 안내합니다.
