import styled from "styled-components";
import CategoryItem from "./CategoryItem";
import { CategoriesItems } from "../dummyData";
import { mobile } from "../responsive";

const Categories = () => {
  return (
    <Container>
      <Content>
        <Items>
          {CategoriesItems.map((item, key) => (
            <CategoryItem item={item} key={key} />
          ))}
        </Items>
      </Content>
    </Container>
  );
};

export default Categories;

const Container = styled.div``;
const Content = styled.div``;

const Items = styled.div`
  width: 100%;
  display: flex;
  background-color: white;
  flex-wrap: wrap;
  justify-content: center;
  ${mobile({ flexDirection: "column", marginTop: 0 })};
`;
