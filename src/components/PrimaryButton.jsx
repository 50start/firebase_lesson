import React from "react";
import { Button } from "@chakra-ui/react";

export const PrimaryButton = (props) => {
  const { children, onClick } = props;

  return (
    <Button
      color="white"
      backgroundColor="#276749"
      _hover={{ color: "black", backgroundColor: "#F0FFF4" }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
