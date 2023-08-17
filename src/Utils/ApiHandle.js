import axios from "axios";
// import { toast } from "react-toastify";

const ApiHandle = async (endPoint, payload, method, handleLoader, toast,params) => {
  if (typeof handleLoader === "function") handleLoader();

  let baseURL = `${process.env.REACT_APP_BASE_API_URL}`;
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  let header = {
    Authorization: "",
    "Content-type": "application/json",
  };
  if (token) {
    header = {
      Authorization: `Bearer ${token}`,
    };
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  try {
    console.log("dfsf", payload);
    // setLoader(true);
    const response = await axios({
      method,
      url: `${baseURL}${endPoint}`,
      data: payload,
      params:params
    });
    return {
      statusCode: response?.status,
      responsePayload: response?.data,
    };
  } catch (err) {
    let errorPayload = {
      statusCode: 500,
      responsePayload: {
        error: [],
        message: "Something went wrong.",
        status: false,
      },
    };
    if (axios.isAxiosError(err)) {
      if (err.response?.data) {
        const { error, message, status } = err.response.data;
        errorPayload = {
          statusCode: err.response?.status || 500,
          responsePayload: {
            error: error || [],
            message: message || "Something went wrong.",
            status: status || false,
          },
        };
      }
    } else if (err instanceof Error) {
      errorPayload = {
        statusCode: 500,
        responsePayload: {
          error: [],
          message: err.message,
          status: false,
        },
      };
    }
    if (toast) {
      toast({
        title: "Error Occured!",
        description: errorPayload.responsePayload.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    return errorPayload;
  } finally {
    if (handleLoader) handleLoader();
  }
};

export default ApiHandle;
