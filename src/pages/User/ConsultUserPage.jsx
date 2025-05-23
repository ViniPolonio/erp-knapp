// src/pages/User/ConsultUserPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from "react-select";
import { Card, Badge, Container, Row, Col } from 'react-bootstrap';
import './ConsultUserPage.css';

const maskCPF = (cpf) => {
  if (!cpf) return "";
  const cleanCpf = cpf.replace(/\D/g, "");
  if (cleanCpf.length !== 11) return cpf;
  return cleanCpf.slice(0, 3) + ".***.***-" + cleanCpf.slice(9, 11);
};

const maskPhone = (phone) => {
  if (!phone) return "";
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 5) return phone;
  return cleanPhone.slice(0, 3) + "***" + cleanPhone.slice(cleanPhone.length - 2);
};

const maskEmail = (email) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  if (user.length <= 1) return "***@" + domain;
  return user[0] + "***@" + domain;
};

const parseDepartments = (departamentsJson) => {
  try {
    const parsed = JSON.parse(departamentsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const getDepartmentName = (departamentId, departments) => {
  if (!departamentId) return "Não informado";
  const dept = departments.find(d => d.id === departamentId);
  return dept ? dept.title : `Departamento ${departamentId}`;
};

const ConsultUserPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_KNAPP_API;
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, deptsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/knapp/v1/user`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/knapp/v1/departament`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.data);
        }

        if (deptsResponse.data.success) {
          setDepartments(deptsResponse.data.data);
        }

      } catch (err) {
        setError(err.message || "Erro na requisição");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, token]);

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
    userData: user 
  }));

  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption ? selectedOption.userData : null);
  };

  if (loading) return <Container className="mt-4"><p>Carregando usuários...</p></Container>;
  if (error) return <Container className="mt-4"><p className="text-danger">Erro: {error}</p></Container>;

  return (
    <Container className="mt-4 consult-user-container">
      <Row className="mb-4">
        <Col>
          <h2>Consultar Usuário</h2>
          <Select
            options={userOptions}
            onChange={handleUserSelect}
            placeholder="Selecione um usuário..."
            isClearable
            isSearchable
            noOptionsMessage={() => "Nenhum usuário encontrado"}
            className="user-select"
          />
        </Col>
      </Row>

      {selectedUser && (
        <Row>
          <Col>
            <Card className="user-detail-card">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span>{selectedUser.name}</span>
                  <Badge bg={selectedUser.is_admin ? "primary" : "secondary"}>
                    {selectedUser.is_admin ? "Administrador" : "Usuário"}
                  </Badge>
                </Card.Title>

                <Row className="mt-3">
                  <Col md={6}>
                    <div className="user-info-item">
                      <h6>Status:</h6>
                      <p>
                        <Badge bg={selectedUser.status === 1 ? "success" : "danger"}>
                          {selectedUser.status === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </p>
                    </div>
                    <div className="user-info-item">
                      <h6>CPF:</h6>
                      <p>{maskCPF(selectedUser.cpf)}</p>
                    </div>
                    <div className="user-info-item">
                      <h6>E-mail:</h6>
                      <p>{maskEmail(selectedUser.email)}</p>
                    </div>
                    <div className="user-info-item">
                      <h6>Telefone:</h6>
                      <p>{maskPhone(selectedUser.phone_number)}</p>
                    </div>
                    <div className="user-info-item">
                      <h6>Departamento:</h6>
                      <p>
                        {selectedUser.departament?.title || 
                         getDepartmentName(selectedUser.departament_id, departments) || 
                         "Não informado"}
                      </p>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="user-info-item">
                      <h6>Empresa:</h6>
                      <p>{selectedUser.company?.name || "Não informado"}</p>
                    </div>
                    <div className="user-info-item">
                      <h6>Filial:</h6>
                      <p>{selectedUser.branch?.name || "Não informado"}</p>
                    </div>
                    <div className="user-info-item">
                      <h6>UF:</h6>
                      <p>{selectedUser.uf || "Não informado"}</p>
                    </div>
                    <div className="user-info-item">
                      <h6>Endereço:</h6>
                      <p>{selectedUser.endereco_detail || "Não informado"}</p>
                    </div>
                    <div className="user-info-item">
                      <h6>Data de Criação:</h6>
                      <p>
                        {selectedUser.created_at 
                          ? new Date(selectedUser.created_at).toLocaleDateString('pt-BR') 
                          : "Não informado"}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ConsultUserPage;