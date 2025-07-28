import Lottie from "lottie-react";
import animationData from "../utility/upload.json";

const Upload = () => {
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

export default Upload;
