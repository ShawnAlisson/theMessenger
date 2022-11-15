import axios from "axios";
import { Link } from "react-router-dom";

import { useToast } from "@chakra-ui/react";

export default function SendEmail({ email, setVisible, loading, setLoading }) {
  const toast = useToast();
  const sendEmail = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/sendResetPasswordCode`,
        { email }
      );

      setVisible(2);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Oops!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <button
        onClick={() => {
          sendEmail();
        }}
      >
        Send Email
      </button>
    </>
  );
}
