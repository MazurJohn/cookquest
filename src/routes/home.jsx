import React from "react";
import { Link } from "react-router-dom";
import { CarouselWithContent } from "../carousel";

export default function Home() {
  return (
    <div className="animate__animated animate__fadeInUp w-full h-[39rem]">
      <CarouselWithContent />
    </div>
  );
}
