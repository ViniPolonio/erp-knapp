import { useEffect, useState } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Form, 
  FormGroup, 
  Input, 
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter 
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import ParticlesBackground from "../Particles/ParticlesBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    document.body.classList.add("login-body");
    return () => document.body.classList.remove("login-body");
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let valid = true;

    if (!email) newErrors.email = 'Insira seu email';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';

    if (!password) newErrors.password = 'Insira sua senha';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    setErrors(newErrors);
    return valid = !newErrors.email && !newErrors.password;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    validateForm() && toast.success('Login validado!');
  };

  const handleForgotPassword = () => {
    if (!validateEmail(forgotEmail)) {
      toast.error(forgotEmail ? "Email inválido" : "Digite seu email");
      return;
    }
    toast.success(`Link enviado para: ${forgotEmail}`);
    setForgotPasswordModal(false);
  };

  return (
    <div className="login-page">
      <ParticlesBackground />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs="10" sm="8" md="5" lg="4" className="z-3 position-relative">
            <Card className="shadow-sm login-card">
              <CardBody className="p-4">
                <img
                  src="/knapp_logo.svg.png"
                  alt="Logo Knapp"
                  className="img-fluid mx-auto d-block mb-4"
                  style={{ maxWidth: "160px" }}
                />
                
                <Form onSubmit={handleLogin} className="login-form">
                  {/* Campo Email */}
                  <FormGroup>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`form-input ${errors.email && 'is-invalid'}`}
                    />
                    {errors.email && <div className="error-feedback">{errors.email}</div>}
                  </FormGroup>

                  {/* Campo Senha */}
                  <FormGroup>
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`form-input ${errors.password && 'is-invalid'}`}
                    />
                    {errors.password && <div className="error-feedback">{errors.password}</div>}
                  </FormGroup>

                  {/* Lembrar credenciais */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="form-check-input"
                      />
                      <label htmlFor="remember" className="form-check-label small">
                        Lembrar-me
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none forgot-password-btn"
                      onClick={() => setForgotPasswordModal(true)}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  {/* Botão Entrar */}
                  <Button type="submit" block className="btn-login">
                    Entrar
                  </Button>
                </Form>

                {/* Rodapé */}
                <div className="text-center mt-4">
                  <span className="text-muted">Não tem cadastro? </span>
                  <Link to="/register" className="register-link">
                    Solicite acesso
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal Recuperação de Senha */}
      <Modal isOpen={forgotPasswordModal} toggle={() => setForgotPasswordModal(false)} centered>
        <ModalHeader toggle={() => setForgotPasswordModal(false)} className="border-0 pb-0">
          <h5 className="modal-title">Recuperar Senha</h5>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              type="email"
              placeholder="Digite seu email cadastrado"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="form-input"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter className="border-0 pt-0">
          <Button color="light" onClick={() => setForgotPasswordModal(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleForgotPassword} className="btn-yellow">
            Enviar Link
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Login;