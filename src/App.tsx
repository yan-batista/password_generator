import { useEffect, useState } from "react";
import Slider from "./Components/Slider";
import "./styles/index.css";

import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

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

enum Strength {
  TOO_WEAK = "too_weak",
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
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
  const [strength, setStrength] = useState<Strength | null>(null);

  useEffect(() => {
    if (generatedPassword) {
      const result = zxcvbn(generatedPassword);
      if (result.score <= 1) {
        setStrength(Strength.TOO_WEAK);
      } else if (result.score === 2) {
        setStrength(Strength.WEAK);
      } else if (result.score === 3) {
        setStrength(Strength.MEDIUM);
      } else if (result.score === 4) {
        setStrength(Strength.STRONG);
      }
    }
  }, [generatedPassword]);

  function getPasswordStrengthStyle(): string {
    if (strength === Strength.TOO_WEAK) {
      return "border-red bg-red";
    } else if (strength === Strength.WEAK) {
      return "border-orange bg-orange";
    } else if (strength === Strength.MEDIUM) {
      return "border-yellow bg-yellow";
    } else if (strength === Strength.STRONG) {
      return "border-green bg-green";
    } else {
      return "";
    }
  }

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

  // checks which option is selected, and the amount selected
  function getCheckedConfigState(): [CheckboxTypes[], number] {
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
    <div className=" flex-col flex items-center gap-4 md:gap-6 md:w-[35rem]">
      <p className="text-title font-bold md:text-2xl">Password Generator</p>

      <div className="bg-container px-2 py-4 w-full text-lg font-bold flex flex-row items-center justify-between relative">
        <input
          type="text"
          name="generated_password"
          readOnly
          placeholder="P4$5W0rD!"
          id="generated_password"
          className="bg-transparent placeholder:text-placeholder placeholder:text-2xl md:text-2xl max-w-[90%] border-0 focus:ring-0"
          defaultValue={generatedPassword}
        />
        <p className="uppercase text-green absolute right-10 hidden select-none" id="copied_to_clipboard_text">
          Copied!
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-green cursor-pointer" onClick={copyToClipboard}>
          <path d="M20.341 3.091 17.909.659A2.25 2.25 0 0 0 16.319 0H8.25A2.25 2.25 0 0 0 6 2.25V4.5H2.25A2.25 2.25 0 0 0 0 6.75v15A2.25 2.25 0 0 0 2.25 24h10.5A2.25 2.25 0 0 0 15 21.75V19.5h3.75A2.25 2.25 0 0 0 21 17.25V4.682a2.25 2.25 0 0 0-.659-1.591ZM12.469 21.75H2.53a.281.281 0 0 1-.281-.281V7.03a.281.281 0 0 1 .281-.281H6v10.5a2.25 2.25 0 0 0 2.25 2.25h4.5v1.969a.282.282 0 0 1-.281.281Zm6-4.5H8.53a.281.281 0 0 1-.281-.281V2.53a.281.281 0 0 1 .281-.281H13.5v4.125c0 .621.504 1.125 1.125 1.125h4.125v9.469a.282.282 0 0 1-.281.281Zm.281-12h-3v-3h.451c.075 0 .147.03.2.082L18.667 4.6a.283.283 0 0 1 .082.199v.451Z" />
        </svg>
      </div>

      <div className="w-full bg-container p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <label className="font-bold md:text-xl">Character Length</label>
          <Slider length={pwdConfig.length} changeSliderValue={changeSliderValue} />
        </div>

        <div className="mt-4 flex flex-col gap-4 font-bold text-sm xs:text-base md:text-lg">
          <div className="flex flex-row items-center gap-4">
            <input
              type="checkbox"
              id="pwd-uppercase"
              name="pwd-uppercase"
              value="uppercase"
              className="w-5 h-5 cursor-pointer bg-transparent border-2 border-paragraph focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
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
              className="w-5 h-5 cursor-pointer bg-transparent border-2 border-paragraph focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
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
              className="w-5 h-5 cursor-pointer bg-transparent border-2 border-paragraph focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
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
              className="w-5 h-5 cursor-pointer bg-transparent border-2 border-paragraph focus:border-transparent focus:bg-gray-200 text-green focus:ring-0 focus:ring-offset-0"
              onChange={() => changeCheckboxInputValue(CheckboxTypes.SYMBOLS)}
            />
            <label htmlFor="pwd-symbols">Include Symbols</label>
          </div>

          {checkboxErrorMessageVisible && (
            <p className="text-red w-full flex flex-row justify-center text-sm md:text-base">
              Please select a checkbox above
            </p>
          )}
        </div>

        <div className="bg-bg px-2 py-4 md:px-8 md:p-6 mt-4 md:mt-6 flex flex-row items-center justify-between">
          <p className="uppercase text-title font-bold">Strength</p>
          <div className="flex flex-row items-center gap-2">
            {strength && <p className="uppercase md:text-lg font-bold md:pr-2">{strength.replace("_", " ")}!</p>}
            <div className={`border-2 w-[10px] h-[28px] ${getPasswordStrengthStyle()}`}></div>
            <div
              className={`border-2 w-[10px] h-[28px] ${
                strength !== Strength.TOO_WEAK ? getPasswordStrengthStyle() : ""
              }`}
            ></div>
            <div
              className={`border-2 w-[10px] h-[28px] ${
                strength === Strength.MEDIUM || strength === Strength.STRONG ? getPasswordStrengthStyle() : ""
              }`}
            ></div>
            <div
              className={`border-2 w-[10px] h-[28px] ${strength === Strength.STRONG ? getPasswordStrengthStyle() : ""}`}
            ></div>
          </div>
        </div>

        <button
          className="uppercase bg-green border border-green text-bg w-full mt-4 md:mt-6 mb-2 py-4 font-bold flex flex-row justify-center items-center gap-2 hover:bg-transparent hover:text-green md:text-lg"
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
