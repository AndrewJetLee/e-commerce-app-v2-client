import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getDiscountPercentage } from "../utility/helpers";

const Product = ({ item }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Wrapper>
        {item.price.isMarkedDown && item.price.rrp.value ? (
          <DiscountBadge>
            -
            {getDiscountPercentage(
              item.price?.rrp.value,
              item.price?.current.value
            )}
            %
          </DiscountBadge>
        ) : item.price.isMarkedDown && item.price.previous.value ? (
          <DiscountBadge>
            -
            {getDiscountPercentage(
              item.price?.previous.value,
              item.price?.current.value
            )}
            %
          </DiscountBadge>
        ) : null}

        <Image src={`https://${item?.imageUrl}`} />
        <Info>
          <button
            className="searchButton"
            onClick={() => navigate(`/product/${item?.id}`)}
          >
            VIEW
          </button>
        </Info>
      </Wrapper>
      <Title>{item?.name}</Title>
      {item.price.isMarkedDown && item.price.rrp.text ? (
        <Price>
          <RrpPrice>{item.price?.rrp.text}</RrpPrice>
          <SalePrice>{item.price?.current.text}</SalePrice>
        </Price>
      ) : item.price.isMarkedDown && item.price.previous.text ? (
        <Price>
          <RrpPrice>{item.price?.previous.text}</RrpPrice>
          <SalePrice>{item.price?.current.text}</SalePrice>
        </Price>
      ) : (
        <Price>{item.price?.current.text}</Price>
      )}
    </Container>
  );
};

export default Product;

const Container = styled.div`
  width: 80%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  button {
    background-color: ${(props) => props.theme.colors.primary};
    padding: 14px 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.167s ease;
    color: white;
    font-weight: 500;
    border-radius: 2px;
    cursor: pointer;
    .icon {
      font-size: 20px;
    }
    :hover {
      transform: scale(1.1);
    }
  }
  .cartButton {
    margin-right: 15px;
  }
  :hover {
    opacity: 1;
  }
`;

const Title = styled.span`
  display: flex;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  height: 100%;
`;

export const Price = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
`;

export const RrpPrice = styled.span`
  text-decoration: line-through;
  margin-right: 5px;
  font-weight: 500;
`;

export const SalePrice = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 12px;
  background-color: ${(props) => props.theme.colors.primaryO};
  padding: 2px 5px;
  color: white;
`;
