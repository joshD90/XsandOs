export function checkWin(playerChoices) {
  //we use each element as a starting point
  playerChoices.forEach((elem, index) => {
    //for each element we compare this against all other elements in the array
    for (let i = index + 1; i < playerChoices.length; i++) {
      //we dont need to check the same point against itself
      if (i !== index) {
        console.log(i, "i");
        const xDiff = elem.center.x - playerChoices[i].center.x;
        const yDiff = elem.center.y - playerChoices[i].center.y;
        //avoid division by zero, this will have to be handled in an exeption
        if (xDiff !== 0) {
          //set our angle between the first iteration y / x
          const angle1 = yDiff / xDiff;

          //now for each second element we need to compare against all the rest to see if angles are same
          for (let x = i + 1; x < playerChoices.length; x++) {
            console.log(x);
            //no need to compare against ourself or against the one we just checked
            if (x !== index && x !== i) {
              console.log(x, "after if");
              const xDiff2 = elem.center.x - playerChoices[i].center.x;
              const yDiff2 = elem.center.y - playerChoices[i].center.y;
              //avoid division by 0
              if (x !== 0) {
                const angle2 = yDiff2 / xDiff2;
                console.log("YAY THIS IS A WIN", angle2);
                //if the angle between the first line and the second line are the same then they must be on the same line
                if (angle2 === angle1) return;
              }
            }
          }
        }
      }
    }
    console.log("forEach Loop finsihed");
  });
}

export function niceWin(playerChoices) {
  let angleArray = [];
  playerChoices.forEach((elem, index) => {
    for (let i = 0; i < playerChoices.length; i++) {
      if (i !== index) {
        const xDiff = elem.center.x - playerChoices[i].center.x;
        const yDiff = elem.center.y - playerChoices[i].center.y;
        const radians = Math.atan(yDiff, xDiff);
        const degrees = radians * (180 / Math.PI) + 180;
        angleArray.push(degrees);
      }
    }
  });
  console.log(angleArray);
}

//in this attempt we will take each element of the player's choice and
//go through every direction to see whether that also contains a square
//belonging to the player array.  if it is does then continue on in that
//direction
export function sussWin(playerChoices) {
  const directions = ["up", "down", "left", "right"];
  playerChoices.forEach((elem) => {
    let count = 0;
    directions.forEach((directionElem) => {
      const result = checkNext(elem, directionElem, 100);

      if (
        playerChoices.find(
          (e) =>
            e.center.x === result.center.x && e.center.y === result.center.y
        )
      ) {
        if (count === 3) return console.log("You have Won!");
        checkNext(result, directionElem, 100);
        count++;
      }
    });
  });
}

function checkNext(startPoint, direction, width) {
  let nextPoint = {};
  switch (direction) {
    case "right":
      nextPoint.center = {
        x: startPoint.center.x + width,
        y: startPoint.center.y,
      };
      return nextPoint;
    case "left":
      nextPoint.center = {
        x: startPoint.center.x - width,
        y: startPoint.center.y,
      };
      return nextPoint;
    case "up":
      nextPoint.center = {
        x: startPoint.center.x,
        y: startPoint.center.y - width,
      };
      return nextPoint;
    case "down":
      nextPoint.center = {
        x: startPoint.center.x,
        y: startPoint.center.y + width,
      };
      return nextPoint;
  }
}

let count = 0;

export function dummyFunc(playerChoices) {
  const directions = ["left", "right", "up", "down"];
  //do a forEach for each direction from start point.
  playerChoices.forEach((elem) => {
    directions.forEach((directionElem) => {
      count = 0;
      dummyRecursionFunc(elem, directionElem, playerChoices, 100);
    });
  });
  //call this other function - pass direction into it
}

function dummyRecursionFunc(startPoint, direction, playerChoice, squareParams) {
  if (count === 3) return console.log("WE HAVE A WINNER");
  let nextPoint = { center: {} };
  switch (direction) {
    case "up":
      nextPoint.center = {
        x: startPoint.center.x,
        y: startPoint.center.y - squareParams,
      };
      if (
        playerChoice.find(
          (elem) =>
            elem.center.x === nextPoint.center.x &&
            elem.center.y === nextPoint.center.y
        )
      ) {
        count++;
        console.log(count);
        dummyRecursionFunc(nextPoint, direction, playerChoice, squareParams);
      }
      break;
    case "down":
      nextPoint.center = {
        x: startPoint.center.x,
        y: startPoint.center.y + squareParams,
      };
      if (
        playerChoice.find(
          (elem) =>
            elem.center.x === nextPoint.center.x &&
            elem.center.y === nextPoint.center.y
        )
      ) {
        count++;
        console.log(count);
        dummyRecursionFunc(nextPoint, direction, playerChoice, squareParams);
      }
      break;
    case "right":
      nextPoint.center = {
        x: startPoint.center.x + squareParams,
        y: startPoint.center.y,
      };
      if (
        playerChoice.find(
          (elem) =>
            elem.center.x === nextPoint.center.x &&
            elem.center.y === nextPoint.center.y
        )
      ) {
        count++;
        console.log(count);
        dummyRecursionFunc(nextPoint, direction, playerChoice, squareParams);
      }
      break;
    case "left":
      nextPoint.center = {
        x: startPoint.center.x - squareParams,
        y: startPoint.center.y,
      };
      if (
        playerChoice.find(
          (elem) =>
            elem.center.x === nextPoint.center.x &&
            elem.center.y === nextPoint.center.y
        )
      ) {
        count++;
        console.log(count);
        dummyRecursionFunc(nextPoint, direction, playerChoice, squareParams);
      }
      break;

    default:
      return (count = 0);
  }

  //   if ("this direction") {
  //     ("add subtract etc");
  //     ("then if this is contained within the player choice array");
  //     ("count++");
  //     ("return dummyRecursion(direction)");
  //   }
}
