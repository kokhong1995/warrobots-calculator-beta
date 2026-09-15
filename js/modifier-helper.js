const applyUpgradeDiscountPercentage = (upgradeDiscountPercentage, value) => {
    if (upgradeDiscountPercentage == null || value == null) {
        return 0;
    }

    let discount = value * upgradeDiscountPercentage / 100;
    let netValue = Math.floor(value - discount);

    return netValue > 0 ? netValue : 0;
};

const applyUpgradeSpeedMultiplier = (speed, seconds) => {
    if (speed > 0) {
        return seconds / speed;
    }
    else {
        return seconds;
    }
};

const calculateTotalTitanDeployPoints = (totalTitanDeploys) => {
    const titanDeployHonorPoints = 32;
    const titanDeployPoints = Math.floor(titanDeployHonorPoints / 9);

    return titanDeployPoints * totalTitanDeploys;
};

const calculateTotalWinningBattlePoints = (totalWinningBattles) => {
    const winningBattlePoints = 10;

    return winningBattlePoints * totalWinningBattles;
};

const applyFillingRate = (fillingRate, keySpent) => {
    return keySpent * (fillingRate || 1);
};

export {
    applyUpgradeDiscountPercentage, applyUpgradeSpeedMultiplier,
    calculateTotalTitanDeployPoints, calculateTotalWinningBattlePoints,
    applyFillingRate
};