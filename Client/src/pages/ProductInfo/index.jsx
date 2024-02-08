import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllBids, GetProductById, GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { Button, message } from "antd";
import Divider from "../../components/Divider";
import { useNavigate, useParams } from "react-router-dom";
// import Filters from "./Filters";
import moment from "moment";
import BidModal from "./BidModal";

function ProductInfo() {
  const {user} = useSelector((state)=> state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidResponse = await GetAllBids({product: id});
        setProduct({
          ...response.data,
          bids: bidResponse.data,
        });
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Convert product price to rupees
  const priceInUSD = product ? (product.price / 83).toLocaleString() : null;

  return (
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/* Image */}
          <div className="flex flex-col gap-5 ">
            <img
              src={product.images[selectedImageIndex]}
              alt=""
              className="w-full h-[500px] rounded-md object-contain"
               
            />
            
            <div className="flex gap-5">
              {product.images.map((image, index) => {
                return (
                  <img
                    className={
                      "w-20 h-20 rounded-md cursor-pointer object-contain" +
                      (selectedImageIndex === index
                        ? "border-green-700 border-dashed p-2 object-contain"
                        : "")
                    }
                    onClick={() => setSelectedImageIndex(index)}
                    src={image}
                    alt=""
                  />
                );
              })}
            </div>
            <Divider/>
            <div>
              <h1 className="text-gray-600">
                Added On
              </h1>
              <span className="text-gray-600">
                {moment(product.createdAt).format("MMM D, YYYY hh:mm A ")}
              </span>
            </div>
          </div>
          {/* Details */}
          <div className="flex flex-col gap-3 ">
            <div>
              <h1 className="text-2xl font-semibold text-orange-900 uppercase">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900 uppercase">
                Product Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Price (INR)</span>
                <span>₹{product.price}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Price (USD)</span>
                <span>${priceInUSD}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Category</span>
                <span className="uppercase">{product.category}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Box Available</span>
                <span>{product.boxAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>warranty Available</span>
                <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Purchased year</span>
                <span>{moment().subtract(product.age, "years").format("YYYY")} ({product.age} years ago)</span>
              </div>


              

            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900 uppercase">
                Seller Details
              </h1>

              <div className="flex justify-between mt-2">
                <span>Name</span>
                <span>{product.seller.name}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Email</span>
                <span>{product.seller.email}</span>
              </div>

              

            </div>

            <Divider/>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-orange-900 uppercase">Bids</h1>
                <Button
                onClick={()=> setShowAddNewBid(!showAddNewBid)}
                disabled = {user._id === product.seller._id}
                >New Bid</Button>
              </div>
            </div>

            {product.showBidsOnProductPage && 
            product?.bids?.map((bid) => {
              return(
                <div className="border border-gray-300 border-solid p-3 rounded mt-5">
                  <div className="flex justify-between text-gray-700">
                    <span>Name</span>
                    <span>{bid.buyer.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Bid Amount</span>
                    <span> ₹{bid.bidAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Bid Place On</span>
                    <span>
                      {" "}
                      {moment(bid.createdAt).format("MMM D, YYYY hh:mm A")}
                      </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {
          showAddNewBid && <BidModal
          product={product}
          reloadData={getData}
          showBidModal={showAddNewBid}
          setShowBidModal={setShowAddNewBid}
          />
        }
      </div>
    )
  );
}

export default ProductInfo;