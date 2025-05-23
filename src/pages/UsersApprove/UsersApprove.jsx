// src/pages/UsersApprove/UsersApprovePage.jsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Container, Row, Col, Spinner } from 'react-bootstrap';
import Select from "react-select";
import axios from "axios";
import Swal from 'sweetalert2';
import './UsersApprovePage.css';

const apiUrl = import.meta.env.VITE_KNAPP_API;

// Funções de máscara (reutilizáveis)
const maskCPF = (cpf) => cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4") || "";
const maskPhone = (phone) => phone?.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-****") || "";
const maskEmail = (email) => email?.replace(/(.?)(.+)(@.+)/, "$1***$3") || "";

const UsersApprovePage = () => {
  const token = sessionStorage.getItem('token');
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState(null);

  const currentBranchId = userData?.branch_id;
  const currentCompanyName = userData?.company?.name;
  const currentBranchName = userData?.branch?.name;

  const fetchPendingUsers = async () => {
    if (!currentBranchId) {
      setError("Filial do usuário não identificada");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedUser(null); // Limpa o usuário selecionado ao buscar novos

    try {
      const response = await axios.get(
        `${apiUrl}/api/knapp/v1/user/getUsers/0/${currentBranchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPendingUsers(response.data.data);
      } else {
        if (response.data.message === "Nenhum registro encontrado.") {
          setPendingUsers([]);
        } else {
          setError(response.data.message || "Erro ao carregar usuários pendentes");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleSelectUser = (selectedOption) => {
    const user = pendingUsers.find(u => u.id === selectedOption?.value);
    setSelectedUser(user || null);
  };

  const showApprovalConfirmation = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirmar aprovação',
      text: `Deseja aprovar o acesso de ${selectedUser.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, aprovar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      reverseButtons: true
    });
    
    if (isConfirmed) {
      await handleUpdateStatus(1);
    }
  };

  const showRejectionConfirmation = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Confirmar Rejeição',
      html: `
        <p>Deseja rejeitar o usuário <strong>${selectedUser.name}</strong>?</p>
        <p>Motivo (opcional, máximo 255 caracteres):</p>
      `,
      input: 'textarea',
      inputPlaceholder: 'Digite o motivo (opcional)...',
      inputAttributes: {
        maxlength: 255
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar Rejeição',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      reverseButtons: true,
      preConfirm: (inputValue) => {
        if (inputValue && inputValue.length > 255) {
          Swal.showValidationMessage('O motivo não pode ultrapassar 255 caracteres');
        }
        return inputValue || null;
      }
    });
    
    if (reason !== undefined) {
      await handleUpdateStatus(3, reason || '');
    }
  };

  const handleUpdateStatus = async (status, message = '') => {
    if (!selectedUser) return;

    try {
      if (status === 1) setApproving(true);
      if (status === 3) setRejecting(true);

      const requestData = { status };
      
      if (status === 3 && message) {
        requestData.message_validate = message;
      }

      await axios.put(
        `${apiUrl}/api/knapp/v1/user/${selectedUser.id}`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: 'success',
        title: status === 1 ? 'Usuário aprovado!' : 'Usuário rejeitado!',
        text: status === 1 
          ? 'O usuário agora tem acesso ao sistema.' 
          : 'O usuário foi rejeitado com sucesso.',
        timer: 2000,
        showConfirmButton: false
      });

      // Atualiza a lista de usuários pendentes
      await fetchPendingUsers();
      
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Operação não concluída',
        text: err.response?.data?.message || (status === 1 
          ? 'Falha ao aprovar usuário' 
          : 'Falha ao rejeitar usuário'),
      });
    } finally {
      setApproving(false);
      setRejecting(false);
    }
  };

  return (
    <Container>
      <header className="approval-header mb-4">
        <h2 className="mb-3">Aprovação de Usuários</h2>
        <div className="company-info">
          <p className="mb-1"><strong>Empresa:</strong> {currentCompanyName}</p>
          <p><strong>Filial:</strong> {currentBranchName}</p>
        </div>
      </header>

      {loading ? (
        <div className="text-center loading-container py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Buscando usuários pendentes de aprovação...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          {error}
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="no-pending-users text-center py-5">
          <i className="bi bi-people fs-1 text-muted mb-3"></i>
          <h4 className="text-muted mb-3">Nenhum usuário pendente</h4>
          <p className="text-muted">
            Não há usuários aguardando aprovação nesta filial no momento.
          </p>
          <Button 
            variant="outline-primary" 
            onClick={fetchPendingUsers}
            className="mt-2"
          >
            Atualizar lista
          </Button>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={8} lg={6}>
              <div className="user-select-container">
                <label htmlFor="user-select" className="form-label mb-2">
                  Selecione um usuário para aprovar/rejeitar:
                </label>
                <Select
                  id="user-select"
                  options={pendingUsers.map(user => ({
                    value: user.id,
                    label: `${user.name} (${maskEmail(user.email)})`
                  }))}
                  onChange={handleSelectUser}
                  placeholder="Buscar usuário..."
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "Nenhum usuário encontrado"}
                  className="user-select"
                  classNamePrefix="select"
                />
              </div>
            </Col>
          </Row>

          {selectedUser && (
            <Card className="user-detail-card shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-0">{selectedUser.name}</h4>
                    <small className="text-muted">ID: {selectedUser.id}</small>
                  </div>
                  <Badge bg="warning" pill className="px-3 py-2">
                    Pendente de aprovação
                  </Badge>
                </Card.Title>

                <Row className="mt-3">
                  <Col md={6}>
                    <div className="user-info-item mb-3">
                      <h6 className="info-label">CPF:</h6>
                      <p className="info-value">{maskCPF(selectedUser.cpf)}</p>
                    </div>
                    <div className="user-info-item mb-3">
                      <h6 className="info-label">E-mail:</h6>
                      <p className="info-value">{maskEmail(selectedUser.email)}</p>
                    </div>
                    <div className="user-info-item mb-3">
                      <h6 className="info-label">Telefone:</h6>
                      <p className="info-value">{maskPhone(selectedUser.phone_number)}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="user-info-item mb-3">
                      <h6 className="info-label">Departamento:</h6>
                      <p className="info-value">{selectedUser.departament?.title || "Não informado"}</p>
                    </div>
                    <div className="user-info-item mb-3">
                      <h6 className="info-label">Data de Cadastro:</h6>
                      <p className="info-value">
                        {new Date(selectedUser.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col md={6}>
                    <div className="user-info-item mb-3">
                      <h6 className="info-label">Endereço:</h6>
                      <p className="info-value">{selectedUser.endereco_detail || "Não informado"}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="user-info-item mb-3">
                      <h6 className="info-label">UF:</h6>
                      <p className="info-value">{selectedUser.uf || "Não informado"}</p>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4 gap-3">
                  <Button 
                    variant="outline-danger" 
                    onClick={showRejectionConfirmation}
                    disabled={approving || rejecting}
                    className="action-btn"
                  >
                    {rejecting ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Rejeitando...</span>
                      </>
                    ) : 'Rejeitar'}
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={showApprovalConfirmation}
                    disabled={approving || rejecting}
                    className="action-btn"
                  >
                    {approving ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Aprovando...</span>
                      </>
                    ) : 'Aprovar'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default UsersApprovePage;