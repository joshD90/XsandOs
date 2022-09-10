import { drawLine } from "./setUpGrid.js";
import { bannerWin } from "./changeBanner.js";

function getSlope(winningArray, firstIndex, secondIndex) {
  //slope = dy / dx
  const slope =
    (winningArray[firstIndex].center.y - winningArray[secondIndex].center.y) /
    (winningArray[firstIndex].center.x - winningArray[secondIndex].center.x);
  console.log(slope);
  //square the slope to ensure it's positive and then find square root to return to original value
  return Math.sqrt(slope * slope);
}

export function getNewPoints(winningArray, firstIndex, secondIndex) {
  let newPoint = { x: null, y: null };
  //if the end point x is greater than the inner one then we need to add onto it
  if (winningArray[firstIndex].center.x > winningArray[secondIndex].center.x) {
    newPoint.x =
      winningArray[firstIndex].center.x +
      //cos is opposite over adjacent so this will give us the x.
      25 * Math.cos(getSlope(winningArray, firstIndex, secondIndex));
  } else if (
    winningArray[firstIndex].center.x < winningArray[secondIndex].center.x
  ) {
    //if dx = 0 then we will get a division by zero, if dx is 0 then only change to y section
    newPoint.x =
      winningArray[firstIndex].center.x -
      25 * Math.cos(getSlope(winningArray, firstIndex, secondIndex));
  } else if (
    winningArray[firstIndex].center.x === winningArray[secondIndex].center.x
  ) {
    newPoint.x = winningArray[firstIndex].center.x;
    winningArray[firstIndex].center.y > winningArray[secondIndex].center.y
      ? (newPoint.y = winningArray[firstIndex].center.y + 25)
      : (newPoint.y = winningArray[firstIndex].center.y - 25);
    return newPoint;
  }
  //repeat checks with for y.  Use sin, opposite over hypotenuse to give us the proportion of 25 that
  //needs to be given to the y change
  if (winningArray[firstIndex].center.y > winningArray[secondIndex].center.y) {
    newPoint.y =
      winningArray[firstIndex].center.y +
      25 * Math.sin(getSlope(winningArray, firstIndex, secondIndex));
  } else if (
    winningArray[firstIndex].center.y < winningArray[secondIndex].center.y
  ) {
    newPoint.y =
      winningArray[firstIndex].center.y -
      25 * Math.sin(getSlope(winningArray, firstIndex, secondIndex));
  } else if (
    winningArray[firstIndex].center.y === winningArray[secondIndex].center.y
  ) {
    newPoint.y = winningArray[firstIndex].center.y;
  }
  return newPoint;
}

export function doWin(whoWins, boardObject, handleMouseActions, userObject) {
  let {
    isMyTurn,
    isWinner: { winningArray },
  } = userObject;

  const { canvas, ctx, winLine } = boardObject;
  //make sure that our canvas stops drawing the x's r o's to let our line go on top
  canvas.removeEventListener("mousemove", handleMouseActions);

  //change banner text
  bannerWin(userObject, whoWins);
  //make sure that the player can't take another turn
  isMyTurn = false;
  //draw a line to show the winning element - we will modify the points so that they
  //extend beyond the immediate points
  let beginPoint = { x: null, y: null };
  let endPoint = { x: null, y: null };
  //create a beginning point and an end point for the line to be drawn
  beginPoint = getNewPoints(winningArray, 0, 1);
  endPoint = getNewPoints(
    winningArray,
    winningArray.length - 1,
    winningArray.length - 2
  );

  //draw our line with the adjusted endpoints
  //we set our timeout to allow the other listener to cease its activites fully by the time
  //we run this so that the x's and o's dont overwrite our line
  setTimeout(() => {
    drawLine(beginPoint, endPoint, winLine.color, ctx, winLine.width);
  }, 200);
}
