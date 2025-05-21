import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.VITE_KNAPP_API;
const token = sessionStorage.getItem("token");

const formatPhone = (value) =>
  value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");

const formatCEP = (value) =>
  value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");

const formatCNPJ = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

const CreateBranch = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const companyId = user?.company_id;  const [formData, setFormData] = useState({

    name: "",
    cnpj: "",
    cep: "",
    phone_number: "",
    email: "",
    uf: "",
    endereco_detail: "",
    status: 1,
  });

  const [departments, setDepartments] = useState([]);
  const [departmentsStatus, setDepartmentsStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const depResp = await axios.get(`${apiUrl}/api/knapp/v1/departament`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        if (depResp.data.success) {
          setDepartments(depResp.data.data);
          setDepartmentsStatus(
            depResp.data.data.map((d) => ({ departament_id: d.id, status: 0 }))
          );
        } else {
          alert("Não foi possível carregar os departamentos.");
        }
      } catch {
        alert("Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const toggleDepartmentStatus = (departament_id) => {
    const idx = departmentsStatus.findIndex((d) => d.departament_id === departament_id);
    const newDepartmentsStatus = [...departmentsStatus];
    if (idx !== -1) {
      newDepartmentsStatus[idx].status = newDepartmentsStatus[idx].status === 1 ? 0 : 1;
      setDepartmentsStatus(newDepartmentsStatus);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    let rawValue = value.replace(/\D/g, ""); // Só números para contar
  
    let formattedValue = value;
  
    if (name === "cnpj") {
      // Limitar a 14 dígitos para o CNPJ
      if (rawValue.length > 14) rawValue = rawValue.slice(0, 14);
      formattedValue = formatCNPJ(rawValue);
    } else if (name === "phone_number") {
      // Limitar a 11 dígitos para telefone (DD + 9 dígitos)
      if (rawValue.length > 11) rawValue = rawValue.slice(0, 11);
      formattedValue = formatPhone(rawValue);
    } else if (name === "uf") {
      // Limitar a 2 caracteres para UF, e transformar para maiúsculo
      formattedValue = value.toUpperCase().slice(0, 2);
    } else if (name === "cep") {
        // Limitar a 8 dígitos e formatar
        if (rawValue.length > 8) rawValue = rawValue.slice(0, 8);
        formattedValue = formatCEP(rawValue);
    }
  
    setFormData({ ...formData, [name]: formattedValue });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se todos os campos obrigatórios estão preenchidos
    const requiredFields = ["name", "cnpj", "cep", "phone_number", "email", "uf", "endereco_detail"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      Swal.fire("Atenção", "Por favor, preencha todos os campos obrigatórios.", "warning");
      return;
    }

    // Verifica se ao menos um departamento está ativo
    const hasAtLeastOneDepartment = departmentsStatus.some((d) => d.status === 1);
    if (!hasAtLeastOneDepartment) {
      Swal.fire("Atenção", "Selecione ao menos um departamento.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Confirmação",
      text: "Tem certeza que deseja criar essa filial?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, salvar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // Remove máscaras antes de enviar
    const rawCnpj = formData.cnpj.replace(/\D/g, "");
    const rawPhone = formData.phone_number.replace(/\D/g, "");

    const payload = {
      ...formData,
      cnpj: rawCnpj,
      phone_number: rawPhone,
      company_id: companyId,
      departaments_json: departmentsStatus.filter(d => d.status === 1),    };

    try {
      const { data } = await axios.post(`${apiUrl}/api/knapp/v1/branch`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (data.success) {
        Swal.fire("Sucesso", "Filial criada com sucesso!", "success");
        setFormData({
          name: "",
          cnpj: "",
          cep: "",
          phone_number: "",
          email: "",
          uf: "",
          endereco_detail: "",
          status: 1,
        });
        setDepartmentsStatus(
          departments.map((d) => ({ departament_id: d.id, status: 0 }))
        );
      } else {
        Swal.fire("Erro", "Erro ao criar filial.", "error");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        let errorMessages = "";

        Object.entries(errors).forEach(([field, messages]) => {
          messages.forEach((msg) => {
            errorMessages += `• ${msg}\n`;
          });
        });

        Swal.fire({
          title: "Erro ao salvar filial",
          text: errorMessages,
          icon: "error",
          customClass: {
            popup: "swal-wide",
          },
        });
      } else {
        Swal.fire("Erro", "Erro ao enviar os dados.", "error");
      }
    }
  };

  
  

  if (loading) return <Spinner animation="border" />;

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nome descritivo</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>CNPJ</Form.Label>
            <Form.Control
              name="cnpj"
              value={formData.cnpj}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={2}>
            <Form.Group>
                <Form.Label>CEP</Form.Label>
                <Form.Control
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                required
                />
            </Form.Group>
        </Col>
        <Col md={1}>
          <Form.Group>
            <Form.Label>UF</Form.Label>
            <Form.Control
              name="uf"
              value={formData.uf}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={9}>
          <Form.Group>
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              name="endereco_detail"
              value={formData.endereco_detail}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <hr />
      <h5 className="mt-4">Departamentos Ativos</h5>
      <Row>
        {departments.map((dep) => {
          const current = departmentsStatus.find((d) => d.departament_id === dep.id);
          return (
            <Col md={4} key={dep.id} className="mb-2">
              <Form.Check
                type="switch"
                id={`dep-${dep.id}`}
                label={dep.title}
                checked={current?.status === 1}
                onChange={() => toggleDepartmentStatus(dep.id)}
              />
            </Col>
          );
        })}
      </Row>

      <div className="mt-4">
        <Button type="submit" variant="primary">
          Salvar Filial
        </Button>
      </div>
    </Form>
  );
};

export default CreateBranch;
