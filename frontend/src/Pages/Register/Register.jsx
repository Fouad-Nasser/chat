import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Toast from 'react-bootstrap/Toast';
import axios from "axios";
import Stack from 'react-bootstrap/Stack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';


const Register = () => {
    const [showPass, setshowPass] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [image, setImage] = useState();
    const [show, setShow] = useState(false);
    const [toastMeesage, setToastMeesage] = useState(false);
    const navigate = useNavigate();
  
    const { setUser } = ChatState();

    const showHide = ()=>{
      setshowPass(!showPass);
    }
  
  
    const registerHandler = async () => {
      if (!name || !email || !password || !confirmpassword) {
        setToastMeesage("Must Fill all Feilds");
        setShow(true);
        return;
      }
    if (password !== confirmpassword) {
      setToastMeesage("Passwords Do Not Match");
      setShow(true);
      return;
    }
    console.log(name, email, password, image);
   
   
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        {
          name,
          email,
          password,
          image,
        },
        config
      );
      console.log(data);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      setToastMeesage("Something has been error");
      setShow(true);
    }
    };


    const postImage = (img) => {
        if (img === undefined) {
          setToastMeesage("Please Select an Image!");
          setShow(true);
          return;
        }


        console.log(img);

        if (img.type === "image/jpeg" || img.type === "image/png") {
          const data = new FormData();
          data.append("file", img);
          data.append("upload_preset", "chat-app");
          data.append("cloud_name", "dr3swllgw");
          axios.post("https://api.cloudinary.com/v1_1/dr3swllgw/upload", data)
            .then(({data}) => {
              setImage(data.url);
              console.log(data.url);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setToastMeesage("Please Select an Image!");
          setShow(true);
          return;
        }
      };


    return (
        <div className="loginPage d-flex flex-column justify-content-between">
          <Header/>
          <Container>          
            <Row className='justify-content-center'>
              <Col className='col-md-8 border border-3 p-3'>
              <Stack>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                    required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type={showPass?"text":"password"}
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type={showPass?"text":"password"}
                    placeholder="Password" 
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    required/>
                </Form.Group>

                <i onClick={showHide} className={`showHidePass mb-4 ${showPass?"bi bi-eye-slash":"bi bi-eye"}`}>
                    {showPass?" Hide Password":" Show Password"}
                </i>

                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Select User Image</Form.Label>
                  <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => postImage(e.target.files[0])}
                  />
                </Form.Group>
                
                <Button 
                className='w-100 btn btn-primary btn-lg' 
                variant="primary"
                onClick={registerHandler}
                type="button">
                  Sign Up
                </Button>
              </Stack>
              </Col>
            </Row>

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
          </Container>
          <Footer/>
      </div>
    );
};

export default Register;