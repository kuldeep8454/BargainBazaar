import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { Button, message } from "antd";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";
import moment from "moment";
import {motion} from 'framer-motion';

// const FrameImage = motion(img);

function Home() {
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "approved",
    category: [],
    age: [],
  });
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getData = async () => {
    try {
      console.log('API Request Filters:', filters);
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
        setOriginalProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  // Function to handle search input
  const searchHandle = (e) => {
    const searchTerm = e.target.value;

    // Filter products based on the search term
    const filteredProducts = originalProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchInput(searchTerm);
    setProducts(filteredProducts);
  };

  // Function to reset the product list to its original state
  const resetProductList = () => {
    setSearchInput("");
    setProducts(originalProducts);
  };

  useEffect(() => {
    getData();
    console.log(filters);
  }, [filters]);

  
  

  return (

    <div className="flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <i
              className="ri-equalizer-line text-xl cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}

          <div className="flex items-center w-full relative">
            <input
              type="text"
              placeholder="Search Product"
              className="border border-gray-300 rounded border-solid w-full p-2 h-14"
              style={{ width: "100%" }}
              value={searchInput}
              onChange={searchHandle}
            />
            {searchInput && (
              <i
                className="ri-close-circle-line cursor-pointer absolute right-[15px]"
                onClick={resetProductList}
              ></i>
            )}
          </div>
        </div>
        <div
          className={`grid gap-5 ${
            showFilters ? "grid-cols-4" : "grid-cols-5"
          }`}
        >
          {products?.length === 0 ? (
            <div className="w-full">
              <h1 className="text-primary text-center">No Product found!!</h1>
            </div>
          ) : (
            products?.map((product) => {
              // convert in USD
              const priceInUSD = (product.price / 83).toFixed(2);
              return (
                <div
                  className="border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer"
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <motion.img
                    src={product.images[0]}
                    className="w-full h-[300px] p-2 rounded-md object-contain"
                    alt=""
                    whileHover={{scale: 1.05}}
                    transition={{duration: 0.2}}
                  />
                  <div className="px-2 flex flex-col">
                    <h1 className="text-lg font-semibold">{product.name}</h1>
                    <p className="text-sm">
                      {product.age}
                      {product.age === 1 ? " year" : " years"} old
                    </p>
                    <Divider />
                    <div className="text-xl font-semibold text-green-700 flex justify-between">

                      
                      <span className="">₹ {product.price}</span>
                      <span className="text-sm text-gray-500">(${priceInUSD})</span>
                    </div>
                    
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;