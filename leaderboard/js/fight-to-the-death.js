import { toInt, thousandSeperator, getStrLevel, getStrAmount, getStrDuration } from '/warrobots-calculator-beta/js/data-helper.js?v=1.12.7-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.12.7-beta';
import { applyUpgradeDiscountPercentage, calculateTotalTitanDeployPoints } from '/warrobots-calculator-beta/js/modifier-helper.js?v=1.12.7-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const inputCurrentPoints = document.getElementById('inputCurrentPoints');
    const inputTotalTitanDeployments = document.getElementById('inputTotalTitanDeployments');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalSilverAmount = document.getElementById('totalSilverAmount');
    const spanTotalGoldAmount = document.getElementById('totalGoldAmount');
    const spanTotalUpgradeDuration = document.getElementById("totalUpgradeDuration");
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    const spanTotalPoints = document.getElementById('totalPoints');
    let inputQuantity, spanSilverAmount, spanGoldAmount, spanUpgradeDuration, spanUpgradeTokens, spanPoints;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, silverAmount = 0, goldAmount = 0, upgradeDuration = 0, upgradeTokens = 0, points = 0;
    let totalQuantity = 0, totalSilverAmount = 0, totalGoldAmount = 0, totalUpgradeDuration = 0, totalUpgradeTokens = 0;
    let totalPoints = 0, currentPoints = 0, totalTitanDeploymentPoints = 0;
    let i, j;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_FIGHT_TO_THE_DEATH.length; i++) {
        for (j = 0; j < DS_FIGHT_TO_THE_DEATH[i].length; j++) {
            if (DS_FIGHT_TO_THE_DEATH[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
            spanSilverAmount = document.getElementById(`spanSilverAmount${TYPES[i]}_${j}`);
            spanGoldAmount = document.getElementById(`spanGoldAmount${TYPES[i]}_${j}`);
            spanUpgradeDuration = document.getElementById(`spanUpgradeDuration${TYPES[i]}_${j}`);
            spanUpgradeTokens = document.getElementById(`spanUpgradeTokens${TYPES[i]}_${j}`);
            spanPoints = document.getElementById(`spanPoints${TYPES[i]}_${j}`);

            quantity = toInt(inputQuantity.value);
            silverAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_FIGHT_TO_THE_DEATH[i][j].silverAmount) * quantity;
            // Gold amount for enhancing to MK2 is discountable. 
            if (DS_FIGHT_TO_THE_DEATH[i][j].mark == 2 && DS_FIGHT_TO_THE_DEATH[i][j].level == 0) {
                goldAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_FIGHT_TO_THE_DEATH[i][j].goldAmount) * quantity;
            }
            else {
                goldAmount = DS_FIGHT_TO_THE_DEATH[i][j].goldAmount * quantity;
            }
            upgradeDuration = DS_FIGHT_TO_THE_DEATH[i][j].upgradeDurationSeconds * quantity;
            upgradeTokens = DS_FIGHT_TO_THE_DEATH[i][j].upgradeTokens * quantity;
            points = DS_FIGHT_TO_THE_DEATH[i][j].points.fightToTheDeath * quantity;

            spanSilverAmount.textContent = getStrAmount(silverAmount);
            spanSilverAmount.parentElement.title = thousandSeperator(silverAmount, ' ') + ' Silver';
            spanGoldAmount.textContent = getStrAmount(goldAmount);
            spanGoldAmount.parentElement.title = thousandSeperator(goldAmount, ' ') + ' Gold';
            spanUpgradeDuration.textContent = getStrDuration(upgradeDuration);
            spanUpgradeTokens.textContent = getStrAmount(upgradeTokens);
            spanUpgradeTokens.parentElement.title = thousandSeperator(upgradeTokens, ' ') + ' Upgrade Tokens';
            spanPoints.textContent = getStrAmount(points);
            spanPoints.parentElement.title = thousandSeperator(points, ' ') + ' Points';

            totalQuantity += quantity;
            totalSilverAmount += silverAmount;
            totalGoldAmount += goldAmount;
            totalUpgradeDuration += upgradeDuration;
            totalUpgradeTokens += upgradeTokens;
            totalPoints += points;
        }
    }
    currentPoints = toInt(inputCurrentPoints.value);
    totalTitanDeploymentPoints = calculateTotalTitanDeployPoints(toInt(inputTotalTitanDeployments.value));
    totalPoints += currentPoints + totalTitanDeploymentPoints;

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalSilverAmount.textContent = getStrAmount(totalSilverAmount);
    spanTotalSilverAmount.title = thousandSeperator(totalSilverAmount, ' ') + ' Silver';
    spanTotalGoldAmount.textContent = getStrAmount(totalGoldAmount);
    spanTotalGoldAmount.title = thousandSeperator(totalGoldAmount, ' ') + ' Gold';
    spanTotalUpgradeDuration.textContent = getStrDuration(totalUpgradeDuration);
    spanTotalUpgradeTokens.textContent = getStrAmount(totalUpgradeTokens);
    spanTotalUpgradeTokens.title = thousandSeperator(totalUpgradeTokens, ' ') + ' Upgrade Tokens';
    spanTotalPoints.textContent = getStrAmount(totalPoints);
    spanTotalPoints.title = thousandSeperator(totalPoints, ' ') + ' Points';
}

function resetModifiers() {
    resetInputs([
        '#inputUpgradeDiscountPercentage', '#inputCurrentPoints',
        '#inputTotalTitanDeployments'
    ], 0, syncData);
}

function resetUpgrades(index) {
    resetInputs([`#container${TYPES[index]}Upgrades .quantities`], 0, syncData);
}

function presetUpgrades(index, type) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_FIGHT_TO_THE_DEATH[index].length; i++) {
        if (DS_FIGHT_TO_THE_DEATH[index][i].level == 1) {
            continue;
        }

        // MK1 to MK2.
        if (type == 0) {
            // Skip MK2 : Level 0 above.
            if (DS_FIGHT_TO_THE_DEATH[index][i].mark == 2 &&
                DS_FIGHT_TO_THE_DEATH[index][i].level > 0) {
                continue;
            }
            // Skip all MK3.
            else if (DS_FIGHT_TO_THE_DEATH[index][i].mark == 3) {
                continue;
            }
        }
        // MK2 to MK3.
        else {
            // Skip all MK1.
            if (DS_FIGHT_TO_THE_DEATH[index][i].mark == 1) {
                continue;
            }
            // Skip MK2: Level 0 only.
            else if (DS_FIGHT_TO_THE_DEATH[index][i].mark == 2 &&
                DS_FIGHT_TO_THE_DEATH[index][i].level == 0) {
                continue;
            }
        }

        inputQuantity = document.getElementById(`inputQuantity${TYPES[index]}_${i}`);
        quantity = toInt(inputQuantity.value);
        inputQuantity.value = ++quantity;
    }

    syncData();
}

function init() {
    const containers = [];
    const containerInnerHTMLs = [];
    let i, j;

    for (i = 0; i < TYPES.length; i++) {
        containers.push(document.getElementById(`container${TYPES[i]}Upgrades`));
        containerInnerHTMLs.push('');
    }

    for (i = 0; i < DS_FIGHT_TO_THE_DEATH.length; i++) {
        for (j = 0; j < DS_FIGHT_TO_THE_DEATH[i].length; j++) {
            if (DS_FIGHT_TO_THE_DEATH[i][j].level == 1) {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                `<div class="col"><div class="item-title">${getStrLevel(DS_FIGHT_TO_THE_DEATH[i][j].mark, DS_FIGHT_TO_THE_DEATH[i][j].level)}</div>` +
                '</div>' +
                '<div class="col">' +
                '<div class="input-group">' +
                `<button type="button" class="btn btn-danger btn-decrement" data-wc-target="inputQuantity${TYPES[i]}_${j}">-</button>` +
                `<input id="inputQuantity${TYPES[i]}_${j}" type="number" class="form-control quantities sync-data" min="0" value="0">` +
                `<button type="button" class="btn btn-success btn-increment" data-wc-target="inputQuantity${TYPES[i]}_${j}">+</button>` +
                '</div>' +
                '</div>' +
                '<div class="col-12">' +
                '<div class="d-flex flex-wrap gap-1 mt-2">' +
                `<span class="badge bg-light text-dark border" title="0 Silver">Silver: <span id="spanSilverAmount${TYPES[i]}_${j}" class="silver-amount">0</span></span>` +
                `<span class="badge bg-light text-dark border" title="0 Gold">Gold: <span id="spanGoldAmount${TYPES[i]}_${j}" class="gold-amount">0</span></span>` +
                `<span class="badge bg-light text-dark border">Upgrade Duration: <span id="spanUpgradeDuration${TYPES[i]}_${j}" class="upgrade-duration">0</span></span>` +
                `<span class="badge bg-light text-dark border" title="0 Upgrade Tokens">Upgrade Tokens: <span id="spanUpgradeTokens${TYPES[i]}_${j}" class="upgrade-tokens">0</span></span>` +
                `<span class="badge bg-light text-dark border" title="0 Points">Points: <span id="spanPoints${TYPES[i]}_${j}" class="points">0</span></span>` +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    }

    for (i = 0; i < containers.length; i++) {
        containers[i].innerHTML = containerInnerHTMLs[i];
    }

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetT4RobotUpgrades')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonResetT4WeaponUpgrades')) {
            resetUpgrades(1);
        }
        if (e.target.matches('#buttonPresetT4RobotUpgrades_0')) {
            presetUpgrades(0, 0);
        }
        if (e.target.matches('#buttonPresetT4RobotUpgrades_1')) {
            presetUpgrades(0, 1);
        }
        if (e.target.matches('#buttonPresetT4WeaponUpgrades_0')) {
            presetUpgrades(1, 0);
        }
        if (e.target.matches('#buttonPresetT4WeaponUpgrades_1')) {
            presetUpgrades(1, 1);
        }
        if (e.target.matches('.btn-decrement')) {
            updateInputValue('-', e.target.dataset.wcTarget);
        }
        if (e.target.matches('.btn-increment')) {
            updateInputValue('+', e.target.dataset.wcTarget);
        }
    });
    // Set input event listener.
    document.getElementById('mainContainer').addEventListener('input', (e) => {
        if (e.target.matches('.sync-data')) {
            // Minimum value is 0.
            if (e.target.value < 0) {
                e.target.value = 0;
            }
            syncData();
        }
    });

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

const TYPES = ['T4Robot', 'T4Weapon'];
const DS_FIGHT_TO_THE_DEATH = [
    DS_T4_ROBOT_UPGRADES, DS_T4_ROBOT_WEAPON_UPGRADES
];

init();