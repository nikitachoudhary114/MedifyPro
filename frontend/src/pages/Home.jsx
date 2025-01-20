import React from "react";
import Header from "../components/Header";
import BottomPanel from "../components/BottomPanel";
import SpecialityOption from "../components/SpecialityOption";
import DisplayDoctor from "../components/DisplayDoctor";


const Home = () => {
  return (
    <>
      <Header />
      <SpecialityOption/>
      
      <BottomPanel/>
    </>
  );
};

export default Home;
