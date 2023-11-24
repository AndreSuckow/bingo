// exporta funcão bingo para ser usada em outros módulos
export const bingo = (amount) => {
  // debugger;
  let numbers = [];
  let riffledNumbers = [];

  for (let i = 1; i <= amount; i++) numbers.push(i); // preenche a quantidade de números do bingo

  function generateRandomInteger(max) {
    return Math.floor(Math.random() * max);
  }

  let BallsDrawnNotFinished = true;
  let counter = 0;

  while (BallsDrawnNotFinished) {
    let riffled = generateRandomInteger(numbers.length);
    riffledNumbers.push(numbers[riffled]);

    numbers.splice(riffled, 1);
    BallsDrawnNotFinished = riffledNumbers.length >= amount ? false : true;

    counter++;
  }
  console.log("%cJogo iniciado!", "color: blue;");
  console.log(`%cBolas sorteadas: ${counter}.`, "color: green;");
  return riffledNumbers;
};

export const createCartela = (amount, cartelas) => {
  let numbers;
  let cartela;

  do {
    numbers = [];
    cartela = [];

    for (let i = 1; i <= amount; i++) numbers.push(i);

    function generateRandomInteger(max) {
      return Math.floor(Math.random() * max);
    }

    let cartelaAmount;
    switch (generateRandomInteger(3)) {
      case 0:
        cartelaAmount = 16;
        break;
      case 1:
        cartelaAmount = 17;
        break;
      case 2:
        cartelaAmount = 18;
        break;
    }

    for (let i = 1; i <= cartelaAmount; i++) {
      let riffled = generateRandomInteger(numbers.length);
      cartela.push(numbers[riffled]);
      numbers.splice(riffled, 1);
    }
  } while (typeof cartelas.find((el) => el == cartela) == undefined);

  return cartela;
};
