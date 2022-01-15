import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  Row,
} from "reactstrap";
import { loginUser, checkAuth } from "../../api/users";
import { Link, useNavigate } from "react-router-dom";

export const LoginComponent = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let userObj = {};
    userObj["email"] = email;
    userObj["password"] = password;

    loginUser(userObj)?.then((data) => {
      if (data.data) {
        let res = JSON.parse(data.data);
        let success = res.result;
        if (success === "success") {
          navigate("/");
        } else {
          alert(success);
        }
      }
    });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  useEffect(() => {
    const check = () => {
      checkAuth()?.then((data) => {
        if (data.data) {
          let res = JSON.parse(data.data);
          let success = res.result;

          if (success === "success") {
            navigate("/");
          }
        }
      });
    };

    check();
  }, [navigate]);

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form onSubmit={onSubmit}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign in to your account</p>
                    <InputGroup className="mb-3">
                      <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email"
                        autoComplete="email"
                        required
                      />
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <Input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                      />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Input
                          type="submit"
                          value="Login"
                          color="primary"
                          className="px-4"
                          name="Login"
                        />
                      </Col>
                      <Col xs="3">
                        <Link to="/signup">Register</Link>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
