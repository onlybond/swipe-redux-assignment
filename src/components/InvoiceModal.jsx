import React, { useRef } from "react";
import { Button, Col, Modal, ModalHeader, Row, Table } from "react-bootstrap";
import { BiPen, BiPencil, BiPlusCircle, BiPrinter } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvoiceModal = (props) => {
  const modalRef = useRef();
  const handlePrint = () => {
    const input = modalRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("invoice.pdf");
    });
  };
  const { showModal, handleClose, info, handleFormSubmit, edit,copy } = props;
  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <div className="px-4" ref={modalRef}>
        <div className="d-flex justify-content-between w-100 mt-2">
          <div>
            <h4 className="fw-bold">{info.billFrom}</h4>
            <h6 className="text-secondary">{info.billFromAddress}</h6>
            <h6 className="text-secondary">{info.billFromEmail}</h6>
          </div>
          <div className="d-flex flex-column  align-items-start">
            <span className="text-secondary">
              Invoice Number:&nbsp;&nbsp;
              <span className="fw-bold">#{info.invoiceNumber}</span>
            </span>
            <span>
              Date of Issue:&nbsp;&nbsp;
              <span className="fw-bold">{info.dateOfIssue}</span>
            </span>
            <span>
              Due Date:&nbsp;&nbsp;
              <span className="fw-bold">{info.dueDate}</span>
            </span>
          </div>
        </div>
        <hr />
        <div className="d-flex flex-column justify-content-center align-items-start">
          <span className="text-secondary mb-2 fw-bold ">Billed To:</span>
          <span className="fw-bold">{info.billTo}</span>
          <span>{info.billToAddress}</span>
          <span>{info.billToEmail}</span>
        </div>
        <hr />
        <Table>
          <thead>
            <tr>
              <th>id</th>
              <th>Item</th>
              <th className="text-end">Quantity</th>
              <th className="text-end">Price</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {info.items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {item.name} - {item.description}
                </td>
                <td className="text-end" style={{ width: "100px" }}>
                  {item.quantity}
                </td>
                <td className="text-end" style={{ width: "100px" }}>
                  {info.currency}
                  {item.price}
                </td>
                <td className="text-end" style={{ width: "100px" }}>
                  {info.currency}
                  {item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Table className="">
          <tbody>
            <tr className="text-end">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr className="text-end">
              <td>&nbsp;</td>
              <td className=" fw-bold " style={{ width: "100px" }}>
                Subtotal
              </td>
              <td className="text-end" style={{ width: "100px" }}>
                {info.currency}
                {info.subTotal}
              </td>
            </tr>
            <tr className="text-end">
              <td>&nbsp;</td>
              <td className=" fw-bold " style={{ width: "100px" }}>
                Tax
              </td>
              <td className="text-end style={{ width: '100px' }}">
                {info.currency}
                {info.taxAmount}
              </td>
            </tr>
            <tr className="text-end">
              <td>&nbsp;</td>
              <td className=" fw-bold " style={{ width: "100px" }}>
                Discount
              </td>
              <td className="text-end" style={{ width: "100px" }}>
                {info.currency}
                {info.discountAmount}
              </td>
            </tr>
            <tr className="text-end">
              <td>&nbsp;</td>
              <td className=" fw-bold " style={{ width: "100px" }}>
                Total
              </td>
              <td className="text-end" style={{ width: "100px" }}>
                {info.currency}
                {info.total}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Row className="p-xl-4 p-sm-3 p-2  gap-2 ">
        <Col lg={6} sm={12}>
          <Button
            variant="outline-danger me-2"
            className="px-3 w-100"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col>
          {handleFormSubmit ? (
            <Button className="px-3 w-100" onClick={handleFormSubmit}>
              {edit ? (
                <>
                  <BiPencil
                    style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                  />{" "}
                  Edit Invoice
                </>
              ) : 
                copy? (
                <>
                  <BiPlusCircle
                    style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Copy and Add Invoice
                </>
              ):(
                <>
                  <BiPlusCircle
                    style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Add Invoice
                </>
              )}
            </Button>
          ) : (
            <Button className="px-3 w-100" onClick={handlePrint}>
              <BiPrinter />
              Print
            </Button>
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default InvoiceModal;
