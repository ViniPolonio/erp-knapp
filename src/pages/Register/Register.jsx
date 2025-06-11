import { useState, useEffect } from "react";
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
  Button,
  Progress,
  Alert
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
  faRoad,
  faLock,
  faCheckCircle,
  faEdit,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import ParticlesBackground from "../../components/Particles/ParticlesBackground";
import "../Login/Login.css";
import { getCompaniesWithBranches, getAllDepartments, getCompanyDepartments, registerUser } from "../../services/Consults";

const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const Register = () => {
  const [formData, setFormData] = useState({
    nome: "", email: "", cpf: "", telefone: "", password: "", confirmPassword: "",
    empresa: "", filial: "", setor: "", uf: "", endereco: "", numero: "", cep: ""
  });

  const [companies, setCompanies] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState({
    companies: false,
    departments: false
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingCEP, setLoadingCEP] = useState(false);

  // Carrega empresas e departamentos ao montar o componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(prev => ({...prev, companies: true}));
        
        // Carrega empresas e departamentos em paralelo
        const [companiesData, departmentsData] = await Promise.all([
          getCompaniesWithBranches(),
          getAllDepartments()
        ]);
        
        setCompanies(companiesData);
        setAllDepartments(departmentsData);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setLoading(prev => ({...prev, companies: false}));
      }
    };
    
    loadInitialData();
  }, []);

  // Atualiza branches quando empresa é selecionada
  useEffect(() => {
    if (formData.empresa) {
      const selectedCompany = companies.find(c => c.id.toString() === formData.empresa);
      if (selectedCompany) {
        setBranches(selectedCompany.branches || []);
        setFormData(prev => ({...prev, filial: "", setor: ""}));
      }
    } else {
      setBranches([]);
    }
  }, [formData.empresa, companies]);

  // Atualiza departamentos disponíveis quando empresa ou filial muda
  useEffect(() => {
    const loadCompanyDepartments = async () => {
      if (formData.empresa && formData.filial) {
        try {
          setLoading(prev => ({...prev, departments: true}));
          
          const companyDepts = await getCompanyDepartments(
            parseInt(formData.empresa),
            parseInt(formData.filial)
          );
          
          // Filtra departamentos ativos e mapeia para o formato completo
          const activeDeptIds = companyDepts
            .filter(dept => dept.status === 1)
            .map(dept => dept.departament_id);
          
          const filteredDepts = allDepartments.filter(dept => 
            activeDeptIds.includes(dept.id)
          );
          
          setAvailableDepartments(filteredDepts);
        } catch (error) {
          console.error("Erro ao carregar departamentos:", error);
        } finally {
          setLoading(prev => ({...prev, departments: false}));
        }
      } else {
        setAvailableDepartments([]);
      }
    };
    
    loadCompanyDepartments();
  }, [formData.empresa, formData.filial, allDepartments]);

  // Funções de formatação CPF, TELL E CEP
  const formatCPF = (value) => value.replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const formatPhone = (value) => value.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');

  const formatCEP = (value) => value.replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2');

    const handleChange = async (e) => {
      const { name, value } = e.target;
      
      if (name === 'cpf') {
        setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
      } else if (name === 'telefone') {
        setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
      } else if (name === 'cep') {
        const formattedCEP = formatCEP(value);
        setFormData(prev => ({ ...prev, [name]: formattedCEP }));
        
        // Quando o CEP estiver completo (9 caracteres com traço), faz a consulta
        if (formattedCEP.length === 9) {
          try {
            setLoadingCEP(true);
            const addressData = await fetchAddressFromCEP(formattedCEP);
            if (addressData) {
              setFormData(prev => ({
                ...prev,
                endereco: addressData.endereco,
                uf: addressData.uf
              }));
            }
          } catch (error) {
            console.error("Erro ao buscar endereço:", error);
          } finally {
            setLoadingCEP(false);
          }
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    
      if (errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
      }
    };

  // Validações melhoradas com mensagens de erro
  const validateField = (name, value) => {
    switch(name) {
      case 'nome':
        if (!value) return "Nome completo é obrigatório";
        if (value.length < 3) return "Nome muito curto";
        return null;
      case 'email':
        if (!value) return "Email é obrigatório";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
        return null;
      case 'cpf':
        if (!value) return "CPF é obrigatório";
        if (value.length !== 14) return "CPF inválido (000.000.000-00)";
        return null;
      case 'telefone':
        if (!value) return "Telefone é obrigatório";
        if (value.length < 14) return "Telefone inválido (00) 00000-0000";
        return null;
      case 'password':
        if (!value) return "Senha é obrigatória";
        if (value.length < 6) return "Senha deve ter pelo menos 6 caracteres";
        return null;
      case 'confirmPassword':
        if (value !== formData.password) return "As senhas não coincidem";
        return null;
      case 'empresa':
        if (!value) return "Empresa é obrigatória";
        return null;
      case 'setor':
        if (!value) return "Setor é obrigatório";
        return null;
      case 'cep':
        if (!value) return "CEP é obrigatório";
        if (value.length !== 9) return "CEP inválido (00000-000)";
        return null;
      case 'endereco':
        if (!value) return "Endereço é obrigatório";
        return null;
      case 'numero':
        if (!value) return "Número é obrigatório";
        return null;
      case 'uf':
        if (!value) return "UF é obrigatória";
        return null;
      default:
        return null;
    }
  };

  const validateStep = (step) => {
    // Definimos os campos para cada passo
    const stepFields = {
      1: ['nome', 'email', 'cpf', 'telefone', 'password', 'confirmPassword'],
      2: ['empresa', 'setor'],
      3: ['cep', 'endereco', 'numero', 'uf']
    };
  
    // Verificamos se o step existe no objeto
    if (!stepFields[step]) {
      console.error(`Step ${step} não encontrado`);
      return false;
    }
  
    const newErrors = {};
    let isValid = true;
  
    // Usamos o operador opcional (?.) para segurança
    stepFields[step]?.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    setFormSubmitted(true);
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setFormSubmitted(false);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitStatus('loading');
      
      // Valida todos os passos antes de enviar
      const isStep1Valid = validateStep(1);
      const isStep2Valid = validateStep(2);
      const isStep3Valid = validateStep(3);
      
      if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
        setSubmitStatus(null);
        setCurrentStep(1); // Volta para o primeiro passo com erros
        return;
      }
  
      // Prepara os dados no formato esperado pelo back-end
      const userData = {
        name: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ''),
        phone_number: formData.telefone.replace(/\D/g, ''),
        company_id: parseInt(formData.empresa),
        branch_id: parseInt(formData.filial),
        departament_id: parseInt(formData.setor), // Corrigido aqui
        uf: formData.uf,
        endereco_detail: formData.endereco,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        numero: formData.numero,
        cep: formData.cep.replace(/\D/g, ''),
      };
  
      console.log("Dados sendo enviados:", userData);
      
      // Chama a função de registro
      await registerUser(userData);
      
      setSubmitStatus('success');
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus('error');
      
      let errorMessage = "Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.";
      
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors(prev => ({ ...prev, form: errorMessage }));
    }
  };

  const fetchAddressFromCEP = async (cep) => {
    try {
      // Remove caracteres não numéricos
      const cleanedCEP = cep.replace(/\D/g, '');
      
      // Verifica se o CEP tem 8 dígitos
      if (cleanedCEP.length !== 8) return null;
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        return null;
      }
      
      return {
        endereco: data.logradouro || '',
        uf: data.uf || '',
        // Pode adicionar outros campos se necessário: bairro, cidade, etc.
      };
    } catch (error) {
      console.error("Erro ao consultar ViaCEP:", error);
      return null;
    }
  };

  // Renderização condicional dos steps
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <h4 className="mb-4 text-center"><FontAwesomeIcon icon={faUser} className="me-2" />Dados Pessoais</h4>
            
            <FormGroup>
              <Label><FontAwesomeIcon icon={faUser} className="me-2" />Nome Completo*</Label>
              <Input 
                type="text" 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                invalid={!!errors.nome}
                className="form-input"
              />
              {errors.nome && <small className="text-danger d-block mt-1">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                {errors.nome}
              </small>}
            </FormGroup>

            <FormGroup>
              <Label><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email*</Label>
              <Input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                invalid={!!errors.email}
                className="form-input"
              />
              {errors.email && <small className="text-danger d-block mt-1">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                {errors.email}
              </small>}
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
                    invalid={!!errors.cpf}
                    className="form-input"
                    placeholder="000.000.000-00"
                    maxLength="14"
                  />
                  {errors.cpf && <small className="text-danger d-block mt-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    {errors.cpf}
                  </small>}
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
                    invalid={!!errors.telefone}
                    className="form-input"
                    placeholder="(00) 00000-0000"
                    maxLength="15"
                  />
                  {errors.telefone && <small className="text-danger d-block mt-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    {errors.telefone}
                  </small>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label><FontAwesomeIcon icon={faLock} className="me-2" />Senha*</Label>
                  <Input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    invalid={!!errors.password}
                    className="form-input"
                  />
                  {errors.password && <small className="text-danger d-block mt-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    {errors.password}
                  </small>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label><FontAwesomeIcon icon={faLock} className="me-2" />Confirmar Senha*</Label>
                  <Input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    invalid={!!errors.confirmPassword}
                    className="form-input"
                  />
                  {errors.confirmPassword && <small className="text-danger d-block mt-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    {errors.confirmPassword}
                  </small>}
                </FormGroup>
              </Col>
            </Row>
          </>
        );
      case 2:
        return (
          <>
            <h4 className="mb-4 text-center"><FontAwesomeIcon icon={faBuilding} className="me-2" />Dados Profissionais</h4>
            
            <FormGroup>
              <Label><FontAwesomeIcon icon={faBuilding} className="me-2" />Empresa*</Label>
              <Input 
                type="select" 
                name="empresa" 
                value={formData.empresa} 
                onChange={handleChange} 
                invalid={!!errors.empresa}
                className="form-input"
                disabled={loading.companies}
              >
                <option value="">Selecione</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Input>
              {loading.companies && <small>Carregando empresas...</small>}
              {errors.empresa && <small className="text-danger d-block mt-1">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                {errors.empresa}
              </small>}
            </FormGroup>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Filial</Label>
                  <Input 
                    type="select" 
                    name="filial" 
                    value={formData.filial} 
                    onChange={handleChange}
                    className="form-input"
                    disabled={!formData.empresa || branches.length === 0}
                  >
                    <option value="">Selecione</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </Input>
                  {formData.empresa && branches.length === 0 && (
                    <small className="text-muted">Nenhuma filial disponível para esta empresa</small>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label><FontAwesomeIcon icon={faUsers} className="me-2" />Setor*</Label>
                  <Input 
                    type="select" 
                    name="setor" 
                    value={formData.setor} 
                    onChange={handleChange} 
                    invalid={!!errors.setor}
                    className="form-input"
                    disabled={loading.departments || !formData.filial}
                  >
                    <option value="">Selecione</option>
                    {availableDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.title}
                      </option>
                    ))}
                  </Input>
                  {loading.departments && <small>Carregando setores...</small>}
                  {errors.setor && <small className="text-danger d-block mt-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    {errors.setor}
                  </small>}
                </FormGroup>
              </Col>
            </Row>
          </>
        );
      case 3:
        return (
          <>
            <h4 className="mb-4 text-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Endereço</h4>
            
            <Row>
              <Col md={4}>
              <FormGroup>
                <Label><FontAwesomeIcon icon={faEnvelope} className="me-2" />CEP*</Label>
                <div className="position-relative">
                  <Input 
                    type="text" 
                    name="cep" 
                    value={formData.cep} 
                    onChange={handleChange} 
                    invalid={!!errors.cep}
                    className="form-input"
                    placeholder="00000-000"
                    maxLength="9"
                  />
                  {loadingCEP && (
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  )}
                </div>
                {errors.cep && <small className="text-danger d-block mt-1">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                  {errors.cep}
                </small>}
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
                    invalid={!!errors.numero}
                    className="form-input"
                  />
                  {errors.numero && <small className="text-danger d-block mt-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    {errors.numero}
                  </small>}
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
                    invalid={!!errors.uf}
                    className="form-input"
                  >
                    <option value="">Selecione</option>
                    {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </Input>
                  {errors.uf && <small className="text-danger d-block mt-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    {errors.uf}
                  </small>}
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
                invalid={!!errors.endereco}
                className="form-input"
              />
              {errors.endereco && <small className="text-danger d-block mt-1">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                {errors.endereco}
              </small>}
            </FormGroup>
          </>
        );
        case 4:
          return (
            <>
              <h4 className="mb-4 text-center">
                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                Revisão dos Dados
              </h4>

              {!formData.empresa || !formData.filial || !formData.setor ? (
                <Alert color="warning" className="text-center">
                  <h4 className="alert-heading">Dados incompletos</h4>
                  <p>Por favor, volte e complete todas as informações necessárias.</p>
                  <Button color="warning" onClick={() => setCurrentStep(1)}>
                    Voltar para correção
                  </Button>
                </Alert>
              ) : submitStatus === 'success' ? (
                <Alert color="success" className="text-center">
                  <h4 className="alert-heading">Cadastro realizado com sucesso!</h4>
                  <p>Seu registro foi enviado para aprovação.</p>
                  <Link to="/login" className="btn btn-success">
                    Ir para Login
                  </Link>
                </Alert>
              ) : submitStatus === 'error' ? (
                <Alert color="danger" className="text-center">
                  <h4 className="alert-heading">Erro no cadastro</h4>
                  <p>{errors.form || "Ocorreu um erro ao enviar seus dados. Por favor, tente novamente."}</p>
                  <Button color="danger" onClick={() => setSubmitStatus(null)}>
                    Tentar novamente
                  </Button>
                </Alert>
              ) : (
                <>
                  <Card className="mb-4">
                    <CardBody>
                      <h5><FontAwesomeIcon icon={faUser} className="me-2" />Dados Pessoais</h5>
                      <p><strong>Nome:</strong> {formData.nome}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>CPF:</strong> {formData.cpf}</p>
                      <p><strong>Telefone:</strong> {formData.telefone}</p>
                      
                      <Button color="link" size="sm" onClick={() => setCurrentStep(1)}>
                        <FontAwesomeIcon icon={faEdit} className="me-1" /> Editar
                      </Button>
                    </CardBody>
                  </Card>

                  <Card className="mb-4">
                    <CardBody>
                      <h5><FontAwesomeIcon icon={faBuilding} className="me-2" />Dados Profissionais</h5>
                      <p><strong>Empresa:</strong> {companies.find(c => c.id.toString() === formData.empresa)?.name || 'Não informado'}</p>
                      <p><strong>Filial:</strong> {branches.find(b => b.id.toString() === formData.filial)?.name || 'Não informado'}</p>
                      <p><strong>Setor:</strong> {availableDepartments.find(d => d.id.toString() === formData.setor)?.title || 'Não informado'}</p>
                      
                      <Button color="link" size="sm" onClick={() => setCurrentStep(2)}>
                        <FontAwesomeIcon icon={faEdit} className="me-1" /> Editar
                      </Button>
                    </CardBody>
                  </Card>

                  <Card className="mb-4">
                    <CardBody>
                      <h5><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Endereço</h5>
                      <p><strong>CEP:</strong> {formData.cep}</p>
                      <p><strong>Endereço:</strong> {formData.endereco}, {formData.numero}</p>
                      <p><strong>UF:</strong> {formData.uf}</p>
                      
                      <Button color="link" size="sm" onClick={() => setCurrentStep(3)}>
                        <FontAwesomeIcon icon={faEdit} className="me-1" /> Editar
                      </Button>
                    </CardBody>
                  </Card>

                  <div className="d-flex justify-content-between mt-4">
                    <Button color="secondary" onClick={prevStep}>
                      Voltar
                    </Button>
                    <Button 
                      color="primary" 
                      onClick={handleSubmit}
                      disabled={submitStatus === 'loading'}
                    >
                      {submitStatus === 'loading' ? 'Enviando...' : 'Confirmar Cadastro'}
                    </Button>
                  </div>
                </>
              )}
            </>
          );
      default:
        return null;
    }
  };

  return (
    <div className="login-page">
      <ParticlesBackground />
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs="12" sm="10" md="8" lg="7" xl="6" className="z-3 position-relative">
            
            <Card className="shadow-sm register-card">
              <CardBody className="p-4 d-flex flex-column">
                
                <div className="mb-4 text-center">
                  <img
                    src="/knapp_logo.svg.png"
                    alt="Logo da Knapp"
                    className="img-fluid mx-auto d-block mb-3"
                    style={{ maxWidth: "160px" }}
                  />
                  <h2 className="text-center mb-3 register-title">Solicitação de Registro</h2>
                  
                  {currentStep < 4 && (
                    <>
                      <Progress 
                        value={(currentStep / 3) * 100} 
                        color="warning" 
                        className="mb-3"
                      />
                      <p className="text-muted">Passo {currentStep} de 3</p>
                    </>
                  )}
                </div>

                <div className="register-scroll-container">
                  <Form onSubmit={handleSubmit}>
                    {renderStep()}
                    
                    {currentStep < 4 && (
                      <div className="d-flex justify-content-between mt-4">
                        {currentStep > 1 ? (
                          <Button color="secondary" onClick={prevStep}>
                            Voltar
                          </Button>
                        ) : (
                          <div></div>
                        )}
                        
                        <Button 
                          color="primary" 
                          onClick={nextStep}
                        >
                          {currentStep === 3 ? 'Revisar Dados' : 'Próximo'}
                        </Button>
                      </div>
                    )}
                  </Form>
                </div>

                {currentStep < 4 && (
                  <div className="text-center small pt-2 register-footer">
                    <span className="text-muted">Já possui uma conta? </span>
                    <Link to="/login" className="register-link">
                      Faça login aqui
                    </Link>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;