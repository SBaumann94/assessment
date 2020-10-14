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
    if (value[0] === '0') {
      value = value.slice(1, value.length)
    }
    const message = value.slice(0, maxLength);
    event.target.value = message;


    if (value.length > maxLength) {
      this.setState({ error: 'The maximum length of input is ' + maxLength + ' digits', output: '' })
    } else {
      this.setState({ input: message, error: '' })
    }
  }

  convertToWord(x) {
    const n = ('0'.repeat(maxLength) + x).substr(-maxLength).match(/^(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})$/); let str = '';
    for (let i = 1; i < maxLength / 3 + 1; i++) {
      const tmp = (n[i][1] + n[i][2]);
      str += (str !== '' && str[str.length - 2] !== ',') ? ', ' : '';
      str += (n[i][0] !== '0') ? (a[Number(n[i][0])] + 'hundred ' + ((tmp !== '00') ? 'and ' : '')) : '';
      str += (tmp !== '00') ?
        ((tmp[0] !== '1') ?
          (b[n[i][1]] + ' ' + a[n[i][2]]) + c[i] :
          (a[Number(tmp)] + c[i]))
        : ((n[i][0] !== '0') ? c[i] :
          '');
    }
    str = str.replace(/,\s*$/, '').trim();
    //if there is only 1 writable digit in any of the 3digit group (like in 2002002) we need to trim the unnecesary spaces
    str = str.replace(/ {2}/g, ' ')
    return str
  }

  convertClicked = () => {
    this.calcOutput(this.state.input)
  }
  calcOutput(num) {
    //Adding some visualization to the number
    let practicleNumber = 1
    const test = (process.env.JEST_WORKER_ID !== undefined)
    if (num.length > 0 && num.length <= maxLength && parseFloat(num) > 0) {
      const tmp = (num.length - 1) * 5 + parseInt(num[0]) / 2
      practicleNumber = Math.min(tmp, 100)
      //since we have a convertible number, we update the state with the words

      const ret = this.convertToWord(num)
      //setting up state if not in testing conditions
      if (!test) {
        this.setState({ output: ret, practicles: practicleNumber, error: '' })
      }
      return ret;
    } else {
      const ret = 'Number is not convertible'
      if (!test) {
        this.setState({ output: '', practicles: practicleNumber, error: ret })
      }
      return ret;
    }
  }

  render() {
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
        <Particles params={particleOptions}
          className='particles' />
        <div className='center'>
          <h1>Number to words converter</h1>
        </div>
        <div className='center'>
          <input onChange={this.handleChangeInput}
            //the below line is neccesary to prevent unwanted characters in the input
            onKeyDown={(evt) => invalidInput.includes(evt.key) && evt.preventDefault()}
            //I also disabled pasting to prevent errors
            onPaste={(evt) => evt.preventDefault()}
            id='input' className='inputField darkBG' type='number' min='1' max={'9'.repeat(maxLength)} />
          <button className='darkBG' id='submitButton' onClick={this.convertClicked}>Convert</button>
        </div>
        {/* <div className='center'>
          <button className='center darkBG' id='testButton' onClick={this.test}>Test</button>
        </div> */}
        <div className={validOutput}>
          <h2 id='output center'>{this.state.error}{this.state.output}</h2>
        </div>
      </div>
    );
  }
}

export default App;