import { useEffect, useState } from "react";

const Slider = () => {
  const [length, setLenght] = useState(10);

  // sets the background size on load
  useEffect(() => {
    const input: HTMLInputElement | null = document.querySelector("#pwd-size");
    if (input) {
      setPercentage(input);
    }
  }, []);

  // changes value onChange + sets percentage for the new value
  function onChangeCurrentValue(event: React.ChangeEvent<HTMLInputElement>) {
    setLenght(parseInt(event.currentTarget.value));

    setPercentage(event.currentTarget);
  }

  // set percentage to the --background-size
  function setPercentage(input: HTMLInputElement) {
    input.style.setProperty("--background-size", `${getPercentage(input)}%`);
  }

  // calculate percentage
  function getPercentage(input: HTMLInputElement) {
    const min = +input.min || 1;
    const max = +input.max || 20;
    const value = +input.value;

    const size = ((value - min) / (max - min)) * 100;

    return size;
  }

  return (
    <div className="relative">
      <p className="absolute right-0 -top-8 text-2xl text-green font-bold">{length}</p>
      <input
        type="range"
        name="pwd-size"
        id="pwd-size"
        min={4}
        max={20}
        defaultValue={length}
        onChange={onChangeCurrentValue}
      />
    </div>
  );
};

export default Slider;
