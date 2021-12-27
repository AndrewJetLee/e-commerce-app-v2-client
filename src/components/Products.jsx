import styled from "styled-components";
import Product from "./Product";
import { mobile, tablet } from "../responsive";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Products = ({ category, filters, sort }) => {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const getProducts = async (req, res) => {
      try {
        const res = await axios.get(
          category
            ? `http://localhost:4000/api/products?category=${category}`
            : `http://localhost:4000/api/products/`
        );
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [category]);

  useEffect(() => {
    category &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [products, category, filters]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) => {
        return [...prev].sort((a, b) => {
          return Date.parse(a.createdAt) - Date.parse(b.createdAt);
        });
      });
    } else if (sort === "desc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) => {
        return [...prev].sort((a, b) => {
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        });
      });
    }
  }, [sort]);

  return (
    <Container>
      {category ? filteredProducts.map((item, key) => (
        <Product item={item} key={key} />
      )) : products.slice(0, 8).map((item, key) => (
        <Product item={item} key={key} />
      ))}
    </Container>
  );
};

export default Products;

const Container = styled.div`
  display: grid;
  width: 100%; 
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 5px;
  ${tablet({
    gridTemplateColumns: "repeat(2, 1fr)"
  })}
  ${mobile({ display: "flex", flexDirection: "column" })};

`;
