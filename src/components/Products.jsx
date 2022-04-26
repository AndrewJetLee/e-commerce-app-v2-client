import styled from "styled-components";
import Product from "./Product";
import { mobile, tablet } from "../responsive";
import { useState, useEffect } from "react";
import { publicRequest, asosRequest } from "../requestMethods";
import { Skeleton } from "@mui/material";

const Products = ({ query, category, filter, sortRef, sort, type }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(category);
  const [title, setTitle] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  let baseUrl = `/v2/list/?limit=45&store=US&offset=${offset}`;

  useEffect(() => {
    getProducts();
  }, [category, query]);

  useEffect(() => {
    sort && sortProducts();
  }, [sort]);

  useEffect(() => {
    if (type !== "home") {
      Object.keys(filter).length > 0 && filterProducts();
    }
  }, [filter]);

  const getProducts = async () => {
    try {
      toggleLoading(true);
      if (query) {
        await getProductsWithQuery();
      } else if (category) {
        await getProductsWithCategory();
      } else {
        const res = await asosRequest.get(`${baseUrl}&categoryId=50060`);
        setTitle(res.data.categoryName);
        setFiltered(res.data.products);
        setProducts(res.data.products);
      }
      toggleLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getProductsWithQuery = async () => {
    try {
      if (categoryId) {
        const res = await asosRequest.get(
          `${baseUrl}&categoryId=${categoryId}&q=${query}`
        );
        setTitle(res.data.categoryName);
        setFiltered(res.data.products);
        setProducts(res.data.products);
        res.data.itemCount > (offset + 45) ? setHasNextPage(true) :  setHasNextPage(false);
      } else {
        const res = await asosRequest.get(`${baseUrl}&q=${query}`);
        setTitle(res.data.categoryName);
        setFiltered(res.data.products);
        setProducts(res.data.products);
        res.data.itemCount > (offset + 45) ? setHasNextPage(true) :  setHasNextPage(false);
      }
      const res = await asosRequest.get(
        `${baseUrl}&categoryId=${categoryId}&q=${query}`
      );
      setTitle(res.data.categoryName);
      setFiltered(res.data.products);
      setProducts(res.data.products);
      res.data.itemCount > (offset + 45) ? setHasNextPage(true) :  setHasNextPage(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getProductsWithCategory = async () => {
    try {
      const res = await asosRequest.get(`${baseUrl}&categoryId=${categoryId}`);
      setTitle(res.data.categoryName);
      setFiltered(res.data.products);
      setProducts(res.data.products);
      res.data.itemCount > (offset + 45) ? setHasNextPage(true) :  setHasNextPage(false);
    } catch (err) {
      console.log(err);
    }
  };

  const sortProducts = async () => {
    try {
      if (sortRef !== sort) {
        if (categoryId) {
          toggleLoading(true);
          const res = await asosRequest.get(
            `${baseUrl}&categoryId=${categoryId}&sort=${sort}`
          );
          setTitle(res.data.categoryName);
          setFiltered(res.data.products);
          setProducts(res.data.products);
          res.data.itemCount > (offset + 45) ? setHasNextPage(true) :  setHasNextPage(false);
          toggleLoading(false);
        } else {
          toggleLoading(true);
          const res = await asosRequest.get(
            `${baseUrl}&q=${query}&sort=${sort}`
          );
          setTitle(res.data.categoryName);
          setFiltered(res.data.products);
          setProducts(res.data.products);
          res.data.itemCount > (offset + 45) ? setHasNextPage(true) :  setHasNextPage(false);
          toggleLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filterProducts = async () => {
    setFiltered(products);
    try {
      toggleLoading(true);
      if (filter.category) {
        const res = await asosRequest.get(
          `${baseUrl}&categoryId=${filter.category}&sort=${sort}`
        );
        setTitle(res.data.categoryName);
        setCategoryId(filter.category);
        setFiltered(res.data.products);
        setProducts(res.data.products);
        res.data.itemCount > (offset + 45) ? setHasNextPage(true) :  setHasNextPage(false);
      }
      if (filter.color) {
        let filtered = products.filter(
          (product, i) => product.colour?.toLowerCase() === filter.color
        );
        setFiltered(filtered);
      }
      toggleLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoadMore = async () => {
    setOffset(offset + 45);
    const res = await asosRequest.get(
      `${baseUrl}&categoryId=${categoryId}${query ? `&q=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
    );
    setFiltered([...filtered, ...res.data.products]);
    setProducts([...products, res.data.products]);
  }

  return (
    <>
      {type !== "home" && (
        <Title> {category ? title : `Showing results for: ${query}`}</Title>
      )}

      <Container>
        {loading &&
          Array(20)
            .fill("")
            .map((item, i) => (
              <Skeleton
                variant="rectangular"
                width={300}
                height={380}
                sx={{
                  marginBottom: "30px",
                }}
                key={i}
              />
            ))}
        {type === "home" && !loading
          ? products
              .slice(0, 20)
              .map((item, key) => <Product item={item} key={key} />)
          : (category || query) &&
            !loading &&
            filtered?.map((item, key) => <Product item={item} key={key} />)}
        
      </Container>
      {type !== "home" && hasNextPage && (
          <LoadWrapper onClick={handleLoadMore}>
            <LoadMore>LOAD MORE</LoadMore>
          </LoadWrapper>
        )}
    </>
  );
};

export default Products;

const Container = styled.div`
  display: grid;
  width: 98%;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  margin-left: 60px;
  ${tablet({
    gridTemplateColumns: "repeat(2, 1fr)",
  })}
  ${mobile({ display: "flex", flexDirection: "column" })};
`;

const Title = styled.h1`
  position: relative;
  top: -150px;
  padding-bottom: 15px;
  text-transform: uppercase;
  text-align: center;
  ${mobile({ textAlign: "center" })};
`;

const LoadWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const LoadMore = styled.button`
  border: 1px solid rgb(196, 193, 188);
  padding: 15px;
  width: 300px;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 32px;
  cursor: pointer;
`;
