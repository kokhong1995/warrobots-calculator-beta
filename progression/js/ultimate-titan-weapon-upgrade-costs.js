import { toInt, thousandSeperator, getStrAmount } from '/warrobots-calculator-beta/js/data-helper.js?v=1.12.6-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.12.6-beta';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator-beta/js/modifier-helper.js?v=1.12.6-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalPlatinumAmount = document.getElementById('totalPlatinumAmount');
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    let inputQuantity, spanPlatinumAmount, spanUpgradeTokens;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, platinumAmount = 0, upgradeTokens = 0;
    let totalQuantity = 0, totalPlatinumAmount = 0, totalUpgradeTokens = 0;
    let i, j;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[i].length; j++) {
            if (DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
            spanPlatinumAmount = document.getElementById(`spanPlatinumAmount${TYPES[i]}_${j}`);
            spanUpgradeTokens = document.getElementById(`spanUpgradeTokens${TYPES[i]}_${j}`);

            quantity = toInt(inputQuantity.value);
            platinumAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[i][j].platinumAmount) * quantity;
            upgradeTokens = DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[i][j].upgradeTokens * quantity;

            spanPlatinumAmount.textContent = getStrAmount(platinumAmount);
            spanPlatinumAmount.parentElement.title = thousandSeperator(platinumAmount, ' ') + ' Platinum';
            spanUpgradeTokens.textContent = getStrAmount(upgradeTokens);
            spanUpgradeTokens.parentElement.title = thousandSeperator(upgradeTokens, ' ') + ' Upgrade Tokens';

            totalQuantity += quantity;
            totalPlatinumAmount += platinumAmount;
            totalUpgradeTokens += upgradeTokens;
        }
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalPlatinumAmount.textContent = getStrAmount(totalPlatinumAmount);
    spanTotalPlatinumAmount.title = thousandSeperator(totalPlatinumAmount, ' ') + ' Platinum';
    spanTotalUpgradeTokens.textContent = getStrAmount(totalUpgradeTokens);
    spanTotalUpgradeTokens.title = thousandSeperator(totalUpgradeTokens, ' ') + ' Upgrade Tokens';
}

function resetModifiers() {
    resetInputs(['#inputUpgradeDiscountPercentage'], 0, syncData);
}

function resetUpgrades(index) {
    resetInputs([`#container${TYPES[index]}Upgrades .quantities`], 0, syncData);
}

function presetUpgrades(index) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[index].length; i++) {
        if (DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[index][i].level == 1) {
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

    for (i = 0; i < DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[i].length; j++) {
            if (DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[i][j].level == 1) {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                `<div class="col"><div class="item-title">Level ${DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS[i][j].level}</div>` +
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
        if (e.target.matches('#buttonResetUltimateWeaponUpgrades')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonPresetUltimateWeaponUpgrades')) {
            presetUpgrades(0);
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

const TYPES = ['UltimateWeapon'];
const DS_ULTIMATE_TITAN_WEAPON_UPGRADE_COSTS = [DS_ULTIMATE_TITAN_WEAPON_UPGRADES];

init();