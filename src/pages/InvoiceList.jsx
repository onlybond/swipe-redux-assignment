import React, { useState } from "react";
import {
  Table,
  Container,
  Button,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import { BiCopy, BiEdit, BiPlusCircle, BiTrash } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import InvoiceModal from "../components/InvoiceModal";
import { removeInvoice } from "../app/features/invoiceSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InvoiceList = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isValid, setIsValid] = useState("valid");
  const [copyInvoice, setCopyInvoice] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = async (invoice) => {
    try {
      const result = await dispatch(removeInvoice(invoice));
      if (result.payload) {
        toast.success("Invoice deleted successfully");
      } else {
        toast.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Unexpected error occurred");
    }
  };

  const invoices = useSelector((state) => state.invoice);
  const isEmpty = invoices.length === 0;
  const handleCopyInvoice = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmedCopyInvoice = copyInvoice.trim();
    if (!trimmedCopyInvoice) {
      setIsValid("empty");
      return;
    }
    const existingInvoice = invoices.find(
      (invoice) => invoice.invoiceNumber === trimmedCopyInvoice
    );
    if (existingInvoice) {
      setIsValid("valid");
      navigate(`/copy/${existingInvoice.invoiceNumber}`);
    } else {
      setIsValid("invalid");
      console.log("Invoice not found");
    }
  };
  const handleEditInvoice = (invoice) => {
    console.log(invoice.invoiceNumber);
    navigate(`/edit/${invoice.invoiceNumber}`);
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Container className="p-4 p-xl-5 my-3 my-xl-4">
        <Card className="p-4 p-xl-5 my-3 my-xl-4">
          <div className="d-flex justify-content-end align-items-start mb-3">
            <InputGroup className="w-auto d-flex flex-column me-3">
              <div>
                <Form.Control
                  type="text"
                  value={copyInvoice}
                  name="invoiceNumber"
                  onChange={(e) => setCopyInvoice(e.target.value)}
                  placeholder="Search invoice..."
                  className="me-2"
                />
                {isValid === "invalid" || isValid === "empty" ? (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {isValid === "invalid"
                      ? "No invoice found"
                      : "Please enter an invoice number"}
                  </Form.Control.Feedback>
                ) : null}
              </div>
            </InputGroup>
            <Button size="md" variant="primary" onClick={handleCopyInvoice}>
              <BiCopy className="me-2" />
              Copy
            </Button>
          </div>

          <Table striped hover>
            <thead>
              <tr>
                <th className="d-sm-table-cell">#</th>
                <th className="d-sm-table-cell">Invoice Number</th>
                <th className="d-none d-sm-table-cell">Date of Issue</th>
                <th className="d-none d-sm-table-cell">Due Date</th>
                <th className="d-sm-table-cell">Bill To</th>
                <th className="d-none d-sm-table-cell">Bill From</th>
                <th className="d-none d-sm-table-cell">Total</th>
                <th className="d-none d-sm-table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isEmpty ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="mb-2">
                    No invoices found
                    </div>
                    <Link to="/create">
                      <Button>
                      <BiPlusCircle className="me-2"/>
                      create one</Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice, index) => (
                  <tr key={index}>
                    <td className="d-sm-table-cell">{index + 1}</td>
                    <td className="d-sm-table-cell">{invoice.invoiceNumber}</td>
                    <td className="d-none d-sm-table-cell">
                      {invoice.dateOfIssue}
                    </td>
                    <td className="d-none d-sm-table-cell">
                      {invoice.dueDate}
                    </td>
                    <td className="d-sm-table-cell">{invoice.billTo}</td>
                    <td className="d-none d-sm-table-cell">
                      {invoice.billFrom}
                    </td>
                    <td className="d-none d-sm-table-cell">
                      {invoice.currency}
                      {invoice.total}
                    </td>
                    <td className="d-flex gap-2">
                      <Button
                        className="btn btn-sm"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        <BiEdit />
                      </Button>
                      <Button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteInvoice(invoice)}
                      >
                        <BiTrash />
                      </Button>
                      <Button
                        className="btn btn-sm btn-info"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <IoMdEye />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
        {selectedInvoice && (
          <InvoiceModal
            showModal={true}
            handleClose={handleCloseModal}
            info={selectedInvoice}
          />
        )}
      </Container>
    </div>
  );
};

export default InvoiceList;
