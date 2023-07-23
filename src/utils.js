export function random(minValue, maxValue, snapIncrement, returnFunction) {
  if (snapIncrement !== undefined && returnFunction !== undefined) {
    const range = maxValue - minValue;
    const randomFunction = () => {
      const randomNumber =
        minValue +
        Math.floor(Math.random() * (range / snapIncrement)) * snapIncrement;
      return randomNumber;
    };
    return returnFunction ? randomFunction : randomFunction();
  } else if (snapIncrement !== undefined) {
    const range = maxValue - minValue;
    const randomNumber =
      minValue +
      Math.floor(Math.random() * (range / snapIncrement)) * snapIncrement;
    return randomNumber;
  } else if (returnFunction !== undefined) {
    const range = maxValue - minValue;
    const randomFunction = () => {
      const randomNumber = minValue + Math.random() * range;
      return randomNumber;
    };
    return returnFunction ? randomFunction : randomFunction();
  } else {
    const range = maxValue - minValue;
    const randomNumber = minValue + Math.random() * range;
    return randomNumber;
  }
}
