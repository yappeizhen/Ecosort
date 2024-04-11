import "../App.css";

import GameTemplate from "../components/GameTemplate";
// Import dependencies
import React from "react";
import { classBank } from "../constants/classBank";

function WordGame() {
  return (
    <GameTemplate
      id="wordgame"
      title="Word Game"
      description={
        "This is a simple game developed based on the AlphaSign extended model"
      }
      classBank={classBank}
      modelUrl={
        "https://raw.githubusercontent.com/yappeizhen/Trash_Classifier/main/models/tfjs_model/model.json"
      }
      isWordMode
    />
  );
}

export default WordGame;
