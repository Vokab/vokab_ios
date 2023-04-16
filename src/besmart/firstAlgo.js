// ay return lezm'h tetna7a
export const wrapper = async myWordParam => {
  var wordToPlayWith = myWordParam;
  var arrayOfSuggestions = [];
  var globalIndex;
  var indexToUse;
  var toAddText;
  let arrayOfTheWordSplits = wordToPlayWith.split('');
  let arrayOfIndexs = [];
  for (let i = 0; i < wordToPlayWith.length; i++) {
    arrayOfIndexs[i] = i;
  }
  console.log('The Length Of the array =>', arrayOfTheWordSplits.length);
  var times = 0;
  const workWithArray = async wordToPlyWith => {
    if (wordToPlyWith.length >= 9) {
      const myIndex = await findGoodIndexByArray(arrayOfIndexs, 3);
      console.log(
        'DEBUGGING +-----+  =>',
        arrayOfIndexs,
        'globalIndex => ',
        globalIndex,
      );
      if (
        arrayOfIndexs[globalIndex + 1] === arrayOfIndexs[globalIndex] + 1 &&
        arrayOfIndexs[globalIndex + 2] === arrayOfIndexs[globalIndex] + 2
      ) {
        console.log('------------  Hi THERE WE ARE  -------------');
        console.log('Global Index => ', globalIndex);

        console.log(
          ' arrayOfIndexs of Global Index => ',
          arrayOfIndexs[globalIndex],
        );
        toAddText =
          arrayOfTheWordSplits[myIndex] +
          arrayOfTheWordSplits[myIndex + 1] +
          arrayOfTheWordSplits[myIndex + 2];
        indexToUse = myIndex;
        const arrayRemoved = arrayOfIndexs.splice(globalIndex, 3);
        console.log(
          'The final array of indexs after cutting is  => ',
          arrayOfIndexs,
        );
        console.log('The Array Removed now is  => ', arrayRemoved);
      } else if (
        globalIndex !== 0 &&
        arrayOfIndexs[globalIndex - 1] === arrayOfIndexs[globalIndex] - 1 &&
        arrayOfIndexs[globalIndex - 2] === arrayOfIndexs[globalIndex] - 2
      ) {
        console.log('------------ OHHH NOOO ------------- 50');
        console.log('Global Index => ', globalIndex);
        console.log(
          ' arrayOfIndexs of Global Index => ',
          arrayOfIndexs[globalIndex],
        );
        toAddText =
          arrayOfTheWordSplits[myIndex - 2] +
          arrayOfTheWordSplits[myIndex - 1] +
          arrayOfTheWordSplits[myIndex];
        indexToUse = myIndex - 1;
        const arrayRemoved = arrayOfIndexs.splice(globalIndex - 2, 3);
        console.log(
          'The final array of indexs after cutting is  => ',
          arrayOfIndexs,
        );
        console.log('The Array Removed now is  => ', arrayRemoved);
      } else {
        console.log('---- The Final One   => ');
        toAddText = arrayOfTheWordSplits[myIndex];
        indexToUse = myIndex;
        const arrayRemoved = arrayOfIndexs.splice(globalIndex, 1);
        console.log(
          'The final array of indexs after cutting is  => ',
          arrayOfIndexs,
        );
        console.log('The Array Removed now is  => ', arrayRemoved);
      }

      // toAddText =
      //   arrayOfTheWordSplits[myIndex] +
      //   arrayOfTheWordSplits[myIndex + 1] +
      //   arrayOfTheWordSplits[myIndex + 2];
      console.log('The suggest word choosed now is  => ', toAddText);
      let ourObject = {};
      ourObject.wordId = myIndex;
      ourObject.showOrNot = true;
      ourObject.word = toAddText;
      arrayOfSuggestions.push(ourObject);
      console.log(
        'The array of suggest words now is   => ',
        arrayOfSuggestions,
      );

      wordToPlyWith = wordToPlyWith
        .toLocaleLowerCase()
        .replace(toAddText.toLocaleLowerCase(), '');
    } else if (wordToPlyWith.length < 9) {
      const myIndex = await findGoodIndexByArray(arrayOfIndexs, 2);
      // check if the array of indexs has the next value of this index or pervious value else of this pick just this caracter of this index
      if (arrayOfIndexs[globalIndex + 1] === arrayOfIndexs[globalIndex] + 1) {
        console.log('------------  Hi THERE WE ARE  -------------');
        console.log('Global Index => ', globalIndex);

        console.log(
          ' arrayOfIndexs of Global Index => ',
          arrayOfIndexs[globalIndex],
        );
        toAddText =
          arrayOfTheWordSplits[myIndex] + arrayOfTheWordSplits[myIndex + 1];
        indexToUse = myIndex;
        const arrayRemoved = arrayOfIndexs.splice(globalIndex, 2);
        console.log(
          'The final array of indexs after cutting is  => ',
          arrayOfIndexs,
        );
        console.log('The Array Removed now is  => ', arrayRemoved);
      } else if (
        globalIndex !== 0 &&
        arrayOfIndexs[globalIndex - 1] === arrayOfIndexs[globalIndex] - 1
      ) {
        console.log('------------ OHHH NOOO -------------');
        console.log('Global Index => ', globalIndex);
        console.log(
          ' arrayOfIndexs of Global Index => ',
          arrayOfIndexs[globalIndex],
        );
        toAddText =
          arrayOfTheWordSplits[myIndex - 1] + arrayOfTheWordSplits[myIndex];
        indexToUse = myIndex - 1;
        const arrayRemoved = arrayOfIndexs.splice(globalIndex - 1, 2);
        console.log(
          'The final array of indexs after cutting is  => ',
          arrayOfIndexs,
        );
        console.log('The Array Removed now is  => ', arrayRemoved);
      } else {
        toAddText = arrayOfTheWordSplits[myIndex];
        indexToUse = myIndex;
        const arrayRemoved = arrayOfIndexs.splice(globalIndex, 1);
        console.log(
          'The final array of indexs after cutting is  => ',
          arrayOfIndexs,
        );
        console.log('The Array Removed now is  => ', arrayRemoved);
      }

      console.log('The suggest word choosed now is  => ', toAddText);
      let ourObject = {};
      ourObject.wordId = indexToUse;
      ourObject.showOrNot = true;
      ourObject.word = toAddText;
      arrayOfSuggestions.push(ourObject);
      console.log(
        'The array of suggest words now is   => ',
        arrayOfSuggestions,
      );

      wordToPlyWith = wordToPlyWith
        .toLocaleLowerCase()
        .replace(toAddText.toLocaleLowerCase(), '');

      times = times + 1;
    }
    // THE base case
    if (wordToPlyWith.length >= 2) {
      console.log('Recursion Start Here ------ ', wordToPlyWith);
      await workWithArray(wordToPlyWith);
    } else if (wordToPlyWith.length === 1) {
      console.log('--- YES We are in the final step  => ', arrayOfIndexs[0]);
      let ourObject = {};
      ourObject.wordId = arrayOfIndexs[0];
      ourObject.showOrNot = true;
      ourObject.word = wordToPlyWith;
      arrayOfSuggestions.push(ourObject);
      console.log(
        'The array of suggest words now is   => ',
        arrayOfSuggestions,
      );
      console.log('********** FINALL RETURN IS ****** ', arrayOfSuggestions);
      return arrayOfSuggestions;
    } else {
      console.log('---Doneeeeeeeeeee', wordToPlyWith);
      console.log('********** FINALL RETURN IS ****** ', arrayOfSuggestions);
      return arrayOfSuggestions;
    }
  };
  const findGoodIndexByArray = (array, n) => {
    console.log('DEBUGGING => array', array);
    let index = 0;
    if (array.length > 1) {
      index = Math.floor(Math.random() * (array.length - n));
      console.log('The Index choosed is => ', array[index]);
      globalIndex = index;
      console.log('DEBUGGING => globalIndex', globalIndex);
      return array[index];
    } else {
      console.log('The Index choosed is => ', array[0]);
      return array[0];
    }
  };
  await workWithArray(myWordParam);
  return arrayOfSuggestions;
};
