// export function checkWin(playerChoices) {
//   //we use each element as a starting point
//   playerChoices.forEach((elem, index) => {
//     //for each element we compare this against all other elements in the array
//     for (let i = index + 1; i < playerChoices.length; i++) {
//       //we dont need to check the same point against itself
//       if (i !== index) {
//         console.log(i, "i");
//         const xDiff = elem.center.x - playerChoices[i].center.x;
//         const yDiff = elem.center.y - playerChoices[i].center.y;
//         //avoid division by zero, this will have to be handled in an exeption
//         if (xDiff !== 0) {
//           //set our angle between the first iteration y / x
//           const angle1 = yDiff / xDiff;

//           //now for each second element we need to compare against all the rest to see if angles are same
//           for (let x = i + 1; x < playerChoices.length; x++) {
//             console.log(x);
//             //no need to compare against ourself or against the one we just checked
//             if (x !== index && x !== i) {
//               console.log(x, "after if");
//               const xDiff2 = elem.center.x - playerChoices[i].center.x;
//               const yDiff2 = elem.center.y - playerChoices[i].center.y;
//               //avoid division by 0
//               if (x !== 0) {
//                 const angle2 = yDiff2 / xDiff2;
//                 console.log("YAY THIS IS A WIN", angle2);
//                 //if the angle between the first line and the second line are the same then they must be on the same line
//                 if (angle2 === angle1) return;
//               }
//             }
//           }
//         }
//       }
//     }
//     console.log("forEach Loop finsihed");
//   });
// }

// export function niceWin(playerChoices) {
//   let angleArray = [];
//   playerChoices.forEach((elem, index) => {
//     for (let i = 0; i < playerChoices.length; i++) {
//       if (i !== index) {
//         const xDiff = elem.center.x - playerChoices[i].center.x;
//         const yDiff = elem.center.y - playerChoices[i].center.y;
//         const radians = Math.atan(yDiff, xDiff);
//         const degrees = radians * (180 / Math.PI) + 180;
//         angleArray.push(degrees);
//       }
//     }
//   });
//   console.log(angleArray);
// }

// //in this attempt we will take each element of the player's choice and
// //go through every direction to see whether that also contains a square
// //belonging to the player array.  if it is does then continue on in that
// //direction
// export function sussWin(playerChoices) {
//   const directions = ["up", "down", "left", "right"];
//   playerChoices.forEach((elem) => {
//     let count = 0;
//     directions.forEach((directionElem) => {
//       const result = checkNext(elem, directionElem, 100);

//       if (
//         playerChoices.find(
//           (e) =>
//             e.center.x === result.center.x && e.center.y === result.center.y
//         )
//       ) {
//         if (count === 3) return console.log("You have Won!");
//         checkNext(result, directionElem, 100);
//         count++;
//       }
//     });
//   });
// }

// function checkNext(startPoint, direction, width) {
//   let nextPoint = {};
//   switch (direction) {
//     case "right":
//       nextPoint.center = {
//         x: startPoint.center.x + width,
//         y: startPoint.center.y,
//       };
//       return nextPoint;
//     case "left":
//       nextPoint.center = {
//         x: startPoint.center.x - width,
//         y: startPoint.center.y,
//       };
//       return nextPoint;
//     case "up":
//       nextPoint.center = {
//         x: startPoint.center.x,
//         y: startPoint.center.y - width,
//       };
//       return nextPoint;
//     case "down":
//       nextPoint.center = {
//         x: startPoint.center.x,
//         y: startPoint.center.y + width,
//       };
//       return nextPoint;
//   }
// }

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
      dummyRecursionFunc(elem, directionElem, playerChoices, 100);
    });
  });
}

function dummyRecursionFunc(startPoint, direction, playerChoice, squareParams) {
  //we check if the count has reach 3 and exit the recursive loop if it has
  if (count === 4) return console.log("WE HAVE A WINNER");
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
      //if that adjacent square happens to be part of the player choice array we can re-call
      //the checkNext function which we continue to pass the direction to.
      if (
        playerChoice.find(
          (elem) =>
            elem.center.x === nextPoint.center.x &&
            elem.center.y === nextPoint.center.y
        )
      ) {
        //if part of the array we add to count
        count++;
        console.log(count);
        //call function again
        dummyRecursionFunc(nextPoint, direction, playerChoice, squareParams);
      }
      break;
    //add y and no x
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
    //add x and no y
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
    //subtract x and no y
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
    //subtract x and y to get to the next point diagonally up to the left
    case "leftUpDiag":
      nextPoint.center = {
        x: startPoint.center.x - squareParams,
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
    //subtract x and no y
    case "leftDownDiag":
      nextPoint.center = {
        x: startPoint.center.x - squareParams,
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
    //add x and subtract y
    case "rightUpDiag":
      nextPoint.center = {
        x: startPoint.center.x + squareParams,
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
    //add x and add y
    case "left":
      nextPoint.center = {
        x: startPoint.center.x + squareParams,
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
