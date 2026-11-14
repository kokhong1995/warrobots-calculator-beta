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

function getTitanicTrainingPointByData(leaderboardData, data) {
    if (leaderboardData.type.includes('ExperienceBoost')) {
        switch (getPilotRankByLevel(data.level)) {
            case '1': case '2': case '3':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 5
                });
                break;
            case '4': case '5':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 10
                });
                break;
            case '6':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 20
                });
                break;
            case '7':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 40
                });
                break;
            case '8':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 50
                });
                break;
            case '9':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 80
                });
                break;
            case '10':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 110
                });
                break;
            default:
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotExperienceBoost: 0
                });
                break;
        }
    }
    else if (leaderboardData.type.includes('RankPromotion')) {
        switch (getPilotRankByLevel(data.level)) {
            case '2': case '3': case '4': case '5':
            case '6': case '7': case '8': case '9':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotRankPromotion: 200
                });
                break;
            case '10':
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotRankPromotion: 4000
                });
                break;
            default:
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotRankPromotion: 0
                });
                break;
        }
    }
    else if (leaderboardData.type.includes('SkillTierUpgrade')) {
        switch (data.tier) {
            case 2:
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotSkillTierUpgrade: 80
                });
                break;
            case 3:
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotSkillTierUpgrade: 320
                });
                break;
            case 4:
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotSkillTierUpgrade: 800
                });
                break;
            default:
                return getLeaderboardPointByType(leaderboardData.type, {
                    pilotSkillTierUpgrade: 0
                });
                break;
        }
    }

    return 0;
}

function getTitanicEffortsPointByData(leaderboardData, data) {
    // Titan Subsystem (Tier 4, Tier 3, Tier 2).
    if (leaderboardData.type.includes('Subsystem') && data.level >= 2 && data.level <= 50) {
        switch (data.level) {
            case 2: case 3: case 4: case 5: case 6:
            case 7: case 8: case 9: case 10:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Subsystem: 90,
                    t3Subsystem: 80,
                    t2Subsystem: 55
                });
                break;
            case 11: case 12: case 13: case 14: case 15:
            case 16: case 17: case 18: case 19: case 20:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Subsystem: 150,
                    t3Subsystem: 135,
                    t2Subsystem: 90
                });
                break;
            case 21: case 22: case 23: case 24: case 25:
            case 26: case 27: case 28: case 29: case 30:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Subsystem: 210,
                    t3Subsystem: 190,
                    t2Subsystem: 125
                });
                break;
            case 31: case 32: case 33: case 34: case 35:
            case 36: case 37: case 38: case 39: case 40:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Subsystem: 280,
                    t3Subsystem: 245,
                    t2Subsystem: 160
                });
                break;
            case 41: case 42: case 43: case 44: case 45:
            case 46: case 47: case 48: case 49: case 50:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Subsystem: 330,
                    t3Subsystem: 300,
                    t2Subsystem: 200
                });
                break;
            default:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Subsystem: 0,
                    t3Subsystem: 0,
                    t2Subsystem: 0
                });
                break;
        }
    }
    // Titan Weapon (Tier 4, Tier 3, Tier 2).
    else if (leaderboardData.type.includes('Weapon') && data.level >= 2 && data.level <= 25) {
        switch (data.level) {
            case 2: case 3: case 4: case 5:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Weapon: 100,
                    t3Weapon: 75,
                    t2Weapon: 60
                });
                break;
            case 6: case 7: case 8: case 9: case 10:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Weapon: 140,
                    t3Weapon: 105,
                    t2Weapon: 90
                });
                break;
            case 11: case 12: case 13: case 14: case 15:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Weapon: 180,
                    t3Weapon: 135,
                    t2Weapon: 110
                });
                break;
            case 16: case 17: case 18: case 19: case 20:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Weapon: 220,
                    t3Weapon: 165,
                    t2Weapon: 135
                });
                break;
            case 21: case 22: case 23: case 24: case 25:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Weapon: 260,
                    t3Weapon: 195,
                    t2Weapon: 160
                });
                break;
            default:
                return getLeaderboardPointByType(leaderboardData.type, {
                    t4Weapon: 0,
                    t3Weapon: 0,
                    t2Weapon: 0
                });
                break;
        }
    }

    return 0;
}

function getStunningDronesPointByData(leaderboardData, data) {
    if (data.level == 2) {
        return 120;
    }
    else if (data.level == 3) {
        return 180;
    }
    else if (data.level == 4) {
        return 270;
    }
    else if (data.level >= 5 && data.level <= 7) {
        return 300;
    }
    else if (data.level == 8 || data.level == 9) {
        return 360;
    }
    else if (data.level == 10) {
        return 390;
    }
    else if (data.level == 11) {
        return 420;
    }
    else if (data.level == 12) {
        return 600;
    }
    else {
        return 0;
    }
}

const getLeaderboardPoints = (leaderboardData, data) => {
    if (leaderboardData.name == 'FightToTheDeath') {
        return getFightToTheDeathPointByData(leaderboardData, data);
    }
    else if (leaderboardData.name == 'PilotRush') {
        return getPilotRushPointByData(leaderboardData, data);
    }
    else if (leaderboardData.name == 'TitanicTraining') {
        return getTitanicTrainingPointByData(leaderboardData, data);
    }
    else if (leaderboardData.name == 'TitanicEfforts') {
        return getTitanicEffortsPointByData(leaderboardData, data);
    }
    else if (leaderboardData.name == 'StunningDrones') {
        return getStunningDronesPointByData(leaderboardData, data);
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