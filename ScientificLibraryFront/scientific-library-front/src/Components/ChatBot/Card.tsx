import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // Allow className as an optional prop
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`border rounded-lg shadow-lg p-4 bg-white ${className || ""}`}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`p-2 ${className || ""}`}>{children}</div>;
};
