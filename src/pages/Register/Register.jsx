import { useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import ParticlesBackground from "../Particles/ParticlesBackground";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados:", formData);
    // Lógica de envio aqui
  };

  return (
    <div className="login-page">
      <ParticlesBackground />
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs="12" sm="10" md="8" lg="6" className="z-3 position-relative">
            
            {/* Card principal com scroll invisível */}
            <Card className="shadow-sm" style={{ 
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden" // Esconde qualquer overflow
            }}>
              <CardBody className="p-4 d-flex flex-column" style={{ height: "100%" }}>
                
                {/* Cabeçalho fixo */}
                <div className="mb-4">
                  <h2 className="text-center">Solicitação de Registro</h2>
                </div>

                {/* Área rolável com scroll invisível */}
                <div className="flex-grow-1" style={{ 
                  overflowY: "auto",
                  maxHeight: "calc(100% - 100px)",
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE/Edge
                  paddingRight: "12px", // Espaço para não cortar conteúdo
                  marginRight: "-12px" // Compensa o padding
                }}>
                  {/* Esconde a barra no Chrome/Safari */}
                  <style dangerouslySetInnerHTML={{
                    __html: `
                      .login-page ::-webkit-scrollbar {
                        width: 0 !important;
                        display: none;
                      }
                    `
                  }} />
                  
                  <Form onSubmit={handleSubmit}>
                    {/* Dados Pessoais */}
                    <FormGroup>
                      <Label>Nome Completo*</Label>
                      <Input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                      <Label>Email*</Label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                      <Label>CPF*</Label>
                      <Input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                      <Label>Telefone*</Label>
                      <Input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />
                    </FormGroup>

                    {/* Dados Empresariais */}
                    <FormGroup>
                      <Label>Empresa*</Label>
                      <Input type="select" name="empresa" value={formData.empresa} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {EMPRESAS.map(empresa => <option key={empresa} value={empresa}>{empresa}</option>)}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label>Setor*</Label>
                      <Input type="select" name="setor" value={formData.setor} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {SETORES.map(setor => <option key={setor} value={setor}>{setor}</option>)}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label>Filial</Label>
                      <Input type="select" name="filial" value={formData.filial} onChange={handleChange}>
                        <option value="">Selecione</option>
                        {FILIAIS.map(filial => <option key={filial} value={filial}>{filial}</option>)}
                      </Input>
                    </FormGroup>

                    {/* Endereço */}
                    <FormGroup>
                      <Label>CEP*</Label>
                      <Input type="text" name="cep" value={formData.cep} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                      <Label>Endereço*</Label>
                      <Input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Número*</Label>
                          <Input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>UF*</Label>
                          <Input type="select" name="uf" value={formData.uf} onChange={handleChange} required>
                            <option value="">Selecione</option>
                            {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Button color="primary" block className="mt-3 mb-3" type="submit">
                      Solicitar Registro
                    </Button>
                  </Form>
                </div>

                {/* Rodapé fixo */}
                <div className="text-center small pt-2" style={{ marginTop: "auto" }}>
                  <span className="text-muted">Já possui uma conta? </span>
                  <Link to="/login" className="text-primary fw-bold" style={{ textDecoration: "none" }}>
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