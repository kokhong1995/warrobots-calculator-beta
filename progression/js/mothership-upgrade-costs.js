import { toInt, thousandSeperator, getStrAmount } from '/warrobots-calculator-beta/js/data-helper.js?v=1.15.3-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.15.3-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalComponents = document.getElementById('totalComponents');
    let inputQuantity, spanComponents;
    let quantity = 0, components = 0;
    let totalQuantity = 0, totalComponents = 0;
    let i, j;

    for (i = 0; i < DS_T4_MOTHERSHIP_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_T4_MOTHERSHIP_UPGRADE_COSTS[i].length; j++) {
            if (DS_T4_MOTHERSHIP_UPGRADE_COSTS[i][j]['cost'] === false) {
                continue;
            }

            inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
            spanComponents = document.getElementById(`spanComponents${TYPES[i]}_${j}`);

            quantity = toInt(inputQuantity.value);
            components = DS_T4_MOTHERSHIP_UPGRADE_COSTS[i][j]['cost']['value'] * quantity;

            spanComponents.textContent = getStrAmount(components);
            spanComponents.parentElement.title = thousandSeperator(components, ' ') + ' Components';

            totalQuantity += quantity;
            totalComponents += components;
        }
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalComponents.textContent = getStrAmount(totalComponents);
    spanTotalComponents.title = thousandSeperator(totalComponents, ' ') + ' Components';
}

function resetUpgrades(index) {
    resetInputs([`#container${TYPES[index]}Upgrades .quantities`], 0, syncData);
}

function presetUpgrades(index) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_T4_MOTHERSHIP_UPGRADE_COSTS[index].length; i++) {
        if (DS_T4_MOTHERSHIP_UPGRADE_COSTS[index][i].level == 1) {
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

    for (i = 0; i < DS_T4_MOTHERSHIP_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_T4_MOTHERSHIP_UPGRADE_COSTS[i].length; j++) {
            if (DS_T4_MOTHERSHIP_UPGRADE_COSTS[i][j]['cost'] === false) {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                `<div class="col"><div class="item-title">Level ${DS_T4_MOTHERSHIP_UPGRADE_COSTS[i][j].level}</div>` +
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
                `<span class="badge bg-light text-dark border" title="0 Components">Components: <span id="spanComponents${TYPES[i]}_${j}" class="components">0</span></span>` +
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
        if (e.target.matches('#buttonResetT4StatUpgrades')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonPresetT4StatUpgrades_0') || 
            e.target.matches('#buttonPresetT4StatUpgrades_1') ||
            e.target.matches('#buttonPresetT4StatUpgrades_2')) {
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

    syncData();
}

const TYPES = ['T4Stat'];
const DS_T4_MOTHERSHIP_UPGRADE_COSTS = [DS_T4_STAT_UPGRADES];

init();