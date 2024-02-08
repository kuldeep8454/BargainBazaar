import { Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { GetAllBids } from "../../../apicalls/products";
import moment from "moment";
import Divider from "../../../components/Divider"

function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(false));
      const response = await GetAllBids({
        product:selectedProduct.productId
        // product:selectedProduct._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        console.log("Bids Data : ", response.data);
        setBidsData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return record.buyer.name
      }
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount"
    },
    {
      title: "Bid Date",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt).format("MMMM DD YYYY, h:mm:ss a");
      }
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Contact Details",
      dataIndex: "contact",
      render: (text, record) => {
        return (
          <div>
            <p>Phone: {record.mobile}</p>
            <p>Email: {record.buyer.email}</p>
          </div>
        );
      },
    },
  ];

  useEffect(()=> {
    if(selectedProduct){
      getData();
    }
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={1200}
      footer={null}
    >
     <div className="flex gap-3 flex-col">
     <h1 className="text-primary">Bids</h1>
      <Divider/>
      <h1 className="text-xl text-gray-500">Product Name: {selectedProduct.name}</h1>

      <Table columns={columns} dataSource={bidsData}/>
     </div>
    </Modal>
  );
}

export default Bids;
