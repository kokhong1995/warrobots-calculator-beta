import { toInt, toFloat, thousandSeperator, getStrAmount, calculateTotalSuperchestUnlocked, calculateKeysForNextSuperchest, calculateNextSuperchestProgressPercent } from '/warrobots-calculator-beta/js/data-helper.js?v=1.17.10-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.17.10-beta';
import { applyFillingRate } from '/warrobots-calculator-beta/js/modifier-helper.js?v=1.17.10-beta';

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

function updateSuperchestProgressBar(superchestRequiredKeys, totalKeys) {
    const progressBar = document.getElementById('superchestProgressBar');
    const spanSuperchestRemainingKeys = document.getElementById('spanSuperchestRemainingKeys');
    const keysNeeded = calculateKeysForNextSuperchest(superchestRequiredKeys, totalKeys);
    const nextProgressBarPercent = calculateNextSuperchestProgressPercent(superchestRequiredKeys, totalKeys);

    spanSuperchestRemainingKeys.textContent = getStrAmount(keysNeeded);
    progressBar.style.width = nextProgressBarPercent + '%';
    progressBar.setAttribute('aria-valuenow', nextProgressBarPercent);
}

function syncData() {
    const inputCommanderLevel = document.getElementById('inputCommanderLevel');
    const inputFillingRate = document.getElementById('inputFillingRate');
    const inputKeySpent = document.getElementById('inputKeySpent');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalKeys = document.getElementById('totalKeys');
    const spanTotalSuperchests = document.getElementById('totalSuperchests');
    let inputQuantity, spanKeys;
    let commanderLevel, fillingRate = 0;
    const quantityBreakdownData = [];
    let quantity = 0, keys = 0;
    let totalQuantity = 0, totalKeys = 0, totalKeySpentForSuperchest = 0, totalSuperchests = 0;
    let keySpent = 0;
    let i, j;
    let superchestRequiredKeys = 0;

    commanderLevel = toInt(inputCommanderLevel.value);
    fillingRate = Math.abs(toFloat(inputFillingRate.value));

    for (i = 0; i < DS_BLACK_MARKET.length; i++) {
        for (j = 0; j < DS_BLACK_MARKET[i].length; j++) {
            if (DS_BLACK_MARKET[i][j].name === 'Superchest') {
                superchestRequiredKeys = DS_BLACK_MARKET[i][j].keys;
                continue;
            }
            else if (DS_BLACK_MARKET[i][j].active === false ||
                commanderLevel < DS_BLACK_MARKET[i][j].fromLevel ||
                commanderLevel > DS_BLACK_MARKET[i][j].toLevel) {
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
    totalSuperchests = calculateTotalSuperchestUnlocked(superchestRequiredKeys, totalKeySpentForSuperchest);

    spanTotalQuantity.textContent = totalQuantity;
    updateQuantityBadges(quantityBreakdownData);
    spanTotalKeys.textContent = getStrAmount(totalKeys);
    spanTotalKeys.title = thousandSeperator(totalKeys, ' ') + ' Keys';
    spanTotalSuperchests.textContent = getStrAmount(totalSuperchests);
    spanTotalSuperchests.title = thousandSeperator(totalSuperchests, ' ') + ' Superchests';
    updateSuperchestProgressBar(superchestRequiredKeys, totalKeySpentForSuperchest);
}

function initContainers() {
    const containers = [];
    const containerInnerHTMLs = [];
    const inputCommanderLevel = document.getElementById('inputCommanderLevel');
    let commanderLevel = toInt(inputCommanderLevel.value);
    let i, j;


    for (i = 0; i < TYPES.length; i++) {
        containers.push(document.getElementById(`container${TYPES[i]}`));
        containerInnerHTMLs.push('');
    }

    for (i = 0; i < DS_BLACK_MARKET.length; i++) {
        for (j = 0; j < DS_BLACK_MARKET[i].length; j++) {
            if (DS_BLACK_MARKET[i][j].active === false ||
                DS_BLACK_MARKET[i][j].name === 'Superchest' ||
                commanderLevel < DS_BLACK_MARKET[i][j].fromLevel ||
                commanderLevel > DS_BLACK_MARKET[i][j].toLevel) {
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
}

function resetModifiers() {
    resetInputs(['#inputFillingRate', '#inputKeySpent'], 0);
    resetInputs(['#inputCommanderLevel'], 30, function () {
        initContainers();
        initQuickActions();
        setListeners();
        resetChests(0);
    });
}

function resetChests(index) {
    resetInputs([`#container${TYPES[index]} .quantities`], 0, syncData);
}

function presetChests(index, chestName) {
    let inputQuantity;
    let quantity = 0;
    const inputCommanderLevel = document.getElementById('inputCommanderLevel');
    let commanderLevel = toInt(inputCommanderLevel.value);
    let i;

    for (i = 0; i < DS_BLACK_MARKET[index].length; i++) {
        if (DS_BLACK_MARKET[index][i].active === false ||
            DS_BLACK_MARKET[index][i].name === 'Superchest' ||
            DS_BLACK_MARKET[index][i].name !== chestName ||
            commanderLevel < DS_BLACK_MARKET[index][i].fromLevel ||
            commanderLevel > DS_BLACK_MARKET[index][i].toLevel
        ) {
            continue;
        }

        inputQuantity = document.getElementById(`inputQuantity${TYPES[index]}_${i}`);
        quantity = toInt(inputQuantity.value);
        inputQuantity.value = quantity + 10;
    }

    syncData();
}

function initQuickActions() {
    const containerDynamicQuickActions = document.getElementById('containerDynamicQuickActions');
    const inputCommanderLevel = document.getElementById('inputCommanderLevel');
    let commanderLevel = toInt(inputCommanderLevel.value);
    let buttonPresetClass;
    let html = '';
    let index = 0;
    let i, j;

    // Reset QUICK_ACTIONS.
    QUICK_ACTIONS.length = 0;

    for (i = 0; i < DS_BLACK_MARKET.length; i++) {
        for (j = 0; j < DS_BLACK_MARKET[i].length; j++) {
            if (DS_BLACK_MARKET[i][j].active === false ||
                DS_BLACK_MARKET[i][j].name === 'Superchest' ||
                commanderLevel < DS_BLACK_MARKET[i][j].fromLevel ||
                commanderLevel > DS_BLACK_MARKET[i][j].toLevel) {
                continue;
            }

            if (DS_BLACK_MARKET[i][j].name.includes('Promo')) {
                buttonPresetClass = 'btn btn-sm btn-outline-t4';
            }
            else {
                buttonPresetClass = 'btn btn-sm btn-outline-t1';
            }
            html += `<div class="col-auto mt-2"><button type="button" class="${buttonPresetClass}" ` +
                `id="buttonPresetChests_${index}" data-name="${DS_BLACK_MARKET[i][j].name}">` +
                `${DS_BLACK_MARKET[i][j].name} x10</button></div>`;

            QUICK_ACTIONS.push(DS_BLACK_MARKET[i][j].name);
            index++;
        }
    }
    // The reset button.
    html += '<div class="col-auto mt-2"><button type="button" ' +
        'class="btn btn-sm btn-outline-danger" id="buttonResetBlackMarketChests">Reset</button></div>';

    containerDynamicQuickActions.innerHTML = html;
}

function handleMainClick(e) {
    if (e.target.matches('#buttonResetModifiers')) {
        resetModifiers();
    }
    else if (e.target.matches('#buttonResetBlackMarketChests')) {
        resetChests(0);
    }
    else if (e.target.dataset.name && QUICK_ACTIONS.includes(e.target.dataset.name)) {
        presetChests(0, e.target.dataset.name);
    }
    else if (e.target.matches('.btn-decrement')) {
        updateInputValue('-', e.target.dataset.wcTarget);
    }
    else if (e.target.matches('.btn-increment')) {
        updateInputValue('+', e.target.dataset.wcTarget);
    }
}

function handleMainInput(e) {
    if (e.target.matches('.sync-data')) {
        // Minimum value is 0.
        if (e.target.value < 0) {
            e.target.value = 0;
        }
        syncData();
    }
    else if (e.target.matches('.init-data')) {
        initContainers();
        initQuickActions();
        setListeners();
        resetChests(0);
    }
}

function setListeners() {
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.removeEventListener('click', handleMainClick);
    mainContainer.removeEventListener('input', handleMainInput);
    mainContainer.addEventListener('click', handleMainClick);
    mainContainer.addEventListener('input', handleMainInput);
}

function init() {
    initContainers();
    initQuickActions();
    setListeners();

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    syncData();
}

const TYPES = ['BlackMarketChests'];
const DS_BLACK_MARKET = [DS_BLACK_MARKET_CHESTS];
const QUICK_ACTIONS = [];

init();