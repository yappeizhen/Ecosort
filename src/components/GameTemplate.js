import "../App.css";

import * as tf from "@tensorflow/tfjs";

// Import dependencies
import React, { useCallback, useEffect, useRef, useState } from "react";

import Footer from "../components/Footer";
import { Slider } from "@mui/material";
import Webcam from "react-webcam";
import backgroundImg from "../assets/images/background.jpg";
import { drawRect } from "../utilities";
import styled from "styled-components";

// Styled Components
const StyledWrapper = styled.div`
  color: rgb(40, 44, 52);
  background-image: url(${backgroundImg});
  background-size: cover;
  height: auto;
`;
const StyledAppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: poppins;
  align-items: center;
  gap: 12px;
`;
const StyledAppBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
`;
const StyledH1 = styled.h1`
  font-size: 20px;
  padding: 0;
  margin: 0;
  text-align: center;
  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;
const StyledContentBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
    justify-content: center;
  }
`;
const StyledRightPanel = styled.div`
  height: 100%;
  width: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 768px) {
    width: 70%;
  }
`;
const StyledCamWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledLoadingText = styled.p`
  font-size: 20px;
  font-weight: 600;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const StyledCamLoadingScreen = styled.div`
  display: ${(props) => (props.hidden ? "none" : "flex")};
  position: absolute;
  text-align: center;
  z-index: 12;
  width: 85%;
  height: calc(100% - 24px);
  border-radius: 24px;
  background-color: rgb(240, 248, 255, 0.5);
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height: calc(100% - 16px);
    border-radius: 28px;
  }
`;
const StyledCanvas = styled.canvas`
  position: absolute;
  text-align: center;
  z-index: 10;
  width: 90%;
  height: calc(100% - 20px);
  border-radius: 20px;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height: calc(100% - 16px);
    border-radius: 28px;
  }
`;
const StyledWebcam = styled(Webcam)`
  text-align: center;
  z-index: 9;
  max-width: 90%;
  height: 100%;
  border-radius: 20px;
  border: 2px solid rgb(40, 44, 52);
  @media only screen and (max-width: 680px) {
    max-width: 100%;
    border: 8px solid rgb(40, 44, 52);
  }
`
const StyledDescription = styled.div`
  text-align: center;
  max-width: 50rem;
  font-size: 12px;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
    padding: 0;
    max-width: 70%;
  }
`;
const StyledIntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;
const StyledSliderLabel = styled.p`
  font-size: 12px;
  padding: 0;
  margin: 0;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const MODEL_INDEXES = {
  boxes: 1,
  classes: 0,
  scores: 4,
};

function GameTemplate({ title, description, classBank, modelUrl }) {
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [threshold, setThreshold] = useState(0.7);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const currentWordBankIndexRef = useRef(null);
  const doneLetterIndexRef = useRef(-1);
  const intervalIdRef = useRef(null);
  const modelRef = useRef(null);
  const thresholdRef = useRef(0.7);

  // Main function
  const detect = useCallback(
    async (net) => {
      // Check data is available
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const ctx = canvasRef.current.getContext("2d");
        ctx.font = "20px normal bold courier";
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

        // 4. TODO - Make Detections
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeBilinear(img, [640, 480]);
        const casted = resized.cast("int32");
        const expanded = casted.expandDims(0);
        const obj = await net.executeAsync(expanded);

        if (obj) {
          setIsLoading(false);
        }
        const boxes = await obj[MODEL_INDEXES.boxes].array();
        const classes = await obj[MODEL_INDEXES.classes].array();
        const scores = await obj[MODEL_INDEXES.scores].array();
        // Draw mesh
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          const curWord = classBank[currentWordBankIndexRef.current]?.word;
          const curLetterIndex = doneLetterIndexRef.current + 1;
          const curLetter = curWord?.charAt(curLetterIndex).toUpperCase();
          requestAnimationFrame(() => {
            drawRect(
              boxes[0],
              classes[0],
              scores[0],
              thresholdRef.current,
              videoWidth,
              videoHeight,
              ctx,
              curLetter
            );
          });
        }
        tf.dispose(img);
        tf.dispose(resized);
        tf.dispose(casted);
        tf.dispose(expanded);
        tf.dispose(obj);
      }
    },
    [classBank]
  );

  const runCoco = useCallback(async () => {
    tf.setBackend("webgl");
    console.log("Backend : ", tf.getBackend());
    console.log("Loading Model");

    const net = await tf.loadGraphModel(modelUrl);
    modelRef.current = net;

    console.log("Loaded Model");
    //  Loop and detect hands
    intervalIdRef.current = setInterval(() => {
      detect(net);
      console.log(`# of tensors: ${tf.memory().numTensors}`);
    }, 1000);
  }, [detect, modelUrl]);

  useEffect(() => {
    runCoco();
    return () => {
      clearInterval(intervalIdRef.current);
      if (modelRef.current) {
        console.log("Cleaning");
        modelRef.current.dispose();
      }
    };
  }, [runCoco]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 500);
    }
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <StyledWrapper backgroundImg={backgroundImg}>
      <StyledAppContainer>
        <StyledAppBar>
          <StyledIntroContainer>
            <StyledH1>{title}</StyledH1>
            <StyledDescription>{description}</StyledDescription>
          </StyledIntroContainer>
        </StyledAppBar>
        <StyledContentBody>
          <StyledRightPanel>
            <StyledSliderContainer>
              <StyledSliderLabel>Detection Threshold</StyledSliderLabel>
              <Slider
                size="small"
                value={threshold}
                onChange={(e) => {
                  setThreshold(e.target.value);
                  thresholdRef.current = e.target.value;
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1}
                step={0.05}
                style={{ width: "70%", margin: 0 }}
              />
            </StyledSliderContainer>
            <StyledCamWrapper>
              <StyledCamLoadingScreen hidden={!isLoading}>
                <StyledLoadingText>Loading Model...</StyledLoadingText>
              </StyledCamLoadingScreen>
              <StyledWebcam ref={webcamRef} muted={true} audio={false} />
              <StyledCanvas ref={canvasRef} />
            </StyledCamWrapper>
          </StyledRightPanel>
        </StyledContentBody>
      </StyledAppContainer>
      <Footer />
    </StyledWrapper>
  );
}

export default GameTemplate;
