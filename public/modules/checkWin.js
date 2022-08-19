export function niceWin(playerChoices) {
  //we use each element as a starting point
  playerChoices.forEach((elem, index) => {
    //for each element we compare this against all other elements in the array
    for (let i = 0; i < playerChoices.length; i++) {
      //we dont need to check the same point against itself
      if (i !== index) {
        const xDiff = elem.center.x - playerChoices[i].center.x;
        const yDiff = elem.center.y - playerChoices[i].center.y;
        //avoid division by zero, this will have to be handled in an exeption
        if (xDiff !== 0) {
          //set our angle between the first iteration y / x
          const angle1 = yDiff / xDiff;
          console.log(angle1, "angle1");
          //now for each second element we need to compare against all the rest to see if angles are same
          for (let x = 0; x < playerChoices.length; x++) {
            //no need to compare against ourself or against the one we just checked
            if (x !== index && x !== i) {
              const xDiff2 = elem.center.x - playerChoices[i].center.x;
              const yDiff2 = elem.center.y - playerChoices[i].center.y;
              //avoid division by 0
              if (x !== 0) {
                const angle2 = yDiff2 / xDiff2;
                console.log(angle2, "angle2");
                //if the angle between the first line and the second line are the same then they must be on the same line
                if (angle2 === angle1)
                  return console.log("YAY YOU WIN", angle1, angle2);
              }
            }
          }
        }
      }
    }
    console.log("forEach Loop finsihed");
  });
}

export function checkWin(playerChoices) {
  playerChoices.forEach((elem, index) => {
    for (let i = 0; i < playerChoices.length; i++) {
      if (i !== index) {
        const xDiff = elem.center.x - playerChoices[i].center.x;
        const yDiff = elem.center.y - playerChoices[i].center.x;
        console.log(xDiff, yDiff, "difference");
      }
    }
  });
}
