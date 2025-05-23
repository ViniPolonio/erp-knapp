import React, { useState, useEffect } from "react";
import { Form, Button, Toast, ToastContainer, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.VITE_KNAPP_API;

const formatPhone = (value) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .slice(0, 11) // só 11 dígitos pra telefone (2 DDD + 9 número)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

const formatCEP = (value) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .slice(0, 8) // só 8 dígitos no CEP
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
};

const formatCNPJ = (value) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .slice(0, 14) // 14 dígitos do CNPJ
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const EditBranch = ({ branchId }) => {
  const token = sessionStorage.getItem("token");

  const [branchData, setBranchData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentsStatus, setDepartmentsStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!branchId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const branchResp = await axios.get(`${apiUrl}/api/knapp/v1/branch/${branchId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        if (branchResp.data.success) {
          let branch = branchResp.data.data;

          // Formatando os campos para exibir já formatado
          branch = {
            ...branch,
            cnpj: formatCNPJ(branch.cnpj || ""),
            cep: formatCEP(branch.cep || ""),
            phone_number: formatPhone(branch.phone_number || ""),
          };

          setBranchData(branch);

          const parsedDeps = branch.departaments_json ? JSON.parse(branch.departaments_json) : [];
          setDepartmentsStatus(parsedDeps);
        } else {
          showToastMessage("Não foi possível carregar os dados da filial.", "danger");
        }

        const depResp = await axios.get(`${apiUrl}/api/knapp/v1/departament`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        if (depResp.data.success) {
          setDepartments(depResp.data.data);
        } else {
          showToastMessage("Não foi possível carregar os departamentos.", "danger");
        }
      } catch {
        showToastMessage("Erro ao buscar dados.", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [branchId, token]);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "phone_number") val = formatPhone(val);
    if (e.target.name === "cep") val = formatCEP(val);
    if (e.target.name === "cnpj") val = formatCNPJ(val);

    setBranchData({ ...branchData, [e.target.name]: val });
  };

  const toggleDepartmentStatus = (departament_id) => {
    const idx = departmentsStatus.findIndex((d) => d.departament_id === departament_id);
    const newDepartmentsStatus = [...departmentsStatus];

    if (idx === -1) {
      newDepartmentsStatus.push({ departament_id, status: 1 });
    } else {
      newDepartmentsStatus[idx].status = newDepartmentsStatus[idx].status === 1 ? 0 : 1;
    }

    setDepartmentsStatus(newDepartmentsStatus);
  };

  const removeDepartment = (departament_id) => {
    setDepartmentsStatus(departmentsStatus.filter((d) => d.departament_id !== departament_id));
  };

  const addDepartment = (departament_id) => {
    if (!departmentsStatus.some((d) => d.departament_id === departament_id)) {
      setDepartmentsStatus([...departmentsStatus, { departament_id, status: 1 }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirmação",
      text: "Tem certeza que deseja alterar os dados da filial?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, salvar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      const payload = {
        ...branchData,
        cnpj: branchData.cnpj.replace(/\D/g, ""),
        cep: branchData.cep.replace(/\D/g, ""),
        phone_number: branchData.phone_number.replace(/\D/g, ""),
        departaments_json: departmentsStatus,
      };

      const { data } = await axios.put(`${apiUrl}/api/knapp/v1/branch/${branchId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (data.success) {
        showToastMessage("Filial atualizada com sucesso!", "success");
      } else {
        showToastMessage("Falha ao atualizar filial.", "danger");
      }
    } catch {
      showToastMessage("Erro ao salvar os dados da filial.", "danger");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Spinner animation="border" />
      </div>
    );

  if (!branchData) return null;

  const linkedDepartments = departmentsStatus.map((depStatus) => {
    const info = departments.find((d) => d.id === depStatus.departament_id);
    return {
      ...depStatus,
      title: info ? info.title : "Departamento Desconhecido",
    };
  });

  const availableDepartments = departments.filter(
    (d) => !departmentsStatus.some((dep) => dep.departament_id === d.id)
  );

  return (
    <>
      <ToastContainer position="top-center" className="mt-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg={toastType}
          delay={4000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="branchName">
          <Form.Label>Nome da Filial</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={branchData.name || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="branchCNPJ">
          <Form.Label>CNPJ</Form.Label>
          <Form.Control
            type="text"
            name="cnpj"
            value={branchData.cnpj || ""}
            onChange={handleChange}
            maxLength={18} // 14 dígitos + pontos, barra e hífen
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="branchEndereco">
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            type="text"
            name="endereco_detail"
            value={branchData.endereco_detail || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="branchCEP">
          <Form.Label>CEP</Form.Label>
          <Form.Control
            type="text"
            name="cep"
            value={branchData.cep || ""}
            onChange={handleChange}
            maxLength={9} // 8 dígitos + hífen
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="branchPhone">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            name="phone_number"
            value={branchData.phone_number || ""}
            onChange={handleChange}
            maxLength={15} // formato (99) 99999-9999
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="branchEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={branchData.email || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="branchUF">
          <Form.Label>UF</Form.Label>
          <Form.Control
            type="text"
            name="uf"
            value={branchData.uf || ""}
            onChange={handleChange}
            maxLength={2}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Departamentos Vinculados à filial</Form.Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {linkedDepartments.length === 0 && <p>Nenhum departamento vinculado.</p>}
            {linkedDepartments.map((dep) => (
              <div
                key={dep.departament_id}
                className="d-flex align-items-center border rounded px-2 py-1"
              >
                <span>{dep.title}</span>
                <Form.Check
                  type="switch"
                  id={`status-switch-${dep.departament_id}`}
                  checked={dep.status === 1}
                  onChange={() => toggleDepartmentStatus(dep.departament_id)}
                  className="mx-2"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeDepartment(dep.departament_id)}
                >
                  x
                </Button>
              </div>
            ))}
          </div>

          <Form.Select
            aria-label="Adicionar departamento"
            className="mt-2"
            onChange={(e) => {
              if (e.target.value !== "") {
                addDepartment(parseInt(e.target.value));
                e.target.value = "";
              }
            }}
          >
            <option value="">Adicionar departamento</option>
            {availableDepartments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Spinner animation="border" size="sm" /> Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </Form>
    </>
  );
};

export default EditBranch;
