import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Invoice from "./pages/Invoice";
import InvoiceList from "./pages/InvoiceList";
import { Navbar, Nav, Container } from "react-bootstrap";
import { SiRedux } from "react-icons/si";
import swipe_logo from "./assets/brand_logo.svg";
function App() {
  return (
    <Router>
      <Navbar expand="md" className="bg-body-secondary sticky-top ">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{ color: "#764abc" }}
            className="d-flex align-items-center gap-1"
          >
            <SiRedux className="me-2" style={{ fontSize: "2rem" }} />
            x
            <img src={swipe_logo} className="mx-2" alt="logo" width="60" />
            Assignment
          </Navbar.Brand>
          <Nav className="me-auto w-100 d-flex justify-content-end">
            <Nav.Link as={Link} to="/create" className="fw-bold btn btn-light ">
              create invoice
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path="/create" element={<Invoice />} />
        <Route path="/edit/:invoiceId" element={<Invoice edit={true}/>} />
        <Route path="/copy/:invoiceId" element={<Invoice copy={true}/>} />
      </Routes>
    </Router>
  );
}

export default App;
