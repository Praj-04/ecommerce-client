import React, { useEffect, useState } from "react";
import "./Collection.scss";
import Product from "../../components/product/Product";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";

function Collection() {
  const navigate = useNavigate(); //navigate programatically based on a selection
  const params = useParams(); //get the parameter passed in url
  const [categoryId, setCategoryId] = useState("");
  const categories = useSelector((state) => state.categoryReducer.categories);
  const [products, setProducts] = useState([]);

  //in future can add more sorting options here- can check details in strapi documentation under sort and pagination section
  //you can add high to low..just haveto add :asc or :desc at the end in fetchProducts() api below ===> &sort=${sortBy}:desc
  const sortOptions = [
    {
      value: "Price-Low To High",
      sort: "price",
    },
    {
      value: "Newest-First",
      sort: "createdAt",
    },
  ];

  const [sortBy, setSortBy] = useState(sortOptions[0].sort);

  async function fetchProducts() {
    const url = params.categoryId
      ? `/products?populate=image&filters[category][key][$eq]=${params.categoryId}&sort=${sortBy}`
      : `/products?populate=image&sort=${sortBy}`;
    const response = await axiosClient.get(url);
    setProducts(response.data.data);
  }

  useEffect(() => {
    setCategoryId(params.categoryId);
    //api call to fetch data based on categoryId
    fetchProducts();
  }, [params, sortBy]);

  function updateCategory(e) {
    navigate(`/category/${e.target.value}`); //programtically going to another page
  }

  return (
    <div className="Categories">
      <div className="container">
        <div className="header">
          <div className="info">
            <h2>Explore All Print and Artwork</h2>
            <p>
              India's largest collection of wall posters for your bedroom,
              living room, kids room, kitchen and posters & art prints at
              highest quality lowest price guaranteed.
            </p>
          </div>

          <div className="sort-by">
            <div className="sort-by-container">
              <h3 className="sort-by-text"> Sort By </h3>

              <select
                className="select-sort-by"
                name="sort-by"
                id="sort-by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((item) => (
                  <option key={item.sort} value={item.sort}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="filter-box">
            <div className="category-filter">
              <h3>Category</h3>

              {categories.map((item) => (
                <div key={item.id} className="filter-radio">
                  <input
                    type="radio"
                    value={item.attributes.key}
                    id={item.id}
                    name="category"
                    onChange={updateCategory}
                    checked={item.attributes.key === categoryId}
                  />
                  <label htmlFor={item.id}>{item.attributes.title}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="products-box">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
