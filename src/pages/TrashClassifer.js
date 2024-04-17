import "../App.css";

import GameTemplate from "../components/GameTemplate";
// Import dependencies
import React from "react";
import { classBank } from "../constants/classBank";

function TrashClassifer() {
  return (
    <GameTemplate
      id="EcoSort"
      title="IS4242 EcoSort"
      description={
        "This is a simple model that can help you differentiate between recyclable classes"
      }
      classBank={classBank}
      modelUrl={
        "https://github.com/yappeizhen/Ecosort/blob/main/models/tfjs_model/model.json"
      }
    />
  );
}

export default TrashClassifer;
