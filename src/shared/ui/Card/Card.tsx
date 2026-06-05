import "./Card.css";

import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}

function Header({ children }: CardProps) {
  return <div className="card-header">{children}</div>;
}

function Body({ children }: CardProps) {
  return <div className="card-body">{children}</div>;
}

Card.Header = Header;
Card.Body = Body;

export default Card;
