const CACHE_KEY = 'hallCache';
const ALARM_NAME = 'refreshHalls';

const refreshHalls = async () => {
    const { apiUrl = '', apiKey = '' } = await chrome.storage.sync.get(['apiUrl', 'apiKey']);
    if (!apiUrl || !apiKey) {
        return { ok: false, error: 'API URL과 키를 먼저 설정하세요.' };
    }

    try {
        const res = await fetch(`${apiUrl}/api/hall_autocomplete.php`, {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!res.ok) {
            return { ok: false, error: `HTTP ${res.status}` };
        }
        const data = await res.json();
        if (!Array.isArray(data.halls)) {
            return { ok: false, error: '응답 형식이 올바르지 않습니다.' };
        }
        await chrome.storage.local.set({
            [CACHE_KEY]: { halls: data.halls, fetchedAt: Date.now() },
        });
        return { ok: true, count: data.halls.length };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: 60 * 24 });
    refreshHalls();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        refreshHalls();
    }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === 'refreshHalls') {
        refreshHalls().then(sendResponse);
        return true; // 비동기 응답
    }
    return false;
});
