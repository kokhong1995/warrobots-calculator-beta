import { toInt } from './data-helper.js?v=1.12.6-beta';

const resetInputs = (selectors, value = '', callback) => {
    let i, j;
    let inputs;

    for (i = 0; i < selectors.length; i++) {
        inputs = document.querySelectorAll(selectors[i]);

        for (j = 0; j < inputs.length; j++) {
            inputs[j].value = value;
        }
    }

    if (callback && typeof callback === 'function') {
        callback();
    }
};

const updateNumberInput = (eventType, inputId, callback) => {
    if (eventType == null || inputId == null) {
        return;
    }

    let input = document.getElementById(inputId);
    let intValue = toInt(input.value);

    if (eventType == '+') {
        intValue++;
    }
    else if (eventType == '-' && intValue > 0) {
        intValue--;
    }

    input.value = intValue;

    if (callback && typeof callback === 'function') {
        callback();
    }
};

export { resetInputs, updateNumberInput };