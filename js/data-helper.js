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

const calculateTotalSuperchestUnlocked = (totalKeySpentForSuperchest) => {
    const SUPERCHEST_REQUIRED_KEYS = 50000;

    return Math.trunc(totalKeySpentForSuperchest / SUPERCHEST_REQUIRED_KEYS);
};

const calculateKeysForNextSuperchest = (totalKeys) => {
    const SUPERCHEST_REQUIRED_KEYS = 50000;
    const CURRENT_PROGRESS = totalKeys % SUPERCHEST_REQUIRED_KEYS;

    return SUPERCHEST_REQUIRED_KEYS - CURRENT_PROGRESS;
};

const calculateNextSuperchestProgressPercent = (totalKeys) => {
    const SUPERCHEST_REQUIRED_KEYS = 50000;
    const CURRENT_PROGRESS = totalKeys % SUPERCHEST_REQUIRED_KEYS;

    return (CURRENT_PROGRESS / SUPERCHEST_REQUIRED_KEYS) * 100;
};

export {
    toInt, toFloat, thousandSeperator,
    getStrLevel, getStrAmount, getStrDuration,
    calculateTotalSuperchestUnlocked,
    calculateKeysForNextSuperchest,
    calculateNextSuperchestProgressPercent
};