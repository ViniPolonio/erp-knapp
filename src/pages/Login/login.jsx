import { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import ParticlesBackground from "../Particles/ParticlesBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    document.body.classList.add("login-body");
    return () => document.body.classList.remove("login-body");
  }, []);

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast.error("Digite um e-mail válido!");
      return;
    }
    toast.success(`Link de recuperação enviado para: ${forgotEmail}`);
    setShowForgotPassword(false);
    setForgotEmail("");
  };

  return (
    <div className="login-page">
      <ParticlesBackground />
      <ToastContainer position="top-right" autoClose={3000} />
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs="10" sm="8" md="5" lg="4" className="z-3 position-relative">
            <Card className="shadow-sm">
              <CardBody className="p-4">
                <h2 className="text-center mb-3" style={{ fontSize: "1.5rem" }}>Login</h2>
                <Form>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-2"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="senha">Senha</Label>
                    <Input
                      type="password"
                      id="senha"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-2"
                    />
                  </FormGroup>
                  <FormGroup check className="mb-2 mt-2">
                    <Input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <Label for="remember" check className="small">
                      Lembrar credenciais
                    </Label>
                  </FormGroup>
                  <Button color="primary" block className="mt-2 py-2">
                    Entrar
                  </Button>
                  <div className="text-center mt-2">
                    <Button
                      color="link"
                      className="p-0 small"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <div className="text-center mt-4" style={{ fontSize: "1rem" }}> {/* Aumentei de small para 0.95rem */}
                    <span className="text-muted">Não possui registro na Knapp? Deseja solicitar um registro?</span>{" "}
                    <Link 
                      to="/register" 
                      className="text-primary fw-bold" 
                      style={{ textDecoration: "none" }}
                    >
                      Clique aqui!
                    </Link>
                  </div>
                </Form>
              </CardBody>
            </Card>

            {showForgotPassword && (
              <Card className="shadow-sm mt-3">
                <CardBody className="p-4">
                  <h5 className="text-center mb-2" style={{ fontSize: "1.25rem" }}>Recuperar Senha</h5>
                  <FormGroup>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="py-2"
                    />
                  </FormGroup>
                  <div className="d-flex justify-content-between mt-2">
                    <Button
                      color="secondary"
                      outline
                      size="sm"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Cancelar
                    </Button>
                    <Button color="primary" size="sm" onClick={handleForgotPassword}>
                      Enviar
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;