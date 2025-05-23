import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Button, ButtonGroup, Modal } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import UpdateDataUserModal from "./UpdateDataUser";

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

const ViewBranch = ({ branchId, branches }) => {
  const [user, setUser] = useState(null);
  const [usersBranch, setUsersBranch] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const apiUrl = import.meta.env.VITE_KNAPP_API;
  const [selectedNewBranchId, setSelectedNewBranchId] = useState(null);
  
  const [selectedAction, setSelectedAction] = useState(null);
  const cardRef = useRef(null);

  // Controle dos modais
  const [showRemanejarModal, setShowRemanejarModal] = useState(false);
  const [showAlterarSituacaoModal, setShowAlterarSituacaoModal] = useState(false);
  const [showAlterarInfoModal, setShowAlterarInfoModal] = useState(false);

  // Estado para alterar situação (radio)
  const [situacaoUsuario, setSituacaoUsuario] = useState("ativo");
  const branchOptions = branches.map(branch => ({
    value: branch.id,
    label: branch.name,
  }));

  const fetchUsersByBranch = () => {
    if (!branchId) {
      setError("Filial não selecionada.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);
    const token = sessionStorage.getItem("token");

    axios
      .get(`${apiUrl}/api/knapp/v1/user/getUserByBranch/${branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((response) => {
        const data = response.data;

        if (!data.data || data.data.length === 0) {
          setUsersBranch([]);
          setInfoMessage(data.message || "Nenhum usuário encontrado para esta filial.");
          setError(null);
          return;
        }

        setUsersBranch(data.data);
        setInfoMessage(null);
        setError(null);
      })
      .catch(() => {
        setError("Erro na requisição ao servidor.");
        setInfoMessage(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedUserData && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      cardRef.current.focus();
    }
  }, [selectedUserData]);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) {
      setError("Usuário não autenticado.");
      return;
    }
    const userObj = JSON.parse(userStr);
    setUser(userObj);

    if (!userObj.is_admin) {
      return;
    }

    fetchUsersByBranch();
  }, [branchId, apiUrl]);

  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUserData(null);
      setSelectedAction(null);
      return;
    }
    const userData = usersBranch.find((u) => u.id === selectedUserId);
    setSelectedUserData(userData || null);
    setSelectedAction(null);
  }, [selectedUserId, usersBranch]);

  // Abrir modais conforme ação
  useEffect(() => {
    if (!selectedAction) {
      setShowRemanejarModal(false);
      setShowAlterarSituacaoModal(false);
      setShowAlterarInfoModal(false);
      return;
    }

    if (selectedAction === "trocar_filial") {
      setShowRemanejarModal(true);
      setShowAlterarSituacaoModal(false);
      setShowAlterarInfoModal(false);
    } else if (selectedAction === "alterar_situacao") {
      setShowAlterarSituacaoModal(true);
      setShowRemanejarModal(false);
      setShowAlterarInfoModal(false);
      setSituacaoUsuario("ativo");
    } else if (selectedAction === "alterar_info") {
      setShowAlterarInfoModal(true);
      setShowRemanejarModal(false);
      setShowAlterarSituacaoModal(false);
    }
  }, [selectedAction]);

  const confirmarAlterarSituacao = () => {
    if (!selectedUserData || !user) return;
  
    // Bloqueia auto-inativação
    if (selectedUserData.id === user.id && situacaoUsuario === "inativo") {
      Swal.fire({
        icon: "error",
        title: "Ação não permitida",
        text: "Você não pode se auto-inativar.",
        confirmButtonText: "Ok",
      });
      return;
    }
  
    if (situacaoUsuario === "inativo") {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Se este usuário for inativado, ele não aparecerá mais na seleção de usuários da filial.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, inativar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const token = sessionStorage.getItem("token");
          setLoading(true);
  
          axios.patch(
            `${apiUrl}/api/knapp/v1/user/${selectedUserData.id}`,
            { status: 4 },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          )
          .then(() => {
            Swal.fire({
              title: 'Inativado!',
              text: 'O usuário foi inativado com sucesso.',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            setUsersBranch(prev => prev.filter(u => u.id !== selectedUserData.id));
            setSelectedUserId(null);
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Falha ao inativar o usuário. Tente novamente.',
            });
          })
          .finally(() => setLoading(false));
  
          setShowAlterarSituacaoModal(false);
        }
      });
    } else {
      const token = sessionStorage.getItem("token");
      setLoading(true);
  
      axios.patch(
        `${apiUrl}/api/knapp/v1/user/${selectedUserData.id}`,
        { status: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Falha ao atualizar o usuário. Tente novamente.',
        });
      })
      .finally(() => setLoading(false));
  
      setShowAlterarSituacaoModal(false);
    }
  };
  
  if (error)
    return (
      <p role="alert" className="text-danger" style={{ marginTop: "1rem" }}>
        {error}
      </p>
    );

  if (!user)
    return (
      <p role="alert" style={{ marginTop: "1rem" }}>
        Carregando informações do usuário...
      </p>
    );

  if (!user.is_admin)
    return (
      <p role="alert" style={{ marginTop: "1rem" }}>
        Seu usuário não tem permissão de administrador para visualizar esses dados.
      </p>
    );

  const options = usersBranch.map((u) => ({
    value: u.id,
    label: u.name,
  }));

  return (
    <div>
      {loading && (
        <p role="status" aria-live="polite" style={{ marginBottom: "1rem" }}>
          Carregando usuários...
        </p>
      )}

      {!loading && infoMessage && (
        <p role="alert" style={{ marginBottom: "1rem", fontStyle: "italic" }}>
          {infoMessage}
        </p>
      )}

      {!loading && usersBranch.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="user-select"
            style={{ fontWeight: "600", marginBottom: 4, display: "block" }}
          >
            Selecione um usuário:
          </label>
          <Select
            inputId="user-select"
            options={options}
            value={options.find((o) => o.value === selectedUserId) || null}
            onChange={(selectedOption) =>
              setSelectedUserId(selectedOption ? selectedOption.value : null)
            }
            placeholder="Digite para buscar usuário..."
            isClearable
            isSearchable
            isLoading={loading}
            noOptionsMessage={() => "Nenhum usuário encontrado"}
            aria-live="polite"
            aria-describedby="user-select-help"
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
              control: (provided, state) => ({
                ...provided,
                borderColor: state.isFocused ? "#2684FF" : "#ccc",
                boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : "none",
                "&:hover": {
                  borderColor: "#2684FF",
                },
              }),
            }}
          />
          {!selectedUserId && (
            <small id="user-select-help" style={{ color: "#6c757d" }}>
              Use o campo acima para buscar e selecionar um usuário.
            </small>
          )}
        </div>
      )}

      {selectedUserData && (
        <Card
          className="mt-3"
          tabIndex={-1}
          ref={cardRef}
          aria-live="polite"
          aria-label={`Detalhes do usuário ${selectedUserData.name}`}
          style={{ outline: "none" }}
        >
          <Card.Body>
            <Card.Title>{selectedUserData.name}</Card.Title>
            <Card.Text>
              <strong>CPF:</strong> {maskCPF(selectedUserData.cpf)} <br />
              <strong>Telefone:</strong> {maskPhone(selectedUserData.phone_number)} <br />
              <strong>E-mail:</strong> {maskEmail(selectedUserData.email)} <br />
              <strong>UF:</strong> {selectedUserData.uf || "Não informado"} <br />
              <strong>Endereço:</strong> {selectedUserData.endereco_detail || "Não informado"} <br />
              <strong>Status:</strong> {selectedUserData.status === 1 ? "Ativo" : "Inativo"} <br />
              <strong>Data de criação:</strong>{" "}
              {selectedUserData.created_at
                ? new Date(selectedUserData.created_at).toLocaleString()
                : "Não informado"}{" "}
              <br />
              <strong>Departamento:</strong>{" "}
              {selectedUserData.departament?.title || "Departamento não informado"} <br />
            </Card.Text>

            <ButtonGroup aria-label="Ações para o usuário" className="mt-3">
              <Button
                variant={selectedAction === "trocar_filial" ? "primary" : "outline-primary"}
                onClick={() => setSelectedAction("trocar_filial")}
                >
                  Trocar Filial
                </Button>
                <Button
                  variant={selectedAction === "alterar_situacao" ? "warning" : "outline-warning"}
                  onClick={() => setSelectedAction("alterar_situacao")}
                >
                  Alterar Situação
                </Button>
                <Button
                  variant={selectedAction === "alterar_info" ? "success" : "outline-success"}
                  onClick={() => setSelectedAction("alterar_info")}
                >
                  Alterar Informações
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        )}
  
        {/* Modal Remanejar Filial */}

      <Modal show={showRemanejarModal} onHide={() => setShowRemanejarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remanejar Filial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="branch-select">Selecione a nova filial:</label>
          <Select
            inputId="branch-select"
            options={branchOptions}
            value={branchOptions.find(opt => opt.value === selectedNewBranchId) || null}
            onChange={option => setSelectedNewBranchId(option ? option.value : null)}
            placeholder="Escolha uma filial..."
            isClearable
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemanejarModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!selectedNewBranchId}
            onClick={async () => {
              if (!selectedUserId || !selectedNewBranchId) return;
              try {
                const token = sessionStorage.getItem("token");
                await axios.put(
                  `${apiUrl}/api/knapp/v1/user/${selectedUserId}`,
                  {
                    branch_id: selectedNewBranchId,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json",
                    },
                  }
                );

                setSelectedUserData((prev) => ({
                  ...prev,
                  branch_id: selectedNewBranchId,
                  branch_name: branches.find((b) => b.value === selectedNewBranchId)?.label || "",
                }));

                setShowRemanejarModal(false);
                setSelectedAction(null);

                // Sucesso
                Swal.fire({
                  icon: "success",
                  title: "Sucesso",
                  text: "Filial alterada com sucesso!",
                });

                // Atualiza a lista de usuários após a mudança de filial
                fetchUsersByBranch();
              } catch (error) {
                console.error("Erro ao trocar filial:", error);

                // Erro
                Swal.fire({
                  icon: "error",
                  title: "Erro",
                  text: "Não foi possível alterar a filial. Tente novamente.",
                });
              }
            }}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

  
        {/* Modal Alterar Situação */}
        <Modal show={showAlterarSituacaoModal} onHide={() => setShowAlterarSituacaoModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Alterar Situação do Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>Deseja inativar este usuário?</p>
              <div>
                <label>
                  <input
                    type="radio"
                    name="situacao"
                    value="ativo"
                    checked={situacaoUsuario === "ativo"}
                    onChange={() => setSituacaoUsuario("ativo")}
                  />{" "}
                  Manter ativo
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="situacao"
                    value="inativo"
                    checked={situacaoUsuario === "inativo"}
                    onChange={() => setSituacaoUsuario("inativo")}
                  />{" "}
                  Inativar usuário
                </label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAlterarSituacaoModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarAlterarSituacao}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>

          {/* Modal de edição de dados do usuário*/}
          <UpdateDataUserModal 
            show={showAlterarInfoModal}
            onHide={() => setShowAlterarInfoModal(false)}
            userData={selectedUserData}
            onUpdateSuccess={() => {
              // Recarrega os usuários após atualização
              fetchUsersByBranch();
              Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Dados do usuário atualizados com sucesso!"
              });
            }}
          />
      </div>
    );
  };
  
  export default ViewBranch;