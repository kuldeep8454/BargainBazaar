import { Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";

function Bids() {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        buyer: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Products",
      dataIndex: "product",
      render: (text, record) => {
        return record.product?.name;
      },
    },
    {
      title: "Bids Date",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(text).format("DD-MM-YYYY hh:mm A");
      },
    },
    {
      title: "Sellers",
      dataIndex: "seller",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    {
      title: "Product Price",
      dataIndex: "orizinalprice",
      render: (text, record) => {
        return record.product?.price;
      },
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            {/* <p>Phone: {record.seller.mobile}</p> */}
            <p>Email: {record.seller.email}</p>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex gap-3 flex-col">
      <Table columns={columns} dataSource={bidsData} />
    </div>
  );
}

export default Bids;