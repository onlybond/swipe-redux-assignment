import React from "react";
import { Container } from "react-bootstrap";
import InvoiceForm from "../components/InvoiceForm";
const Invoice = ({edit,copy}) => {
  return (
    <div className="App d-flex flex-column justify-content-center align-items-center vw-100">
      <Container>
        <InvoiceForm edit={edit} copy={copy} />
      </Container>
    </div>
  );
};

export default Invoice;
