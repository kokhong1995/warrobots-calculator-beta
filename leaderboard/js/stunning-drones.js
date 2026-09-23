import { toInt, thousandSeperator, getStrAmount } from '/warrobots-calculator-beta/js/data-helper.js?v=1.12.10-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.12.10-beta';
import { applyUpgradeDiscountPercentage, calculateTotalTitanDeployPoints, calculateTotalWinningBattlePoints } from '/warrobots-calculator-beta/js/modifier-helper.js?v=1.12.10-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const inputCurrentPoints = document.getElementById('inputCurrentPoints');
    const inputTotalTitanDeployments = document.getElementById('inputTotalTitanDeployments');
    const inputTotalVictories = document.getElementById('inputTotalVictories');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalMicrochips = document.getElementById('totalMicrochips');
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    const spanTotalPoints = document.getElementById('totalPoints');
    let inputQuantity, spanMicrochips, spanUpgradeTokens, spanPoints;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, microchips = 0, upgradeTokens = 0, points = 0;
    let totalQuantity = 0, totalMicrochips = 0, totalUpgradeTokens = 0;
    let totalPoints = 0, currentPoints = 0, totalTitanDeploymentPoints = 0, totalVictoryPoints = 0;
    let i, j;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_STUNNING_DRONES.length; i++) {
        for (j = 0; j < DS_STUNNING_DRONES[i].length; j++) {
            if (DS_STUNNING_DRONES[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
            spanMicrochips = document.getElementById(`spanMicrochips${TYPES[i]}_${j}`);
            spanUpgradeTokens = document.getElementById(`spanUpgradeTokens${TYPES[i]}_${j}`);
            spanPoints = document.getElementById(`spanPoints${TYPES[i]}_${j}`);

            quantity = toInt(inputQuantity.value);
            microchips = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_STUNNING_DRONES[i][j].microchips) * quantity;
            upgradeTokens = DS_STUNNING_DRONES[i][j].upgradeTokens * quantity;
            points = DS_STUNNING_DRONES[i][j].points.stunningDrones * quantity;

            spanMicrochips.textContent = getStrAmount(microchips);
            spanMicrochips.parentElement.title = thousandSeperator(microchips, ' ') + ' Microchips';
            spanUpgradeTokens.textContent = getStrAmount(upgradeTokens);
            spanUpgradeTokens.parentElement.title = thousandSeperator(upgradeTokens, ' ') + ' Upgrade Tokens';
            spanPoints.textContent = getStrAmount(points);
            spanPoints.parentElement.title = thousandSeperator(points, ' ') + ' Points';

            totalQuantity += quantity;
            totalMicrochips += microchips;
            totalUpgradeTokens += upgradeTokens;
            totalPoints += points;
        }
    }
    currentPoints = toInt(inputCurrentPoints.value);
    totalTitanDeploymentPoints = calculateTotalTitanDeployPoints(toInt(inputTotalTitanDeployments.value));
    totalVictoryPoints = calculateTotalWinningBattlePoints(toInt(inputTotalVictories.value));
    totalPoints += currentPoints + totalTitanDeploymentPoints + totalVictoryPoints;

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalMicrochips.textContent = getStrAmount(totalMicrochips);
    spanTotalMicrochips.title = thousandSeperator(totalMicrochips, ' ') + ' Microchips';
    spanTotalUpgradeTokens.textContent = getStrAmount(totalUpgradeTokens);
    spanTotalUpgradeTokens.title = thousandSeperator(totalUpgradeTokens, ' ') + ' Upgrade Tokens';
    spanTotalPoints.textContent = getStrAmount(totalPoints);
    spanTotalPoints.title = thousandSeperator(totalPoints, ' ') + ' Points';
}

function resetModifiers() {
    resetInputs([
        '#inputUpgradeDiscountPercentage', '#inputCurrentPoints',
        '#inputTotalTitanDeployments', '#inputTotalVictories'
    ], 0, syncData);
}

function resetUpgrades(index) {
    resetInputs([`#container${TYPES[index]}Upgrades .quantities`], 0, syncData);
}

function presetUpgrades(index, type) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_STUNNING_DRONES[index].length; i++) {
        if (DS_STUNNING_DRONES[index][i].level == 1) {
            continue;
        }

        if (type == 0) {
            if (DS_STUNNING_DRONES[index][i].level > 3) {
                continue;
            }
        }
        else if (type == 1) {
            if (DS_STUNNING_DRONES[index][i].level > 6) {
                continue;
            }
        }
        else if (type == 2) {
            if (DS_STUNNING_DRONES[index][i].level > 9) {
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

    for (i = 0; i < DS_STUNNING_DRONES.length; i++) {
        for (j = 0; j < DS_STUNNING_DRONES[i].length; j++) {
            if (DS_STUNNING_DRONES[i][j].level == 1) {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                `<div class="col"><div class="item-title">Level ${DS_STUNNING_DRONES[i][j].level}</div>` +
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
                `<span class="badge bg-light text-dark border" title="0 Microchips">Microchips: <span id="spanMicrochips${TYPES[i]}_${j}" class="microchips">0</span></span>` +
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
        if (e.target.matches('#buttonResetDroneUpgrades')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonPresetDroneUpgrades_0')) {
            presetUpgrades(0, 0);
        }
        if (e.target.matches('#buttonPresetDroneUpgrades_1')) {
            presetUpgrades(0, 1);
        }
        if (e.target.matches('#buttonPresetDroneUpgrades_2')) {
            presetUpgrades(0, 2);
        }
        if (e.target.matches('#buttonPresetDroneUpgrades_3')) {
            presetUpgrades(0, 3);
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

const TYPES = ['Drone'];
const DS_STUNNING_DRONES = [
    DS_DRONE_UPGRADES
];

init();