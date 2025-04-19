import { useState } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button 
} from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faIdCard, 
  faPhone, 
  faBuilding, 
  faUsers, 
  faMapMarkerAlt,
  faRoad
} from "@fortawesome/free-solid-svg-icons";
import ParticlesBackground from "../../components/Particles/ParticlesBackground";
import "../Login/Login.css";

// Listas de opções
const EMPRESAS = ["Knapp - Rua Brasilia", "Knapp - Rua Brasilia", "Smart-Trans", "Faculdade das Industrias"];
const SETORES = ["Administrativo", "Comercial", "Financeiro", "Logística", "RH", "TI", "Produção", "Outro"];
const FILIAIS = ["Matriz", "Filial SP", "Filial RJ", "Filial MG", "Filial RS", "Filial PR"];
const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const Register = () => {
  const [formData, setFormData] = useState({
    nome: "", email: "", cpf: "", setor: "", empresa: "", filial: "",
    telefone: "", uf: "", endereco: "", numero: "", cep: ""
  });

  // Função para formatar CPF
  const formatCPF = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  // Função para formatar telefone
  const formatPhone = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    
    if (nums.length === 0) return '';
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
    
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  // Função para formatar CEP
  const formatCEP = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 8);
    
    if (nums.length <= 5) return nums;
    return `${nums.slice(0, 5)}-${nums.slice(5)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplica formatação específica
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    } else if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else if (name === 'cep') {
      setFormData(prev => ({ ...prev, [name]: formatCEP(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateCPF = (cpf) => {
    return cpf.length === 14; // 000.000.000-00
  };

  const validatePhone = (phone) => {
    return phone.length >= 14 && phone.length <= 15; // (00) 0000-0000 ou (00) 00000-0000
  };

  const validateCEP = (cep) => {
    return cep.length === 9; // 00000-000
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações finais
    if (!validateCPF(formData.cpf)) {
      alert("CPF inválido! Formato esperado: 000.000.000-00");
      return;
    }
    
    if (!validatePhone(formData.telefone)) {
      alert("Telefone inválido! Formato esperado: (00) 00000-0000");
      return;
    }
    
    if (!validateCEP(formData.cep)) {
      alert("CEP inválido! Formato esperado: 00000-000");
      return;
    }

    console.log("Dados válidos:", formData);
    // Lógica de envio aqui
  };

  return (
    <div className="login-page">
      <ParticlesBackground />
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs="12" sm="10" md="8" lg="7" xl="6" className="z-3 position-relative">
            
            <Card className="shadow-sm register-card">
              <CardBody className="p-4 d-flex flex-column">
                
                {/* Cabeçalho fixo */}
                <div className="mb-4 text-center">
                  <img
                    src="/knapp_logo.svg.png"
                    alt="Logo da Knapp"
                    className="img-fluid mx-auto d-block mb-3"
                    style={{ maxWidth: "160px" }}
                  />
                  <h2 className="text-center mb-3 register-title">Solicitação de Registro</h2>
                </div>

                {/* Área rolável */}
                <div className="register-scroll-container">
                  <Form onSubmit={handleSubmit}>
                    {/* Grupo 1 - Dados Pessoais */}
                    <fieldset className="form-section mb-4">
                      <legend className="form-section-title">Dados Pessoais</legend>
                      
                      <FormGroup>
                        <Label><FontAwesomeIcon icon={faUser} className="me-2" />Nome Completo*</Label>
                        <Input 
                          type="text" 
                          name="nome" 
                          value={formData.nome} 
                          onChange={handleChange} 
                          required 
                          className="form-input"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email*</Label>
                        <Input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          required 
                          className="form-input"
                        />
                      </FormGroup>

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label><FontAwesomeIcon icon={faIdCard} className="me-2" />CPF*</Label>
                            <Input 
                              type="text" 
                              name="cpf" 
                              value={formData.cpf} 
                              onChange={handleChange} 
                              required 
                              className="form-input"
                              placeholder="000.000.000-00"
                              maxLength="14"
                            />
                            {formData.cpf && !validateCPF(formData.cpf) && (
                              <small className="text-danger">Formato inválido (000.000.000-00)</small>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label><FontAwesomeIcon icon={faPhone} className="me-2" />Telefone*</Label>
                            <Input 
                              type="tel" 
                              name="telefone" 
                              value={formData.telefone} 
                              onChange={handleChange} 
                              required 
                              className="form-input"
                              placeholder="(00) 00000-0000"
                              maxLength="15"
                            />
                            {formData.telefone && !validatePhone(formData.telefone) && (
                              <small className="text-danger">Formato inválido (00) 00000-0000</small>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    </fieldset>

                    {/* Grupo 2 - Dados Profissionais */}
                    <fieldset className="form-section mb-4">
                      <legend className="form-section-title">Dados Profissionais</legend>
                      
                      <FormGroup>
                        <Label><FontAwesomeIcon icon={faBuilding} className="me-2" />Empresa*</Label>
                        <Input 
                          type="select" 
                          name="empresa" 
                          value={formData.empresa} 
                          onChange={handleChange} 
                          required
                          className="form-input"
                        >
                          <option value="">Selecione</option>
                          {EMPRESAS.map(empresa => <option key={empresa} value={empresa}>{empresa}</option>)}
                        </Input>
                      </FormGroup>

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label><FontAwesomeIcon icon={faUsers} className="me-2" />Setor*</Label>
                            <Input 
                              type="select" 
                              name="setor" 
                              value={formData.setor} 
                              onChange={handleChange} 
                              required
                              className="form-input"
                            >
                              <option value="">Selecione</option>
                              {SETORES.map(setor => <option key={setor} value={setor}>{setor}</option>)}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Filial</Label>
                            <Input 
                              type="select" 
                              name="filial" 
                              value={formData.filial} 
                              onChange={handleChange}
                              className="form-input"
                            >
                              <option value="">Selecione</option>
                              {FILIAIS.map(filial => <option key={filial} value={filial}>{filial}</option>)}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </fieldset>

                    {/* Grupo 3 - Endereço */}
                    <fieldset className="form-section mb-4">
                      <legend className="form-section-title">Endereço</legend>
                      
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label><FontAwesomeIcon icon={faEnvelope} className="me-2" />CEP*</Label>
                            <Input 
                              type="text" 
                              name="cep" 
                              value={formData.cep} 
                              onChange={handleChange} 
                              required
                              className="form-input"
                              placeholder="00000-000"
                              maxLength="9"
                            />
                            {formData.cep && !validateCEP(formData.cep) && (
                              <small className="text-danger">Formato inválido (00000-000)</small>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>Número*</Label>
                            <Input 
                              type="text" 
                              name="numero" 
                              value={formData.numero} 
                              onChange={handleChange} 
                              required
                              className="form-input"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>UF*</Label>
                            <Input 
                              type="select" 
                              name="uf" 
                              value={formData.uf} 
                              onChange={handleChange} 
                              required
                              className="form-input"
                            >
                              <option value="">Selecione</option>
                              {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <FormGroup>
                        <Label><FontAwesomeIcon icon={faRoad} className="me-2" />Endereço*</Label>
                        <Input 
                          type="text" 
                          name="endereco" 
                          value={formData.endereco} 
                          onChange={handleChange} 
                          required
                          className="form-input"
                        />
                      </FormGroup>
                    </fieldset>

                    <Button type="submit" block className="mt-4 mb-3 btn-yellow">
                      Solicitar Registro
                    </Button>
                  </Form>
                </div>

                {/* Rodapé fixo */}
                <div className="text-center small pt-2 register-footer">
                  <span className="text-muted">Já possui uma conta? </span>
                  <Link to="/login" className="register-link">
                    Faça login aqui
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;