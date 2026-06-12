const HallMatcher = (() => {
    const normalize = (str) => String(str ?? '').toLowerCase().replace(/\s+/g, '');

    const match = (halls, query, limit = 10) => {
        if (!Array.isArray(halls)) {
            return [];
        }
        const q = normalize(query);
        if (!q) {
            return [];
        }
        return halls
            .filter((hall) => normalize(hall.name).includes(q))
            .slice(0, limit);
    };

    return { normalize, match };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HallMatcher;
}
