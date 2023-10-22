import { useState } from "react";
import Slider from "./Components/Slider";
import "./styles/index.css";

interface PasswordConfigData {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

enum CheckboxTypes {
  UPPERCASE = "uppercase",
  LOWERCASE = "lowercase",
  NUMBERS = "numbers",
  SYMBOLS = "symbols",
}

function App() {
  const [pwdConfig, setPwdConfig] = useState<PasswordConfigData>({
    length: 8,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
  });
  const [checkboxErrorMessageVisible, setCheckboxErrorMessageVisible] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  function changeCheckboxInputValue(name: CheckboxTypes) {
    if (name === CheckboxTypes.UPPERCASE) {
      setPwdConfig((prevState) => ({ ...prevState, uppercase: !prevState.uppercase }));
    } else if (name === CheckboxTypes.LOWERCASE) {
      setPwdConfig((prevState) => ({ ...prevState, lowercase: !prevState.lowercase }));
    } else if (name === CheckboxTypes.NUMBERS) {
      setPwdConfig((prevState) => ({ ...prevState, numbers: !prevState.numbers }));
    } else if (name === CheckboxTypes.SYMBOLS) {
      setPwdConfig((prevState) => ({ ...prevState, symbols: !prevState.symbols }));
    }
  }

  function changeSliderValue(value: number) {
    setPwdConfig((prevState) => ({ ...prevState, length: value }));
  }

  function generatePassword() {
    // checks which option is selected, and the amount selected
    const getCheckedConfigState = (): [CheckboxTypes[], number] => {
      let checked = [];
      if (pwdConfig.uppercase) {
        checked.push(CheckboxTypes.UPPERCASE);
      }
      if (pwdConfig.lowercase) {
        checked.push(CheckboxTypes.LOWERCASE);
      }
      if (pwdConfig.numbers) {
        checked.push(CheckboxTypes.NUMBERS);
      }
      if (pwdConfig.symbols) {
        checked.push(CheckboxTypes.SYMBOLS);
      }

      return [checked, checked.length];
    };

    // generate a random integer from min to max
    const randomIntFromInterval = (max: number, min: number) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // add one character from an array, then checks if and how many others can be added
    const addCharacters = (charactersArray: string[]) => {
      let password = "";
      password += charactersArray[randomIntFromInterval(0, charactersArray.length)];
      if (availableLength > 0) {
        let increase = amount > 1 ? randomIntFromInterval(0, availableLength) : availableLength;
        amount--;
        availableLength -= increase;
        while (increase > 0) {
          password += charactersArray[randomIntFromInterval(0, charactersArray.length)];
          increase--;
        }
      }

      return password;
    };

    // shuffle password
    const shufflePassword = (password: string): string => {
      let passwordArray = password.split("");
      for (let i = passwordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = passwordArray[i];
        passwordArray[i] = passwordArray[j];
        passwordArray[j] = temp;
      }
      return passwordArray.join("");
    };

    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz".split("");
    const numbers = "0123456789".split("");
    const symbols = "!@#$%^&*()?/-+".split("");

    let [checked, amount] = getCheckedConfigState();
    let availableLength = pwdConfig.length - amount;
    let password = "";

    if (checked.includes(CheckboxTypes.UPPERCASE)) {
      password += addCharacters(uppercaseLetters);
    }
    if (checked.includes(CheckboxTypes.LOWERCASE)) {
      password += addCharacters(lowercaseLetters);
    }
    if (checked.includes(CheckboxTypes.NUMBERS)) {
      password += addCharacters(numbers);
    }
    if (checked.includes(CheckboxTypes.SYMBOLS)) {
      password += addCharacters(symbols);
    }

    setGeneratedPassword(shufflePassword(password));
  }

  // display the checkbox error message in case no checkbox is checked
  function displayCheckboxErrorMessage() {
    if (pwdConfig.uppercase || pwdConfig.lowercase || pwdConfig.numbers || pwdConfig.symbols) {
      setCheckboxErrorMessageVisible(false);
    } else {
      setCheckboxErrorMessageVisible(true);
    }
  }

  // copy password to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(generatedPassword);

    const copiedText: HTMLParagraphElement | null = document.querySelector("#copied_to_clipboard_text");
    if (copiedText) {
      copiedText.classList.remove("animate-fadeOut");
      copiedText.classList.remove("hidden");
      // redraw element
      void copiedText.offsetWidth;
      copiedText.classList.add("animate-fadeOut");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-title font-bold">Password Generator</p>

      <div className="bg-container px-2 py-4 w-full text-lg font-bold flex flex-row items-center justify-between">
        <input
          type="text"
          name="generated_password"
          readOnly
          placeholder="P4$5W0rD!"
          id="generated_password"
          className="bg-transparent outline-none placeholder:text-placeholder max-w-[90%] border-0"
          defaultValue={generatedPassword}
        />
        <p className="uppercase text-green absolute right-14 hidden" id="copied_to_clipboard_text">
          Copied!
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-green" onClick={copyToClipboard}>
          <path d="M20.341 3.091 17.909.659A2.25 2.25 0 0 0 16.319 0H8.25A2.25 2.25 0 0 0 6 2.25V4.5H2.25A2.25 2.25 0 0 0 0 6.75v15A2.25 2.25 0 0 0 2.25 24h10.5A2.25 2.25 0 0 0 15 21.75V19.5h3.75A2.25 2.25 0 0 0 21 17.25V4.682a2.25 2.25 0 0 0-.659-1.591ZM12.469 21.75H2.53a.281.281 0 0 1-.281-.281V7.03a.281.281 0 0 1 .281-.281H6v10.5a2.25 2.25 0 0 0 2.25 2.25h4.5v1.969a.282.282 0 0 1-.281.281Zm6-4.5H8.53a.281.281 0 0 1-.281-.281V2.53a.281.281 0 0 1 .281-.281H13.5v4.125c0 .621.504 1.125 1.125 1.125h4.125v9.469a.282.282 0 0 1-.281.281Zm.281-12h-3v-3h.451c.075 0 .147.03.2.082L18.667 4.6a.283.283 0 0 1 .082.199v.451Z" />
        </svg>
      </div>

      <div className="w-full bg-container px-2 py-2">
        <div className="flex flex-col gap-4">
          <label>Character Length</label>
          <Slider length={pwdConfig.length} changeSliderValue={changeSliderValue} />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-row items-center gap-4">
            <input
              type="checkbox"
              id="pwd-uppercase"
              name="pwd-uppercase"
              value="uppercase"
              className="rounded-sm cursor-pointer bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
              onChange={() => changeCheckboxInputValue(CheckboxTypes.UPPERCASE)}
            />
            <label htmlFor="pwd-uppercase">Include Uppercase Letters</label>
          </div>

          <div className="flex flex-row items-center gap-4">
            <input
              type="checkbox"
              id="pwd-lowercase"
              name="pwd-lowercase"
              value="lowercase"
              className="rounded-sm cursor-pointer bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
              onChange={() => changeCheckboxInputValue(CheckboxTypes.LOWERCASE)}
            />
            <label htmlFor="pwd-lowercase">Include Lowercase Letters</label>
          </div>

          <div className="flex flex-row items-center gap-4">
            <input
              type="checkbox"
              id="pwd-numbers"
              name="pwd-numbers"
              value="numbers"
              className="rounded-sm cursor-pointer bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
              onChange={() => changeCheckboxInputValue(CheckboxTypes.NUMBERS)}
            />
            <label htmlFor="pwd-numbers">Include Numbers</label>
          </div>

          <div className="flex flex-row items-center gap-4">
            <input
              type="checkbox"
              id="pwd-symbols"
              name="pwd-symbols"
              value="symbols"
              className="rounded-sm cursor-pointer bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
              onChange={() => changeCheckboxInputValue(CheckboxTypes.SYMBOLS)}
            />
            <label htmlFor="pwd-symbols">Include Symbols</label>
          </div>

          {checkboxErrorMessageVisible && (
            <p className="text-red w-full flex flex-row justify-center text-sm">Please select a checkbox above</p>
          )}
        </div>

        <div className="bg-bg px-2 py-4 mt-4 flex flex-row items-center justify-between">
          <p className="uppercase text-title font-bold">Strength</p>
          <div className="flex flex-row items-center gap-2">
            <p className="uppercase">Too Weak!</p>
            <div className="border w-[10px] h-[28px]"></div>
            <div className="border w-[10px] h-[28px]"></div>
            <div className="border w-[10px] h-[28px]"></div>
            <div className="border w-[10px] h-[28px]"></div>
          </div>
        </div>

        <button
          className="uppercase bg-green border border-green text-bg w-full mt-4 mb-2 py-4 font-bold flex flex-row justify-center items-center gap-2 hover:bg-transparent hover:text-green"
          onClick={() => {
            displayCheckboxErrorMessage();
            generatePassword();
          }}
        >
          Generate
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
