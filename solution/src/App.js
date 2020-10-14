import React, { Component } from 'react';
import Particles from 'react-particles-js';

//used to resctrict the input field
const maxLength = 24    //change the regex function in convertToWord() function, and the 'c' array if you change this number
const invalidInput = ['-', '.', 'e']

//used for conversion
const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const c = ['', 'sextillion', 'quintillion', 'quadrillion', 'trillion', 'billion', 'million', 'thousand', '']

class App extends Component {
  constructor() {
    super()
    this.calcOutput = this.calcOutput.bind(this)
    this.state = {
      input: 0,
      error: '',
      output: '',
      practicles: 1
    };
  }
  componentDidCatch(error, info) {
    this.setState({ error: 'It seems we ran into an error: ' + error.toString(), output: '' })
  }

  handleChangeInput = event => {
    let value = event.target.value;

    //input can't start with 0
    if (value[0] === '0') {
      value = value.slice(1, value.length)
    }

    //trimming last digits if input is longer than maxLength
    const message = value.slice(0, maxLength);
    event.target.value = message;

    //storing value if it's format is valid
    if (value.length > maxLength) {
      this.setState({ error: 'The maximum length of input is ' + maxLength + ' digits', output: '' })
    } else {
      this.setState({ input: message, error: '' })
    }
  }

  convertToWord(x) {
    const n = ('0'.repeat(maxLength) + x).substr(-maxLength).match(/^(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})$/); let str = '';
    //first we convert each block
    //---------------------------------------------------------------------------------------------------------------------
    for (let i = 1; i < maxLength / 3 + 1; i++) {
      //
      const secondAndThird = (n[i][1] + n[i][2]);
      //putting commas between 3 digit values
      str += (str !== '' && str[str.length - 2] !== ',') ? ', ' : '';

      //converting first digit of the 3 digit block
      str += (n[i][0] !== '0') ? (a[(n[i][0])] + 'hundred ' + ((secondAndThird !== '00') ? 'and ' : '')) : '';
      //converting second and third digit of the 3 digit block
      str += (secondAndThird !== '00') ?
        ((secondAndThird[0] !== '1') ?
          //if secondAndThird >= 20 
          (b[secondAndThird[0]] + ' ' + a[secondAndThird[1]]) + c[i] :
          //else add the number (from 1 to 19)
          (a[(secondAndThird)] + c[i]))
        : ((n[i][0] !== '0') ? c[i] :
          '');
    }
    //then we check if the blocks are correctly patched together
    //---------------------------------------------------------------------------------------------------------------------    
    //removing unnecessary commas between blocks
    str = str.replace(/,\s*$/, '').trim();
    //if in any of the 3 digit blocks secondAndThird < 10 remove the extra space between the 0 which is not displayed in words, and the last digit
    str = str.replace(/ {2}/g, ' ')
    return str
  }

  convertClicked = () => {
    this.calcOutput(this.state.input)
  }

  calcOutput(num) {
    //Adding some visualization to the number value
    let practicleNumber = 1
    //In test cases we don't bother with changing states
    const test = (process.env.JEST_WORKER_ID !== undefined)

    if (num.length > 0 && num.length <= maxLength && parseFloat(num) > 0) {
      //visualizing the greatness of the number
      practicleNumber = Math.min((num.length - 1) * 5 + (num[0]) / 2, 100)

      //since we have a convertible number, we update the state with the words
      const ret = this.convertToWord(num)

      if (!test) {
        this.setState({ output: ret, practicles: practicleNumber, error: '' })
      }
      return ret;
    } else {
      //if the number is not convertible: out of range/ not a number / number is in scientific format 
      const ret = 'Number is not convertible'
      if (!test) {
        this.setState({ output: '', practicles: practicleNumber, error: ret })
      }
      return ret;
    }
  }

  render() {
    //if there is no error or output to display, we hide the output div
    const validOutput = 'center outputBox ' + ((this.state.error || this.state.output) ? 'visible' : 'hidden')
    //connecting state to Particles
    const particleOptions = {
      particles: {
        size: {
          value: 8,
          random: true,
        },
        line_linked: {
          color: '#00ff00',
          opacity: 1,
        },
        number: {
          value: this.state.practicles,
          density: {
            enable: true,
            value_area: 200
          }
        }
      }
    }
    return (
      <div>
        <Particles params={particleOptions} className='particles' />
        <div className='center'>
          <h1>Number to words converter</h1>
        </div>
        <div className='center'>
          <input onChange={this.handleChangeInput}
            //the below line is neccesary to prevent unwanted characters in the input
            onKeyDown={(evt) => invalidInput.includes(evt.key) && evt.preventDefault()}
            //I also disabled pasting
            onPaste={(evt) => evt.preventDefault()}
            id='input' className='inputField darkBG' type='number' min='1' max={'9'.repeat(maxLength)} />
          <button className='darkBG' id='submitButton' onClick={this.convertClicked}>Convert</button>
        </div>
        <div className={validOutput}>
          <h2 id='output center'>{this.state.error}{this.state.output}</h2>
        </div>
      </div>
    );
  }
}

export default App;