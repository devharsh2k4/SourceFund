import React from 'react';

interface CustomButtonProps {
  btnType: "button" | "submit" | "reset";
  title: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  styles?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  btnType,
  title,
  handleClick,
  styles = ""
}): JSX.Element => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white
        min-h-[52px] px-4  rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
