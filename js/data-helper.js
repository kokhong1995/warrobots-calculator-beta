const toInt = (value) => {
    return parseInt(value) || 0;
};

const toFloat = (value) => {
    return parseFloat(value) || 0;
};

const thousandSeperator = (value, seperator) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
};

const getStrLevel = (mark, level) => {
    return 'MK' + mark + (level === 0 ? '' : (': Level ' + level));
};

const getStrAmount = (amount) => {
    if (amount >= 1000000) {
        return (amount / 1000000) + 'M';
    }
    else if (amount >= 100000) {
        return (amount / 1000) + 'K';
    }
    else {
        return amount;
    }
};

const getStrDuration = (seconds) => {
    // Return empty string if input is invalid, non-numeric, negative, or not finite
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds <= 0 || !isFinite(seconds)) {
        return '0';
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [];

    if (days > 0) {
        parts.push(days + 'd');
    }
    if (hours > 0) {
        parts.push(hours + 'h');
    }
    if (minutes > 0) {
        parts.push(minutes + 'm');
    }
    if (secs > 0) {
        parts.push(secs + 's');
    }

    return parts.join(' ') || 0;
};

const calculateTotalSuperchestUnlocked = (superchestRequiredKeys, totalKeySpentForSuperchest) => {
    return Math.trunc(totalKeySpentForSuperchest / superchestRequiredKeys);
};

const calculateKeysForNextSuperchest = (superchestRequiredKeys, totalKeys) => {
    const CURRENT_PROGRESS = totalKeys % superchestRequiredKeys;

    return superchestRequiredKeys - CURRENT_PROGRESS;
};

const calculateNextSuperchestProgressPercent = (superchestRequiredKeys, totalKeys) => {
    const CURRENT_PROGRESS = totalKeys % superchestRequiredKeys;

    return (CURRENT_PROGRESS / superchestRequiredKeys) * 100;
};

const getPilotRankByLevel = (level) => {
    if (level < 1 || level > 100) {
        return '';
    }

    if (level < 11) {
        return 'Private';
    }
    else if (level < 21) {
        return 'Corporal';
    }
    else if (level < 31) {
        return 'Sergeant';
    }
    else if (level < 41) {
        return 'Lieutenant';
    }
    else if (level < 51) {
        return 'Captain';
    }
    else if (level < 61) {
        return 'Major';
    }
    else if (level < 71) {
        return 'Colonel';
    }
    else if (level < 81) {
        return 'Brigadier';
    }
    else if (level < 91) {
        return 'General';
    }
    else {
        return 'Marshal';
    }
};

export {
    toInt, toFloat, thousandSeperator,
    getStrLevel, getStrAmount, getStrDuration,
    calculateTotalSuperchestUnlocked,
    calculateKeysForNextSuperchest,
    calculateNextSuperchestProgressPercent,
    getPilotRankByLevel
};