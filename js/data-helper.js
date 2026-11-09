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
    else if (level < 11) {
        return '1';
    }
    else if (level < 21) {
        return '2';
    }
    else if (level < 31) {
        return '3';
    }
    else if (level < 41) {
        return '4';
    }
    else if (level < 51) {
        return '5';
    }
    else if (level < 61) {
        return '6';
    }
    else if (level < 71) {
        return '7';
    }
    else if (level < 81) {
        return '8';
    }
    else if (level < 91) {
        return '9';
    }
    else {
        return '10';
    }
};

function getLeaderboardPointByType(type, formattedData) {
    if (Object.hasOwn(formattedData, type)) {
        return formattedData[type];
    }
    else {
        return 0;
    }
}

function getPilotRushPointByData(leaderboardData, data) {
    if (data.level < 1 || data.level > 70) {
        return 0;
    }
    else if (data.level < 11) {
        return getLeaderboardPointByType(leaderboardData.type, {
            upgradeLevel: 65,
            promoteRank: 0
        });
    }
    else if (data.level < 21) {
        return getLeaderboardPointByType(leaderboardData.type, {
            upgradeLevel: 110,
            promoteRank: 1000
        });
    }
    else if (data.level < 31) {
        return getLeaderboardPointByType(leaderboardData.type, {
            upgradeLevel: 180,
            promoteRank: 2500
        });
    }
    else if (data.level < 41) {
        return getLeaderboardPointByType(leaderboardData.type, {
            upgradeLevel: 300,
            promoteRank: 3500
        });
    }
    else if (data.level < 51) {
        return getLeaderboardPointByType(leaderboardData.type, {
            upgradeLevel: 470,
            promoteRank: 5000
        });
    }
    else if (data.level < 61) {
        return getLeaderboardPointByType(leaderboardData.type, {
            upgradeLevel: 700,
            promoteRank: 5000
        });
    }
    else {
        return getLeaderboardPointByType(leaderboardData.type, {
            upgradeLevel: 1000,
            promoteRank: 5000
        });
    }
}

function getFightToTheDeathPointByData(leaderboardData, data) {
    if (data.mark < 1 || data.mark > 3 || data.level < 0 || data.level > 12) {
        return 0;
    }
    // MK1.
    else if (data.mark == 1) {
        switch (data.level) {
            case 2: case 3: case 4:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 25,
                    t4Weapon: 25,
                    t3Robot: 25,
                    t3Weapon: 25
                });
                break;
            case 5: case 6: case 7:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 50,
                    t4Weapon: 50,
                    t3Robot: 50,
                    t3Weapon: 50
                });
                break;
            case 8: case 9:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 90,
                    t4Weapon: 90,
                    t3Robot: 75,
                    t3Weapon: 75
                });
                break;
            case 10: case 11: case 12:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 125,
                    t4Weapon: 125,
                    t3Robot: 100,
                    t3Weapon: 100
                });
                break;
            default:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 0,
                    t4Weapon: 0,
                    t3Robot: 0,
                    t3Weapon: 0
                });
                break;
        }
    }
    // MK2.
    else if (data.mark == 2) {
        switch (data.level) {
            case 0:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 250,
                    t4Weapon: 250,
                    t3Robot: 250,
                    t3Weapon: 250
                });
                break;
            case 2: case 3: case 4:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 125,
                    t4Weapon: 125,
                    t3Robot: 100,
                    t3Weapon: 100
                });
                break;
            case 5: case 6: case 7: case 8:
            case 9: case 10: case 11: case 12:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 150,
                    t4Weapon: 150,
                    t3Robot: 125,
                    t3Weapon: 125
                });
                break;
            default:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Robot: 0,
                    t4Weapon: 0,
                    t3Robot: 0,
                    t3Weapon: 0
                });
                break;
        }
    }
    // MK3.
    else if (data.level == 0) {
        return getLeaderboardPointByType(leaderboardData.type, {
            t4Robot: 1000,
            t4Weapon: 1000,
            t3Robot: 1000,
            t3Weapon: 1000
        });
    }
}

const getLeaderboardPoints = (leaderboardData, data) => {
    if (leaderboardData.name == 'PilotRush') {
        return getPilotRushPointByData(leaderboardData, data);
    }
    else if (leaderboardData.name == 'FightToTheDeath') {
        return getFightToTheDeathPointByData(leaderboardData, data);
    }
    else {
        return 0;
    }
};

export {
    toInt, toFloat, thousandSeperator,
    getStrLevel, getStrAmount, getStrDuration,
    calculateTotalSuperchestUnlocked,
    calculateKeysForNextSuperchest,
    calculateNextSuperchestProgressPercent,
    getPilotRankByLevel, getLeaderboardPoints
};