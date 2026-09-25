import { toInt, toFloat, thousandSeperator, getStrAmount, calculateTotalSuperchestUnlocked, calculateKeysForNextSuperchest, calculateNextSuperchestProgressPercent } from '/warrobots-calculator-beta/js/data-helper.js?v=1.12.11-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.12.11-beta';
import { applyFillingRate } from '/warrobots-calculator-beta/js/modifier-helper.js?v=1.12.11-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function updateQuantityBadges(quantityBreakdownData) {
    const container = document.getElementById('quantityBadges');
    let spanClass = 'badge bg-primary-subtle text-primary-emphasis rounded-pill fs-8';
    let innerHTML = '';
    let i;

    for (i = 0; i < quantityBreakdownData.length; i++) {
        if (quantityBreakdownData[i].quantity > 0) {
            innerHTML += `<span class='${spanClass}'>` +
                `${quantityBreakdownData[i].name}: <b class="fw-bold">${quantityBreakdownData[i].quantity}</b>` +
                "</span>";
        }
    }

    container.innerHTML = innerHTML;
}

function updateSuperchestProgressBar(totalKeys) {
    const progressBar = document.getElementById('superchestProgressBar');
    const spanSuperchestRemainingKeys = document.getElementById('spanSuperchestRemainingKeys');
    let keysNeeded = calculateKeysForNextSuperchest(totalKeys);
    let nextProgressBarPercent = calculateNextSuperchestProgressPercent(totalKeys);

    spanSuperchestRemainingKeys.textContent = getStrAmount(keysNeeded);
    progressBar.style.width = nextProgressBarPercent + '%';
    progressBar.setAttribute('aria-valuenow', nextProgressBarPercent);
}

function syncData() {
    const inputFillingRate = document.getElementById('inputFillingRate');
    const inputKeySpent = document.getElementById('inputKeySpent');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalKeys = document.getElementById('totalKeys');
    const spanTotalSuperchests = document.getElementById('totalSuperchests');
    let inputQuantity, spanKeys;
    let fillingRate = 0;
    const quantityBreakdownData = [];
    let quantity = 0, keys = 0;
    let totalQuantity = 0, totalKeys = 0, totalKeySpentForSuperchest = 0, totalSuperchests = 0;
    let keySpent = 0;
    let i, j;

    fillingRate = Math.abs(toFloat(inputFillingRate.value));

    for (i = 0; i < DS_BLACK_MARKET.length; i++) {
        for (j = 0; j < DS_BLACK_MARKET[i].length; j++) {
            if (DS_BLACK_MARKET[i][j].name == 'Superchest') {
                continue;
            }

            inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
            spanKeys = document.getElementById(`spanKeys${TYPES[i]}_${j}`);

            quantity = toInt(inputQuantity.value);
            keys = DS_BLACK_MARKET[i][j].keys * quantity;
            quantityBreakdownData.push({
                name: DS_BLACK_MARKET[i][j].name,
                quantity: quantity
            });

            spanKeys.textContent = getStrAmount(keys);
            spanKeys.parentElement.title = thousandSeperator(keys, ' ') + ' Keys';

            totalKeys += keys;
            totalQuantity += quantity;
        }
    }
    keySpent = toInt(inputKeySpent.value);
    totalKeySpentForSuperchest += applyFillingRate(fillingRate, totalKeys) + keySpent;
    totalSuperchests = calculateTotalSuperchestUnlocked(totalKeySpentForSuperchest);

    spanTotalQuantity.textContent = totalQuantity;
    updateQuantityBadges(quantityBreakdownData);
    spanTotalKeys.textContent = getStrAmount(totalKeys);
    spanTotalKeys.title = thousandSeperator(totalKeys, ' ') + ' Keys';
    spanTotalSuperchests.textContent = getStrAmount(totalSuperchests);
    spanTotalSuperchests.title = thousandSeperator(totalSuperchests, ' ') + ' Superchests';
    updateSuperchestProgressBar(totalKeySpentForSuperchest);
}

function resetModifiers() {
    resetInputs([
        '#inputFillingRate', '#inputKeySpent'
    ], 0, syncData);
}

function resetChests(index) {
    resetInputs([`#container${TYPES[index]} .quantities`], 0, syncData);
}

function presetChests(index, chestName) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_BLACK_MARKET[index].length; i++) {
        if (DS_BLACK_MARKET[index][i].name != chestName) {
            continue;
        }

        inputQuantity = document.getElementById(`inputQuantity${TYPES[index]}_${i}`);
        quantity = toInt(inputQuantity.value);
        inputQuantity.value = quantity + 10;
    }

    syncData();
}

function init() {
    const containers = [];
    const containerInnerHTMLs = [];
    let i, j;

    for (i = 0; i < TYPES.length; i++) {
        containers.push(document.getElementById(`container${TYPES[i]}`));
        containerInnerHTMLs.push('');
    }

    for (i = 0; i < DS_BLACK_MARKET.length; i++) {
        for (j = 0; j < DS_BLACK_MARKET[i].length; j++) {
            if (DS_BLACK_MARKET[i][j].name == 'Superchest') {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                `<div class="col"><div class="item-title">${DS_BLACK_MARKET[i][j].name}</div>` +
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
                `<span class="badge bg-light text-dark border" title="0 Keys">Keys: <span id="spanKeys${TYPES[i]}_${j}" class="keys">0</span></span>` +
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
        if (e.target.matches('#buttonResetBlackMarketChests')) {
            resetChests(0);
        }
        if (e.target.matches('#buttonPresetChests_0')) {
            presetChests(0, 'Robots');
        }
        if (e.target.matches('#buttonPresetChests_1')) {
            presetChests(0, 'Weapons');
        }
        if (e.target.matches('#buttonPresetChests_2')) {
            presetChests(0, 'Titans');
        }
        if (e.target.matches('#buttonPresetChests_3')) {
            presetChests(0, 'Pilots');
        }
        if (e.target.matches('#buttonPresetChests_4')) {
            presetChests(0, 'Drones');
        }
        if (e.target.matches('#buttonPresetChests_5')) {
            presetChests(0, 'Ships');
        }
        if (e.target.matches('#buttonPresetChests_6')) {
            presetChests(0, 'Promo (500)');
        }
        if (e.target.matches('#buttonPresetChests_7')) {
            presetChests(0, 'Promo (1000)');
        }
        if (e.target.matches('#buttonPresetChests_8')) {
            presetChests(0, 'Promo (2000)');
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

const TYPES = ['BlackMarketChests'];
const DS_BLACK_MARKET = [DS_BLACK_MARKET_CHESTS];

init();