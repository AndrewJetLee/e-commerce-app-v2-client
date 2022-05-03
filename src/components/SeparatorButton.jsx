import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SeparatorButton = ({ categoryId }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${categoryId}`)
  };

  return (
    <Container>
      <Button onClick={handleClick}>VIEW ALL</Button>
    </Container>
  );
};

export default SeparatorButton;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 16px;
  width: 200px;
  background-color: black;
  color: white;
  margin: 50px 0;
  border-radius: 1px;
  cursor: pointer;
  transition: transform 0.167s ease-in-out;
  font-weight: 600;
  font-size: 14px;
  :hover {
    transform: scale(1.1);
  }
`;