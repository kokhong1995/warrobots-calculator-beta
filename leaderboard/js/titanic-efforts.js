import { toInt, thousandSeperator, getStrAmount } from '/warrobots-calculator/js/data-helper.js?v=1.12.5-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.12.5-beta';
import { applyUpgradeDiscountPercentage, calculateTotalTitanDeployPoints } from '/warrobots-calculator/js/modifier-helper.js?v=1.12.5-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const inputCurrentPoints = document.getElementById('inputCurrentPoints');
    const inputTotalTitanDeployments = document.getElementById('inputTotalTitanDeployments');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalPlatinumAmount = document.getElementById('totalPlatinumAmount');
    const spanTotalPoints = document.getElementById('totalPoints');
    let inputQuantity, spanPlatinumAmount, spanPoints;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, platinumAmount = 0, points = 0;
    let totalQuantity = 0, totalPlatinumAmount = 0;
    let totalPoints = 0, currentPoints = 0, totalTitanDeploymentPoints = 0;
    let i, j;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_TITANIC_EFFORTS.length; i++) {
        for (j = 0; j < DS_TITANIC_EFFORTS[i].length; j++) {
            if (DS_TITANIC_EFFORTS[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
            spanPlatinumAmount = document.getElementById(`spanPlatinumAmount${TYPES[i]}_${j}`);
            spanPoints = document.getElementById(`spanPoints${TYPES[i]}_${j}`);

            quantity = toInt(inputQuantity.value);
            platinumAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_TITANIC_EFFORTS[i][j].platinumAmount) * quantity;
            points = DS_TITANIC_EFFORTS[i][j].points.titanicEfforts * quantity;

            spanPlatinumAmount.textContent = getStrAmount(platinumAmount);
            spanPlatinumAmount.parentElement.title = thousandSeperator(platinumAmount, ' ') + ' Platinum';
            spanPoints.textContent = getStrAmount(points);
            spanPoints.parentElement.title = thousandSeperator(points, ' ') + ' Points';

            totalQuantity += quantity;
            totalPlatinumAmount += platinumAmount;
            totalPoints += points;
        }
    }
    currentPoints = toInt(inputCurrentPoints.value);
    totalTitanDeploymentPoints = calculateTotalTitanDeployPoints(toInt(inputTotalTitanDeployments.value));
    totalPoints += currentPoints + totalTitanDeploymentPoints;

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalPlatinumAmount.textContent = getStrAmount(totalPlatinumAmount);
    spanTotalPlatinumAmount.title = thousandSeperator(totalPlatinumAmount, ' ') + ' Platinum';
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

function presetUpgrades(index) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_TITANIC_EFFORTS[index].length; i++) {
        if (DS_TITANIC_EFFORTS[index][i].level == 1) {
            continue;
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

    for (i = 0; i < DS_TITANIC_EFFORTS.length; i++) {
        for (j = 0; j < DS_TITANIC_EFFORTS[i].length; j++) {
            if (DS_TITANIC_EFFORTS[i][j].level == 1) {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                `<div class="col"><div class="item-title">Level ${DS_TITANIC_EFFORTS[i][j].level}</div>` +
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
                `<span class="badge bg-light text-dark border" title="0 Platinum">Platinum: <span id="spanPlatinumAmount${TYPES[i]}_${j}" class="platinum-amount">0</span></span>` +
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
        if (e.target.matches('#buttonResetT4HullSubsystemUpgrades')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonResetT4CoreSubsystemUpgrades')) {
            resetUpgrades(1);
        }
        if (e.target.matches('#buttonResetT4EngineSubsystemUpgrades')) {
            resetUpgrades(2);
        }
        if (e.target.matches('#buttonResetT4WeaponUpgrades')) {
            resetUpgrades(3);
        }
        if (e.target.matches('#buttonPresetT4HullSubsystemUpgrades')) {
            presetUpgrades(0);
        }
        if (e.target.matches('#buttonPresetT4CoreSubsystemUpgrades')) {
            presetUpgrades(1);
        }
        if (e.target.matches('#buttonPresetT4EngineSubsystemUpgrades')) {
            presetUpgrades(2);
        }
        if (e.target.matches('#buttonPresetT4WeaponUpgrades')) {
            presetUpgrades(3);
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

const TYPES = ['T4HullSubsystem', 'T4CoreSubsystem', 'T4EngineSubsystem', 'T4Weapon'];
const DS_TITANIC_EFFORTS = [
    DS_T4_TITAN_HULL_UPGRADES, DS_T4_TITAN_CORE_UPGRADES,
    DS_T4_TITAN_ENGINE_UPGRADES, DS_T4_TITAN_WEAPON_UPGRADES
];

init();