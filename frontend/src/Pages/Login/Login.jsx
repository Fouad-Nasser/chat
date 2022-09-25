import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import "./Login.css";
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Toast from 'react-bootstrap/Toast';
import axios from "axios";
import Stack from 'react-bootstrap/Stack';
import { Link, useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {
  const [showPass, setshowPass] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [toastMeesage, setToastMeesage] = useState(false);
  const navigate = useNavigate();

  const { setUser } = ChatState();


  const showHide = ()=>{
    setshowPass(!showPass);
  }


  const loginHandler = async () => {
    if (!email || !password) {
      setToastMeesage("Must Fill all Feilds");
      setShow(true);
      return;
    }

    console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );

      console.log(JSON.stringify(data));
      setUser(data)
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      setToastMeesage(error.response.data.message);
      console.log(error);
      setShow(true);
    }
  };


    return (
      <div className="loginPage d-flex flex-column justify-content-between">
          <Header/>
          <Container>
            <Row className='justify-content-center'>
              <Col className='m-3 col-auto'>
              <Toast show={show} onClose={()=>{setShow(false)}} bg="danger">
                <Toast.Header>
                  <strong className="me-auto">
                    <i className='bi bi-exclamation-circle m-1 errIcon'/>
                     Error
                  </strong>
                </Toast.Header>
                <Toast.Body className='text-white toastBody'>{toastMeesage}</Toast.Body>
              </Toast>
              </Col>
            </Row>
          
            <Row className='justify-content-center'>
              <Col className='col-md-8 border border-3 p-3'>
              <Stack>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type={showPass?"text":"password"}
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                  <i onClick={showHide} className={`showHidePass ${showPass?"bi bi-eye-slash":"bi bi-eye"}`}>
                    {showPass?" Hide Password":" Show Password"}
                  </i>
                </Form.Group>
                
                <Button 
                className='w-100 btn btn-primary btn-lg' 
                variant="primary"
                onClick={loginHandler}
                type="button">
                  Login
                </Button>

                  <Link to="/register"  className='w-100 mt-3 btn btn-success btn-lg'>
                      Create a New Account
                  </Link>
              </Stack>
              </Col>
            </Row>
          </Container>
          <Footer/>
      </div>
      
    );
};

export default Login;