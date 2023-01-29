import React, { useEffect, useState } from "react";
import "./Home.scss";
import Hero from "../../components/hero/Hero";
import Category from "../../components/category/Category";
import Product from "../../components/product/Product";
import {axiosClient} from '../../utils/axiosClient.js'
import { useSelector } from "react-redux";

function Home() {
  const categories = useSelector((state) => state.categoryReducer.categories);
  const [topProducts, setTopProducts] = useState(null);

  async function fetchData() {
   
    const topProductsResponse = await axiosClient.get(
      "/products?filters[isTopPick][$eq]=true&populate=image"

    );
    
    setTopProducts(topProductsResponse.data.data)

    // console.log(categoryResponse);
    // console.log(topProductsResponse);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="Home">
      <Hero />
      <section className="collection container">
        <div className="info">
          <h2 className="heading">Shop By Categories</h2>
          <p className="subheading">
            Shop from the best, our Film and TV Poster Collection
          </p>
        </div>

        <div className="content">
          {categories?.map(category => <Category key={category.id} category={category} />)}
        </div>
      </section>

      <section className="collection container">
        <div className="info">
          <h2 className="heading">Our Top Picks</h2>
          <p className="subheading">All New Designs, Same Old Details</p>
        </div>

        <div className="content">
         {topProducts?.map(products => <Product key={products.id} product={products}/>)}
        </div>
      </section>
    </div>
  );
}

export default Home;
