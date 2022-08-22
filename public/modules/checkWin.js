let count = 0;

export function checkWin(playerChoices) {
  //set up our array of directions that we need to cycle through
  const directions = [
    "left",
    "right",
    "up",
    "down",
    "leftUpDiag",
    "leftDownDiag",
    "rightUpDiag",
    "rightDownDiag",
  ];
  //we cycle through each point on the players choice array

  playerChoices.forEach((elem) => {
    //and go off in every direction from each of those start points
    directions.forEach((directionElem) => {
      //reset the count to zero so that it only goes in straight lines
      count = 0;
      //this function checks an adjacent square in the passed direction and continues off in
      //that direction until it returns false or the count increases
      checkNext(elem, directionElem, playerChoices, 100);
    });
  });
}

function checkNext(startPoint, direction, playerChoice, squareParams) {
  //we check if the count has reach 3 and exit the recursive loop if it has
  if (count === 3) return alert("WE HAVE A WINNER");
  //we set up the next point.  We must add in the {center:} as the part of the object
  //so that it can be easily inserted back into the format of the function
  let nextPoint = { center: {} };
  //we set a switch statement for all the different directions.  For each center point of
  //our starting point we add an x or a y value to get it over to the adjacent square
  switch (direction) {
    case "up":
      nextPoint.center = {
        x: startPoint.center.x,
        y: startPoint.center.y - squareParams,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;
    //add y and no x
    case "down":
      nextPoint.center = {
        x: startPoint.center.x,
        y: startPoint.center.y + squareParams,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;
    //add x and no y

    case "right":
      nextPoint.center = {
        x: startPoint.center.x + squareParams,
        y: startPoint.center.y,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;
    //subtract x and no y
    case "left":
      nextPoint.center = {
        x: startPoint.center.x - squareParams,
        y: startPoint.center.y,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;
    //subtract x and y to get to the next point diagonally up to the left
    case "leftUpDiag":
      nextPoint.center = {
        x: startPoint.center.x - squareParams,
        y: startPoint.center.y - squareParams,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;
    //subtract x and no y
    case "leftDownDiag":
      nextPoint.center = {
        x: startPoint.center.x - squareParams,
        y: startPoint.center.y + squareParams,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;
    //add x and subtract y
    case "rightUpDiag":
      nextPoint.center = {
        x: startPoint.center.x + squareParams,
        y: startPoint.center.y - squareParams,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;
    //add x and add y
    case "rightDownDiag":
      nextPoint.center = {
        x: startPoint.center.x + squareParams,
        y: startPoint.center.y + squareParams,
      };
      checkIsInArray(playerChoice, nextPoint, direction, squareParams);
      break;

    default:
      return (count = 0);
  }
}

function checkIsInArray(playerChoice, nextPoint, direction, squareParams) {
  //if that adjacent square happens to be part of the player choice array we can re-call
  //the checkNext function which we continue to pass the direction to.
  if (
    playerChoice.find(
      (playerElem) =>
        playerElem.center.x === nextPoint.center.x &&
        playerElem.center.y === nextPoint.center.y
    )
  ) {
    //if part of the array we add to count

    count++;

    //call check next function recursively
    checkNext(nextPoint, direction, playerChoice, squareParams);
  } else count = 0;
}
