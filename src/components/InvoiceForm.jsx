import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { IoMdPerson, IoIosMail, IoIosPin } from "react-icons/io";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { useDispatch, useSelector } from "react-redux";
import { addInvoice, updateInvoice } from "../app/features/invoiceSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const InvoiceForm = ({ edit, copy }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const generateId = () => {
    return Math.floor(Math.random() * 10000).toFixed(0);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState(
    edit
      ? useSelector((state) =>
          state.invoice.find((inv) => inv.invoiceNumber === params.invoiceId)
        )
      : copy
      ? {
          ...useSelector((state) =>
            state.invoice.find((inv) => inv.invoiceNumber === params.invoiceId)
          ),
          invoiceNumber: generateId(),
        }
      : {
          currency: "$",
          dateOfIssue: "",
          invoiceNumber: generateId(),
          dueDate: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "",
          taxAmount: "0.00",
          discountRate: "",
          discountAmount: "0.00",
          items: [],
        }
  );
  console.log(state);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    handleCalculateTotal();
  }, [state.items, state.taxRate, state.discountRate]);
  const handleRowAdd = () => {
    setState((prevState) => {
      const newItem = {
        id: prevState.items.length,
        name: "",
        description: "",
        price: "1.00",
        quantity: 1,
      };
      return { ...prevState, items: [...prevState.items, newItem] };
    });
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (state.billToEmail && !validateEmail(state.billToEmail)) {
      newErrors.billToEmail = "invalid";
    } else if (state.billToEmail === "") {
      newErrors.billToEmail = "empty";
    } else {
      newErrors.billToEmail = "valid";
    }

    if (state.billFromEmail && !validateEmail(state.billFromEmail)) {
      newErrors.billFromEmail = "invalid";
    } else if (state.billFromEmail === "") {
      newErrors.billFromEmail = "empty";
    } else {
      newErrors.billFromEmail = "valid";
    }

    const currentDate = new Date();
    const dueDate = new Date(state.dueDate);
    if (dueDate < currentDate) {
      newErrors.dueDate = "invalid";
    } else if (dueDate === "") {
      newErrors.dueDate = "empty";
    } else {
      newErrors.dueDate = "valid";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((val) => val === "valid");
  };
  const handleRowDel = (items) => {
    setState((prevState) => {
      const afterDelete = prevState.items.filter(
        (item) => item.id !== items.id
      );
      return { ...prevState, items: afterDelete };
    });
  };

  const handleCalculateTotal = () => {
    const { items, taxRate, discountRate } = state;
    let subTotal = 0;
    items.forEach((item) => {
      subTotal += parseFloat(item.price) * parseFloat(item.quantity);
    });

    const taxAmount = parseFloat(subTotal * (taxRate / 100)).toFixed(2);
    const discountAmount = parseFloat(subTotal * (discountRate / 100)).toFixed(
      2
    );
    const total = (subTotal - discountAmount + parseFloat(taxAmount)).toFixed(
      2
    );

    setState((prevState) => ({
      ...prevState,
      subTotal: subTotal.toFixed(2),
      taxAmount,
      discountAmount,
      total,
    }));
  };

  const onItemizedItemEdit = (e) => {
    const { name, value, id } = e.target;
    const updatedItems = state.items.map((item) => {
      if (item.id === id) {
        return { ...item, [name]: value };
      }
      return item;
    });
    setState((prevState) => ({
      ...prevState,
      items: updatedItems,
    }));
    handleCalculateTotal();
  };

  const editField = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setErrors({ ...errors, [name]: "This field is required" });
    }
    if (name === "dueDate") {
      console.log(name);
      setState((prevState) => ({
        ...prevState,
        [name]: value.split("-").reverse().join("-"),
      }));
    } else {
    }
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onCurrencyChange = (e) => {
    const { value } = e.target;
    setState({ ...state, currency: value });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity() || !validateForm()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (edit) {
      try {
        const result = await dispatch(
          updateInvoice({ invoiceNumber: params.invoiceId, state: state })
        );
        if (result.payload) {
          toast.success("Invoice Updated Successfully");
          setIsOpen(true);
          navigate("/");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      }
    } else {
      if (copy) {
        try {
          const result = await dispatch(addInvoice(state));
          if (result.payload) {
            toast.success("Invoice Copied Successfully");
            setIsOpen(true);
            navigate("/");
          }
        } catch (err) {
          console.log(err);
          toast.error("Something went wrong");
        }
      } else {
        try {
          const result = await dispatch(addInvoice(state));
          if (result.payload) {
            toast.success("Invoice Added Successfully");
            setIsOpen(true);
            navigate("/");
          }
        } catch (err) {
          console.log(err);
          toast.error("Something went wrong");
        }
      }
    }
  };
  const onModalShow = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity() || !validateForm()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setState({
      ...state,
      dateOfIssue: new Date()
        .toLocaleDateString("en-in", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("-"),
    });
    setIsOpen(true);
  };
  const onModalHide = () => {
    setIsOpen(false);
  };

  return (
    <Form onSubmit={onModalShow} noValidate validated={validated}>
      <Card className="p-4 p-xl-5 my-3 my-xl-4">
        <div className="d-flex flex-row align-items-end justify-content-end mb-3 gap-2 ">
          <InvoiceModal
            showModal={isOpen}
            handleClose={onModalHide}
            info={state}
            handleFormSubmit={handleFormSubmit}
            edit={edit}
            copy={copy}
          />
          <Row className="gap-2">
            <Col sm={12} lg={6} className="d-flex align-items-center    gap-2 ">
              <div className="d-flex flex-column align-items-start">
                <Form.Label className="fw-bold">Tax rate</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="taxRate"
                    value={state.taxRate}
                    onChange={editField}
                    placeholder="0.0"
                    min="0.00"
                    step="0.1"
                    max="100.00"
                    className="d-sm-block"
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </div>
              <div className="d-flex flex-column align-items-start">
                <Form.Label className="fw-bold">Discount</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="discountRate"
                    value={state.discountRate}
                    onChange={editField}
                    placeholder="0.0"
                    min="0.00"
                    step="0.1"
                    max="100.00"
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </div>
            </Col>
            <Col className="d-flex align-items-end gap-2">
              <div className="d-flex flex-column align-items-start ">
                <Form.Label className="fw-bold">Currency</Form.Label>
                <Form.Select onChange={onCurrencyChange}>
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="€">EUR (Euro)</option>
                  <option value="₹">INR (Indian Rupee)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Signapore Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
              </div>
              <Button variant="primary" type="submit" className="h-auto ">
                Review
              </Button>
            </Col>
          </Row>
        </div>
        <hr />
        <Row>
          <Col xl={6} lg={6} md={6} sm={12} xs={12}>
            <div className="d-flex align-items-center mb-2">
              <span className="fw-bold">Current&nbsp;date:&nbsp;</span>
              <span className="fw-bold">
                {new Date()
                  .toLocaleDateString("en-in")
                  .split("/")
                  .reverse()
                  .join("-")}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span className="fw-bold">Due&nbsp;date</span>
              <Form.Control
                type="date"
                name="dueDate"
                value={state.dueDate}
                onChange={editField}
                isInvalid={errors.dueDate === "invalid"}
                isValid={errors.dueDate === "valid"}
                required
                style={{
                  maxWidth: "150px",
                }}
              />
              {errors.dueDate === "invalid" ? (
                <Form.Control.Feedback type="invalid">
                  Due date cannot be in the past
                </Form.Control.Feedback>
              ) : (
                <Form.Control.Feedback type="invalid">
                  this field is required
                </Form.Control.Feedback>
              )}
            </div>
          </Col>
          <Col>
            <div className="d-flex align-items-center justify-content-end  mb-2">
              <span>Invoice&nbsp;number:&nbsp;</span>
              <span className="fw-bold">#{state.invoiceNumber}</span>
            </div>
          </Col>
        </Row>
        <Row className="d-flex flex-row justify-content-between mt-5">
          <Col className="d-flex flex-column align-items-start">
            <Form.Label className="fw-bold">Bill To:</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <IoMdPerson />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="billTo"
                value={state.billTo}
                onChange={editField}
                required
                placeholder="Enter name"
                autoComplete="off"
              />
              <Form.Control.Feedback className="w-100 text-end" type="invalid">
                this field is required
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <IoIosMail />
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="billToEmail"
                value={state.billToEmail}
                onChange={editField}
                isInvalid={errors.billToEmail === "invalid"}
                required
                placeholder="abc@gmail.com"
                autoComplete="off"
              />
              {errors.billToEmail === "invalid" ? (
                <Form.Control.Feedback
                  className="w-100 text-end"
                  type="invalid"
                >
                  wrong email format eg : abc@gmail.com
                </Form.Control.Feedback>
              ) : (
                <Form.Control.Feedback
                  className="w-100 text-end"
                  type="invalid"
                >
                  this field is required
                </Form.Control.Feedback>
              )}
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <IoIosPin />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="billToAddress"
                value={state.billToAddress}
                onChange={editField}
                required
                placeholder="Enter address"
                autoComplete="off"
              />
              <Form.Control.Feedback className="w-100 text-end" type="invalid">
                this field is required
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
          <Col className="d-flex flex-column align-items-start">
            <Form.Label className="fw-bold">Bill From:</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <IoMdPerson />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="billFrom"
                value={state.billFrom}
                onChange={editField}
                required
                placeholder="Enter name"
                autoComplete="off"
              />
              <Form.Control.Feedback className="w-100 text-end" type="invalid">
                this field is required
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <IoIosMail />
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="billFromEmail"
                value={state.billFromEmail}
                onChange={editField}
                required
                isInvalid={errors.billFromEmail === "invalid"}
                isValid={errors.billFromEmail === "valid"}
                placeholder="abc@gmail.com"
                autoComplete="off"
              />
              {errors.billFromEmail === "invalid" ? (
                <Form.Control.Feedback
                  className="w-100 text-end"
                  type="invalid"
                >
                  wrong email format eg : abc@gmail.com
                </Form.Control.Feedback>
              ) : (
                <Form.Control.Feedback
                  className="w-100 text-end"
                  type="invalid"
                >
                  this field is required
                </Form.Control.Feedback>
              )}
            </InputGroup>
            <InputGroup className="mb-2 d-flex">
              <InputGroup.Text>
                <IoIosPin />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="billFromAddress"
                value={state.billFromAddress}
                onChange={editField}
                required
                placeholder="Enter Address"
                autoComplete="off"
              />
              <Form.Control.Feedback className="w-100 text-end" type="invalid">
                this field is required
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Row>
        <InvoiceItem
          onItemizedItemEdit={onItemizedItemEdit}
          onRowAdd={handleRowAdd}
          onRowDel={handleRowDel}
          currency={state.currency}
          items={state.items}
        />
        <Row className="mt-4 justify-content-end">
          <Col lg={6}>
            <div className="d-flex flex-row align-items-start justify-content-between">
              <span className="fw-bold">SubTotal</span>
              <span>
                {state.currency}
                {state.subTotal}
              </span>
            </div>
            <div className="d-flex flex-row align-items-start justify-content-between mt-2 ">
              <span className="fw-bold">Discount</span>
              <span>
                <span className="small">
                  ({state.discountRate || 0}%)&nbsp;
                </span>
                {state.currency}
                {state.discountAmount || 0}
              </span>
            </div>
            <div className="d-flex flex-row align-items-start justify-content-between mt-2 ">
              <span className="fw-bold">Tax</span>
              <span>
                <span className="small">({state.taxRate || 0}%)&nbsp;</span>
                {state.currency}
                {state.taxAmount || 0}
              </span>
            </div>
            <hr />
            <div className="d-flex flex-row align-items-start justify-content-between">
              <span className="fw-bold">Total</span>
              <span className="fw-bold">
                {state.currency}
                {state.total || 0}
              </span>
            </div>
          </Col>
        </Row>
        <hr className="my-4" />
      </Card>
    </Form>
  );
};

export default InvoiceForm;
