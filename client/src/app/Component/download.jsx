import Lottie from "lottie-react";
import animationData from "../utility/download.json";

const Download = () => {
  return (
    <div>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: "200px", height: "200px" }}
      />
    </div>
  );
};

export default Download;
