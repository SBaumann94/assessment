import App from './App'
import React from 'react';
import ReactDOM from 'react-dom';

it('App renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});

const testValues = ["123456789", "2002002", "980000000", "999999999999999999999999", "55", "1", "0", "-123", "999999999999999999999999999"]
const checkValues = ["one hundred and twenty three million, four hundred and fifty six thousand, seven hundred and eighty nine",
    "two million, two thousand, two",
    "nine hundred and eighty million",
    "nine hundred and ninety nine sextillion, nine hundred and ninety nine quintillion, nine hundred and ninety nine quadrillion, nine hundred and ninety nine trillion, nine hundred and ninety nine billion, nine hundred and ninety nine million, nine hundred and ninety nine thousand, nine hundred and ninety nine",
    "fifty five",
    "one",
    "Number is not convertible",    //input must be between 1 and 999999999999999999999999 (24digits)
    "Number is not convertible",    //input can't be nagetive
    "Number is not convertible",    //input can't be longer than 24 digits
];


it('convert numbers', () => {
    const app = new App();
    for (let i = 0; i < testValues.length; i++) {
        expect(app.calcOutput(testValues[i])).toEqual(checkValues[i])
    }
});
