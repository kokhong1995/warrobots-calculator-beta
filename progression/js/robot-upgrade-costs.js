import { toInt, thousandSeperator, getStrLevel, getStrAmount, getStrDuration } from '/warrobots-calculator-beta/js/data-helper.js?v=1.12.7-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.12.7-beta';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator-beta/js/modifier-helper.js?v=1.12.7-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalSilverAmount = document.getElementById('totalSilverAmount');
    const spanTotalGoldAmount = document.getElementById('totalGoldAmount');
    const spanTotalUpgradeDuration = document.getElementById("totalUpgradeDuration");
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    let inputQuantity, spanSilverAmount, spanGoldAmount, spanUpgradeDuration, spanUpgradeTokens;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, silverAmount = 0, goldAmount = 0, upgradeDuration = 0, upgradeTokens = 0;
    let totalQuantity = 0, totalSilverAmount = 0, totalGoldAmount = 0, totalUpgradeDuration = 0, totalUpgradeTokens = 0;
    let i, j;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_ROBOT_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_ROBOT_UPGRADE_COSTS[i].length; j++) {
            if (DS_ROBOT_UPGRADE_COSTS[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
            spanSilverAmount = document.getElementById(`spanSilverAmount${TYPES[i]}_${j}`);
            spanGoldAmount = document.getElementById(`spanGoldAmount${TYPES[i]}_${j}`);
            spanUpgradeDuration = document.getElementById(`spanUpgradeDuration${TYPES[i]}_${j}`);
            spanUpgradeTokens = document.getElementById(`spanUpgradeTokens${TYPES[i]}_${j}`);

            quantity = toInt(inputQuantity.value);
            silverAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_ROBOT_UPGRADE_COSTS[i][j].silverAmount) * quantity;
            // Gold amount for enhancing to MK2 is discountable. 
            if (DS_ROBOT_UPGRADE_COSTS[i][j].mark == 2 && DS_ROBOT_UPGRADE_COSTS[i][j].level == 0) {
                goldAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_ROBOT_UPGRADE_COSTS[i][j].goldAmount) * quantity;
            }
            else {
                goldAmount = DS_ROBOT_UPGRADE_COSTS[i][j].goldAmount * quantity;
            }
            upgradeDuration = DS_ROBOT_UPGRADE_COSTS[i][j].upgradeDurationSeconds * quantity;
            upgradeTokens = DS_ROBOT_UPGRADE_COSTS[i][j].upgradeTokens * quantity;

            spanSilverAmount.textContent = getStrAmount(silverAmount);
            spanSilverAmount.parentElement.title = thousandSeperator(silverAmount, ' ') + ' Silver';
            spanGoldAmount.textContent = getStrAmount(goldAmount);
            spanGoldAmount.parentElement.title = thousandSeperator(goldAmount, ' ') + ' Gold';
            spanUpgradeDuration.textContent = getStrDuration(upgradeDuration);
            spanUpgradeTokens.textContent = getStrAmount(upgradeTokens);
            spanUpgradeTokens.parentElement.title = thousandSeperator(upgradeTokens, ' ') + ' Upgrade Tokens';

            totalQuantity += quantity;
            totalSilverAmount += silverAmount;
            totalGoldAmount += goldAmount;
            totalUpgradeDuration += upgradeDuration;
            totalUpgradeTokens += upgradeTokens;
        }
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalSilverAmount.textContent = getStrAmount(totalSilverAmount);
    spanTotalSilverAmount.title = thousandSeperator(totalSilverAmount, ' ') + ' Silver';
    spanTotalGoldAmount.textContent = getStrAmount(totalGoldAmount);
    spanTotalGoldAmount.title = thousandSeperator(totalGoldAmount, ' ') + ' Gold';
    spanTotalUpgradeDuration.textContent = getStrDuration(totalUpgradeDuration);
    spanTotalUpgradeTokens.textContent = getStrAmount(totalUpgradeTokens);
    spanTotalUpgradeTokens.title = thousandSeperator(totalUpgradeTokens, ' ') + ' Upgrade Tokens';
}

function resetModifiers() {
    resetInputs(['#inputUpgradeDiscountPercentage'], 0, syncData);
}

function resetUpgrades(index) {
    resetInputs([`#container${TYPES[index]}Upgrades .quantities`], 0, syncData);
}

function presetUpgrades(index, type) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_ROBOT_UPGRADE_COSTS[index].length; i++) {
        if (DS_ROBOT_UPGRADE_COSTS[index][i].level == 1) {
            continue;
        }

        // MK1 to MK2.
        if (type == 0) {
            // Skip MK2 : Level 0 above.
            if (DS_ROBOT_UPGRADE_COSTS[index][i].mark == 2 &&
                DS_ROBOT_UPGRADE_COSTS[index][i].level > 0) {
                continue;
            }
            // Skip all MK3.
            else if (DS_ROBOT_UPGRADE_COSTS[index][i].mark == 3) {
                continue;
            }
        }
        // MK2 to MK3.
        else {
            // Skip all MK1.
            if (DS_ROBOT_UPGRADE_COSTS[index][i].mark == 1) {
                continue;
            }
            // Skip MK2: Level 0 only.
            else if (DS_ROBOT_UPGRADE_COSTS[index][i].mark == 2 &&
                DS_ROBOT_UPGRADE_COSTS[index][i].level == 0) {
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

    for (i = 0; i < DS_ROBOT_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_ROBOT_UPGRADE_COSTS[i].length; j++) {
            if (DS_ROBOT_UPGRADE_COSTS[i][j].level == 1) {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                `<div class="col"><div class="item-title">${getStrLevel(DS_ROBOT_UPGRADE_COSTS[i][j].mark, DS_ROBOT_UPGRADE_COSTS[i][j].level)}</div>` +
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
        if (e.target.matches('#buttonResetT1RobotUpgrades')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonResetT2RobotUpgrades')) {
            resetUpgrades(1);
        }
        if (e.target.matches('#buttonResetT3RobotUpgrades')) {
            resetUpgrades(2);
        }
        if (e.target.matches('#buttonResetT4RobotUpgrades')) {
            resetUpgrades(3);
        }
        if (e.target.matches('#buttonPresetT1RobotUpgrades_0')) {
            presetUpgrades(0, 0);
        }
        if (e.target.matches('#buttonPresetT1RobotUpgrades_1')) {
            presetUpgrades(0, 1);
        }
        if (e.target.matches('#buttonPresetT2RobotUpgrades_0')) {
            presetUpgrades(1, 0);
        }
        if (e.target.matches('#buttonPresetT2RobotUpgrades_1')) {
            presetUpgrades(1, 1);
        }
        if (e.target.matches('#buttonPresetT3RobotUpgrades_0')) {
            presetUpgrades(2, 0);
        }
        if (e.target.matches('#buttonPresetT3RobotUpgrades_1')) {
            presetUpgrades(2, 1);
        }
        if (e.target.matches('#buttonPresetT4RobotUpgrades_0')) {
            presetUpgrades(3, 0);
        }
        if (e.target.matches('#buttonPresetT4RobotUpgrades_1')) {
            presetUpgrades(3, 1);
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

const TYPES = ['T1Robot', 'T2Robot', 'T3Robot', 'T4Robot'];
const DS_ROBOT_UPGRADE_COSTS = [
    DS_T1_ROBOT_UPGRADES, DS_T2_ROBOT_UPGRADES,
    DS_T3_ROBOT_UPGRADES, DS_T4_ROBOT_UPGRADES
];

init();