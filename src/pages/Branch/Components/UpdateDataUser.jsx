// UpdateDataUserModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";

const estadosBrasil = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const apiUrl = import.meta.env.VITE_KNAPP_API;

const UpdateDataUserModal = ({ 
  show, 
  onHide, 
  userData,
  onUpdateSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    uf: null,
    is_admin: false,
  });

  const [loading, setLoading] = useState(false);

  // Preenche o form com os dados do usuário quando o modal abre ou quando userData muda
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        uf: estadosBrasil.find(estado => estado.value === userData.uf) || null,
        is_admin: userData.is_admin || false,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUfChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      uf: selectedOption
    }));
  };

  const handleIsAdminChange = (e) => {
    const newValue = e.target.checked;
    
    if (newValue) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Ao tornar este usuário administrador, ele terá acesso a informações sensíveis e poderá fazer alterações críticas no sistema. Deseja continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, tornar administrador',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          setFormData(prev => ({
            ...prev,
            is_admin: true
          }));
        }
      });
    } else {
      setFormData(prev => ({
        ...prev,
        is_admin: false
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone_number) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }
  
    setLoading(true);
    
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }
  
      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        uf: formData.uf?.value || null,
        is_admin: formData.is_admin,
      };
  
      await axios.patch(
        `${apiUrl}/api/knapp/v1/user/${userData.id}`,  // Note que mudamos para userData.id
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Dados do usuário atualizados com sucesso.',
      });
      
      onUpdateSuccess();
      onHide();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      
      let errorMessage = 'Não foi possível atualizar os dados do usuário. Tente novamente.';
      if (error.response) {
        // Erro retornado pelo servidor
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        errorMessage = 'Sem resposta do servidor. Verifique sua conexão.';
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Informações de {userData?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome Completo *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>E-mail *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite o e-mail"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefone *</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Digite o telefone"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>UF</Form.Label>
            <Select
              options={estadosBrasil}
              value={formData.uf}
              onChange={handleUfChange}
              placeholder="Selecione um estado"
              isClearable
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="is-admin-switch"
              label="Usuário Administrador"
              checked={formData.is_admin}
              onChange={handleIsAdminChange}
            />
            {formData.is_admin && (
              <Form.Text className="text-warning">
                Este usuário terá acesso completo ao sistema
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateDataUserModal;