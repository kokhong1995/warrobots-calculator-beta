import { toInt, getStrAmount, thousandSeperator } from './data-helper.js?v=1.17.6-beta';

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

const handleTotalSummaryElement = (id, value, postfix, discountDetails) => {
    const element = document.getElementById(id);

    element.textContent = getStrAmount(value);
    if (typeof postfix === 'string' && postfix.trim().length > 0) {
        element.title = thousandSeperator(value, ' ') + postfix;
    }

    if (typeof discountDetails === 'object' && discountDetails !== null && (!Array.isArray(discountDetails))) {
        const discountElement = document.getElementById(id + 'Saved');

        if (discountDetails.totalValueSaved > 0 && discountDetails.discountPercentage > 0) {
            discountElement.textContent = `Saved ${getStrAmount(discountDetails.totalValueSaved)} (${discountDetails.discountPercentage}%)`;
            discountElement.title = `Saved ${thousandSeperator(discountDetails.totalValueSaved, ' ')} (${discountDetails.discountPercentage}%)`;
            discountElement.classList.remove('d-none');
        }
        else {
            discountElement.textContent = '';
            discountElement.title = '';
            discountElement.classList.add('d-none');
        }
    }
};

export { resetInputs, updateNumberInput, handleTotalSummaryElement };