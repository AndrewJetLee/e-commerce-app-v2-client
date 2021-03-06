import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import { mobile, tablet } from "../responsive";
import { deleteCart } from "../redux/apiCalls";
import Alert from "../components/Alert";

const KEY = process.env.REACT_APP_STRIPE;

const Cart = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stripeToken, setStripeToken] = useState(null);
  const [editedCart, setEditedCart] = useState(cart);
  const [alertStatus, setAlertStatus] = useState(false);

  const onToken = (token) => {
    setStripeToken(token);
  };

  const handleAlert = () => {
    setAlertStatus(true);
    setTimeout(() => {
      setAlertStatus(false);
    }, 3000)
  }


  const makeStripeRequest = async () => {
    try {
      const res = await userRequest(user.currentUser.accessToken).post(
        "/checkout/payment",
        {
          tokenId: stripeToken.id,
          amount: cart.total * 100,
        }
      );
      await deleteCart(
        dispatch,
        user.currentUser._id,
        user.currentUser.accessToken
      );
      navigate("/success", { state: { stripeData: res.data, products: cart } });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteCart = async (userId) => {
    try {
      await deleteCart(dispatch, userId, user.currentUser.accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateCart = () => {
    handleAlert();
  };

  useEffect(() => {
    stripeToken && makeStripeRequest();
  }, [stripeToken]);

  return (
    <>
      <Navbar hidden="true"/>
      <Container>
        <Alert type="success" message="Successfully updated cart!" status={alertStatus}></Alert>
        {!cart.products.length ? (
          <EmptyCartContainer>
            <EmptyCartContent>
              <ShoppingCartOutlinedIcon className="cartIcon" />
              <EmptyCartText>Your cart is currently empty.</EmptyCartText>
              <ReturnButton
                onClick={() => {
                  navigate("/");
                }}
              >
                RETURN TO SHOP
              </ReturnButton>
            </EmptyCartContent>
          </EmptyCartContainer>
        ) : (
          <Content>
            <Top>
              <Title>CART</Title>
              <Options>
                <LeftButton onClick={() => navigate("/products/mens")}>
                  Continue Shopping
                </LeftButton>
                <CenterLinks>
                  <CenterLink>Shopping Bag</CenterLink>
                  <CenterLink>Your Wishlist</CenterLink>
                </CenterLinks>
                <StripeCheckout
                  name="Shop"
                  image="https://w7.pngwing.com/pngs/621/196/png-transparent-e-commerce-logo-logo-e-commerce-electronic-business-ecommerce-angle-text-service.png"
                  billingAddress
                  shippingAddress
                  description={`You total is $${cart.total}`}
                  amount={cart.total * 100}
                  token={onToken}
                  stripeKey={KEY}
                >
                  <RightButton>Checkout Now</RightButton>
                </StripeCheckout>
              </Options>
            </Top>
            <Bottom>
              <Items>
                <HorizontalSeparator></HorizontalSeparator>
                {cart.products.map((item, i) => (
                  <CartItem
                    key={i}
                    editedCart={editedCart}
                    setEditedCart={setEditedCart}
                    cart={cart}
                    item={item}
                  />
                ))}
                <CartOptions>
                  <CouponInputWrapper>
                    <LocalActivityOutlinedIcon className="couponIcon" />
                    <input type="text" placeholder="Coupon code" />
                    <ApplyCouponButton>Apply Coupon</ApplyCouponButton>
                  </CouponInputWrapper>

                  <EmptyCartButton
                    onClick={() => {
                      handleDeleteCart(user.currentUser._id);
                    }}
                  >
                    Empty Cart
                  </EmptyCartButton>
                  <UpdateCartButton onClick={handleUpdateCart}>
                    Update Cart
                  </UpdateCartButton>
                </CartOptions>
              </Items>

              <Summary>
                <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                <SummaryItem>
                  <SummaryItemText>Subtotal</SummaryItemText>
                  <SummaryItemPrice>${cart.total.toFixed(2)}</SummaryItemPrice>
                </SummaryItem>
                <SummaryItem>
                  <SummaryItemText>Estimate Shipping</SummaryItemText>
                  <SummaryItemPrice>$6.90</SummaryItemPrice>
                </SummaryItem>
                <SummaryItem>
                  <SummaryItemText>Shipping Discount</SummaryItemText>
                  <SummaryItemPrice>-$6.90</SummaryItemPrice>
                </SummaryItem>
                <SummaryItem type="total">
                  <SummaryItemText>Total</SummaryItemText>
                  <SummaryItemPrice>${cart.total.toFixed(2)}</SummaryItemPrice>
                </SummaryItem>
                <StripeCheckout
                  name="Shop"
                  image="https://w7.pngwing.com/pngs/621/196/png-transparent-e-commerce-logo-logo-e-commerce-electronic-business-ecommerce-angle-text-service.png"
                  billingAddress
                  shippingAddress
                  description={`You total is $${cart.total}`}
                  amount={cart.total * 100}
                  token={onToken}
                  stripeKey={KEY}
                >
                  <CheckoutButton>CHECKOUT NOW</CheckoutButton>
                </StripeCheckout>
              </Summary>
            </Bottom>
          </Content>
        )}

        <Footer />
      </Container>
    </>
  );
};

export default Cart;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
`;

const Content = styled.main`
  width: 75%;
  min-height: 80vh;
  padding: 20px;
  font-size: 14px;
  ${mobile({
    width: "100%",
  })}
`;

const Top = styled.div`
  width: 100%;
  padding: 20px 0;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Options = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const LeftButton = styled.button`
  padding: 8px;
  border: solid 1px black;
  cursor: pointer;
  ${mobile({
    padding: "4px",
    fontSize: "12px",
  })};
  
`;
const CenterLinks = styled.div`
  display: flex;
  ${mobile({
    flexDirection: "column",
    fontSize: "12px",
  })}
`;
const CenterLink = styled.a`
  text-decoration: underline;
  margin-right: 5px;
  cursor: pointer;
`;

const RightButton = styled.button`
  padding: 8px 16px;
  background-color: black;
  color: white;
  cursor: pointer;
  ${mobile({
    padding: "4px",
    fontSize: "12px",
  })};
`;

const Bottom = styled.div`
  display: flex;
  ${tablet({
    flexDirection: "column",
  })}
`;

const HorizontalSeparator = styled.span`
  display: inline-block;
  border-bottom: 1px solid lightgrey;
  width: 100%;
  position: absolute;
  z-index: 1000;
  ${mobile({
    display: "none",
  })}
`;

const Items = styled.div`
  flex: 2;
  position: relative;
  ${mobile({
    display: "flex",
    flexDirection: "column",
  })}
`;

const CartOptions = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-top: 50px;
`;
const CouponInputWrapper = styled.div`
  font-size: inherit;
  border-bottom: 1px solid lightgrey;
  padding: 10px;
  display: flex;
  align-items: center;
  .couponIcon {
    color: gray;
    font-size: 18px;
    margin-right: 4px;
  }
`;
const ApplyCouponButton = styled.button`
  font-size: inherit;
  font-weight: 500;
  cursor: pointer;
`;
const EmptyCartButton = styled.button`
  font-size: inherit;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
`;
const UpdateCartButton = styled(EmptyCartButton)``;

const Summary = styled.div`
  flex: 1;
  max-width: 390px;
  height: 45vh;
  margin-left: 40px;
  background-color: rgb(247, 247, 247);
  border-top: none;
  padding: 20px;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  ${tablet({
    maxWidth: "100%",
    marginLeft: 0,
  })}
`;

const SummaryTitle = styled.h2`
  font-weight: 400;
  font-size: 32px;
  width: 100%;
`;

const SummaryItem = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: ${({ type }) => type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;
const SummaryItemPrice = styled(SummaryItemText)``;

const CheckoutButton = styled(RightButton)`
  width: 100%;
  margin-top: 40px;
  height: 45px;
`;

const EmptyCartContainer = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
`;
const EmptyCartContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  .cartIcon {
    color: orange;
    font-size: 60px;
  }
  * {
    margin-bottom: 25px;
  }
`;

const EmptyCartText = styled.span`
  font-weight: 500;
  font-size: 20px;
`;
const ReturnButton = styled.button`
  background-color: black;
  color: white;
  padding: 8px 24px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.167s ease-in-out;
  :hover {
    transform: scale(1.1);
  }
`;
