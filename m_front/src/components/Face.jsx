import { useState, useRef, useEffect } from "react"
import * as faceapi from "face-api.js"
import './Face.css'

const Face = () => {

  const videoHeight = 400;
  const videoWidth = 640;
  const imgWidth = 50;
  const imgHeight = 50;
  const [initialising, setInitializing] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [emoticon, setEmoticon] = useState("neutral");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]).then(startVideo)
    }
    loadModels();

  }, [])

  const startVideo = () => {
    console.log("started");
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => videoRef.current.srcObject = stream)
  }

  const handleVideoPlay = () => {

    let counter = 1;
    setInterval(async () => {
      if (initialising) {
        setInitializing(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
      const displaySize = { width: videoWidth, height: videoHeight }
      faceapi.matchDimensions(canvasRef.current, displaySize)
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight)
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
      // console.log(detections)

      if(counter==10){
        if(detections.length!=0){
          addTaskHandler(detections[0]['expressions'])
        }
        counter=1;
      }
      else{
        counter++;
      }

    })
  }

  function addTaskHandler(faces) {
    fetch('http://10.21.3.40:9000/expsend', {
      method: 'POST',
      body: JSON.stringify(faces),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(data=>{
      console.log(data.emotion);
      setEmoticon(data.emotion);
    })
  }

  return (
    <>
      <div>
        <h1 className="Head">Emotion Analyser</h1>
        <h3 className="Head">The emoji knows how you are feeling!</h3>
        <div className='cam'>
          <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoPlay} className="camera"/>
          <canvas ref={canvasRef} className="canvas" />
          <img src={require(`../images/${emoticon}.png`).default} height={imgHeight} width={imgWidth} className="img" alt="your emotion"></img>
        </div>
      </div>
    </>
  )
}

export default Face;