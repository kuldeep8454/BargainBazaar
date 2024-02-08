import { Button, Upload, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";

// ... (other imports)

function Images({
  selectedProduct,
  setSelectedProduct,
  setShowProductForm,
  getData,
}) {
  const [showPreview, setShowPreview] = useState(true);
  const [images, setImages] = useState(selectedProduct.images);
  const [fileList, setFileList] = useState([]);

  const dispatch = useDispatch();

  const upload = async () => {
    try {
      dispatch(SetLoader(true));

      // upload image to cloudinary
      const formData = new FormData();
      formData.append("file", fileList[0].originFileObj);
      formData.append("productId", selectedProduct._id);

      const response = await UploadProductImage(formData);

      dispatch(SetLoader(false));

      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        setShowPreview(false);
        setFileList([]);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      const updatedImagesArray = images.filter((img) => img !== image);
      const updatedProduct = { ...selectedProduct, images: updatedImagesArray };
      const response = await EditProduct(selectedProduct._id, updatedProduct);

      if (response.success) {
        message.success(response.message);
        setImages(updatedImagesArray);
        setFileList([]);
        getData();
      } else {
        throw new Error(response.message);
      }

      dispatch(SetLoader(true));
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex gap-5 mb-5">
        {images.map((image) => (
          <div
            key={image} // Make sure to add a unique key for each element in the array
            className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end"
          >
            <img className="h-20 w-20 object-contain" src={image} alt="" />
            <i
              className="ri-delete-bin-line"
              onClick={() => deleteImage(image)}
            ></i>
          </div>
        ))}
      </div>
      <Upload
        listType="picture"
        onChange={(info) => {
          // Update fileList state
          setFileList(info.fileList);

          // Show preview
          setShowPreview(true);
        }}
        fileList={fileList}
        showUploadList={showPreview}
      >
        <Button type="dashed">Upload Image</Button>
      </Upload>
      <div className="flex justify-end gap-5 mt-5">
        <Button
          className="border rounded-[10%]"
          type="default"
          onClick={() => {
            setShowProductForm(false);
          }}
        >
          Cancel
        </Button>

        <Button
          className="border rounded-[10%]"
          type="primary"
          disabled={!fileList.length}
          onClick={upload}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}

export default Images;

