import React from 'react';
import { $ } from "../../../../functions";
import "./btnLoki.css";

interface BtnLokiProps {
  onClick?: () => void;
  className?: string;
}

const BtnLoki: React.FC<BtnLokiProps> = ({
  onClick,
  className = "",
}) => {

  const active = () => {
    $("btn-hamburguer-loki")?.classList.toggle("active");
  }

  return (
    <button
      onClick={() => {
        active();
        onClick && onClick();
      }}
      className={`btn-loki btn-menu ${className}`}
      id="btn-hamburguer-loki"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default BtnLoki;
