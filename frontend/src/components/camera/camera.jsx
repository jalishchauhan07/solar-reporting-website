import { useEffect, useState } from "react";
import styles from "./camera.module.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Camera() {
  const navigator = useNavigate();
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [camera, setCamera] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigator("/");
    } else if (location.state === "Admin") {
      navigator("/admin");
    }

    async function startCamera() {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 200, height: 150 },
        });

        const videoElement = document.getElementById("video");

        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = function () {
          videoElement.play();
          setCamera(videoElement);
        };
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }

    if (
      "mediaDevices" in window.navigator &&
      "getUserMedia" in window.navigator.mediaDevices
    ) {
      console.log("Let's get this party started");
    }
    startCamera();
  }, [navigator, location.state]);

  useEffect(() => {
    if (canvas) {
      setCtx(canvas.getContext("2d"));
    }
  }, [canvas]);

  async function clickHandle(event) {
    if (!ctx) {
      alert("Please Click your Picture!!!");
    }
    if (event.target.id === "camera") {
      console.log(ctx);
      ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
    } else if (event.target.id === "submit") {
      console.log(ctx);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      console.log(imageData); // Capture image data from canvas as data URL

      // console.log(base64Data);
      const response = await fetch("http://localhost:8080/createSiteInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Photo: imageData,
          email: localStorage.getItem("email"),
          location: location.pathname,
          typeOfUser: location.state,
        }),
      });

      if (response.ok) {
        camera.srcObject.getTracks().forEach((track) => track.stop());
        navigator("/supervisor");
      }
    }
  }

  if (location.state === "Admin") {
    navigator("/admin");
  }
  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.wrapper}>
          <video id="video"></video>
        </div>
        <button className={styles.button} id="camera" onClick={clickHandle}>
          Capture Image &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-camera-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
          </svg>
        </button>
        <div className={styles.commonElementStyle}>
          <canvas id="myCanvas" ref={(canvas) => setCanvas(canvas)}></canvas>
        </div>
        <div className={styles.commonElementStyle}>
          <button
            type="button"
            className={styles.button}
            id="submit"
            onClick={clickHandle}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
