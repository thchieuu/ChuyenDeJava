import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import "./SimpleHomePage.css";

function SimpleHomePage() {
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const travelSection = document.getElementById("travelSection");
      if (travelSection) {
        const travelSectionOffset = travelSection.getBoundingClientRect().top;
        const isScrolledPastTravelSection = travelSectionOffset < 0;
        setShowButton(!isScrolledPastTravelSection);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTravelSection = () => {
    const travelSection = document.getElementById("travelSection");
    if (travelSection) {
      travelSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <body className="bodyStyle">
    {/*<div className="containerStyle">
    <Container>
    <div className="heading">
    <h1 className="title">
        Culture Hub News
    </h1>
    </div>
    <p class="paragraph1">
   Your go-to destination for the latest updates across a diverse spectrum of topics. 
    </p>
    {showButton && (
    <button className="scroll-button" 
      onClick={scrollToTravelSection}>
      <img src="/../../arrow-down.png"/>
    </button>
    )}
  </Container>
  </div>*/}
  </body>
  );
}

export default SimpleHomePage;