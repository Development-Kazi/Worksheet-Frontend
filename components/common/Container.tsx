import { ReactNode } from "react";
import "./Container.css";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className }: Props) {
  return (
    <div className={`container ${className ?? ""}`}>
      {children}
    </div>
  );
}