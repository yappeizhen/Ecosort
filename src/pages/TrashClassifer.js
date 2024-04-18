import "../App.css";

import GameTemplate from "../components/GameTemplate";
// Import dependencies
import React from "react";
import { classBank } from "../constants/classBank";

function TrashClassifer() {
  return (
    <GameTemplate
      id="trashclassifier"
      title="IS4242 Ecosort"
      description={
        "A simple tool to help us differentiate between different types of recyclable waste"
      }
      classBank={classBank}
      modelUrl={
        "https://raw.githubusercontent.com/yappeizhen/Ecosort/main/models/tfjs_model/model.json"
      }
    />
  );
}

export default TrashClassifer;
