import React, { useState, useEffect } from "react";
import "./KalendarLinia.scss";
const KalendarLinia = () => {
  return (
    <div className="kalendar-line kalendar-line--header">
      <div className="header-day">Montag</div>
      <div className="header-day">Dienstag</div>
      <div className="header-day">Mittwoch</div>
      <div className="header-day">Donnerstag</div>
      <div className="header-day">Freitag</div>
      <div className="header-day">Samstag</div>
      <div className="header-day">Sonntag</div>
    </div>
  );
};

export default KalendarLinia;
