import React from "react";
import Image from "./assets/loader.png";

export default function Loader() {
  return (
    <div className="h-100vh d-flex flex-column gap-3 justify-content-center align-items-center">
      <div className="loader"></div>
      <p>Loading may take some time...</p>
    </div>
  );
}
