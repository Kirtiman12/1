import React from "react";
import styled from "styled-components";
import { useTheme } from "@/context/ThemeContext";

interface SwitcherProps {
  className?: string;
  // other props if necessary
}
const Switcher: React.FC<SwitcherProps> = ({ className }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <StyledWrapper className={className}>
      <div className="container gap-1.5">
        <input
          type="checkbox"
          name="check"
          id="check"
          hidden
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <label htmlFor="check" className="toggle">
          <div className="toggle__circle" />
        </label>
        <div className="toggle-text">
          <span>N</span>
          <span>FF</span>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    margin: auto;
    color: hsl(0, 0%, 30%);
    font-weight: 900;
    font-size: 5rem;
    display: flex;
  }

  .toggle {
    width: 60px;
    height: 130px;
    background-color: hsl(0, 0%, 80%);
    border-radius: 1.7rem;
    padding: 0.25rem 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    transition: background-color 300ms 300ms;
  }

  .toggle__circle {
    width: 50px;
    height: 50px;
    background-color: hsl(0, 0%, 95%);
    border-radius: 50%;
    margin-top: calc(130px - (0.25rem * 2) - 50px);
    transition: margin 500ms ease-in-out;
  }

  .toggle-text {
    display: flex;
    flex-direction: column;
    line-height: 0.8;
    color: white;
    font-family: "Albert Sans", sans-serif;
    font-weight: black;
  }

  #check:checked + .toggle > .toggle__circle {
    margin-top: 0;
  }

  #check:checked + .toggle {
    background-color: #41a63c;
  }

  :not(#check:checked) + .toggle {
    background-color: #f44336;
  }
`;

export default Switcher;
