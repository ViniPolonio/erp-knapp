import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Col } from "reactstrap";
import Swal from 'sweetalert2';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_KNAPP_API;

const formatPhone = (value) =>
  value.replace(/\D/g, "")
       .replace(/(\d{2})(\d)/, "($1) $2")
       .replace(/(\d{5})(\d)/, "$1-$2");

const formatCEP = (value) =>
  value.replace(/\D/g, "")
       .replace(/(\d{5})(\d)/, "$1-$2");

const formatCNPJ = (value) =>
  value.replace(/\D/g, "")
       .replace(/^(\d{2})(\d)/, "$1.$2")
       .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
       .replace(/\.(\d{3})(\d)/, ".$1/$2")
       .replace(/(\d{4})(\d)/, "$1-$2");

const Content = ({ company, user }) => {
  const isAdmin = user?.is_admin === true || user?.is_admin === 1;

  const [formData, setFormData] = useState({
    name: company?.name || "",
    cnpj: company?.cnpj || "",
    phone_number: company?.phone_number || "",
    endereco_detail: company?.endereco_detail || "",
    uf: company?.uf || "",
    cep: company?.cep || "",
    email: company?.email || "",  // novo campo email
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (["cnpj", "phone_number", "cep"].includes(name)) {
      value = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem('user'));
      const companyId = sessionUser?.company_id || sessionUser?.company?.id;
      const token = sessionStorage.getItem('token');

      if (!token || !companyId) throw new Error("Token ou empresa não encontrado");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };

      const payload = { ...formData };

      console.log("Payload:", payload);

      await axios.put(`${apiUrl}/api/knapp/v1/company/${companyId}`, payload, config);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      throw err;
    }
  };

  const getChangedFields = () => {
    const changed = {};
    for (const key in formData) {
      if (formData[key] !== (company?.[key] || "")) {
        changed[key] = true;
      }
    }
    return changed;
  };

  const handleConfirmSave = async () => {
    const changes = getChangedFields();

    const fields = [
      { label: "Nome", value: formData.name, original: company?.name },
      { label: "CNPJ", value: formatCNPJ(formData.cnpj), original: formatCNPJ(company?.cnpj || "") },
      { label: "Email", value: formData.email, original: company?.email || "" }, // novo campo email
      { label: "Telefone", value: formatPhone(formData.phone_number), original: formatPhone(company?.phone_number || "") },
      { label: "CEP", value: formatCEP(formData.cep), original: formatCEP(company?.cep || "") },
      { label: "Endereço", value: formData.endereco_detail, original: company?.endereco_detail },
      { label: "UF", value: formData.uf, original: company?.uf },
    ];

    const html = fields.map(field => {
      const isChanged = field.value !== field.original;
      return `
        <strong>${field.label}:</strong> 
        <span style="color: ${isChanged ? 'red' : 'black'};">
          ${field.value}${isChanged ? ' ⚠️' : ''}
        </span><br/>
      `;
    }).join("");

    const result = await Swal.fire({
      title: 'Revisar informações antes de salvar',
      html,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      try {
        await saveChanges();
        Swal.fire('Sucesso!', 'As informações foram salvas com sucesso.', 'success');
      } catch (error) {
        Swal.fire('Erro!', 'Falha ao salvar as informações.', 'error');
      }
    }
  };

  return (
    <section>
      <Form>
        <FormGroup row>
          <Label for="name" sm={2}>Nome</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isAdmin}
              placeholder="Nome da empresa"
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="cnpj" sm={2}>CNPJ</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="cnpj"
              id="cnpj"
              value={formatCNPJ(formData.cnpj)}
              onChange={handleChange}
              disabled={!isAdmin}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="email" sm={2}>Email</Label>
          <Col sm={10}>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isAdmin}
              placeholder="email@empresa.com"
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="phone_number" sm={2}>Telefone</Label>
          <Col sm={10}>
            <Input
              type="tel"
              name="phone_number"
              id="phone_number"
              value={formatPhone(formData.phone_number)}
              onChange={handleChange}
              disabled={!isAdmin}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="cep" sm={2}>CEP</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="cep"
              id="cep"
              value={formatCEP(formData.cep)}
              onChange={handleChange}
              disabled={!isAdmin}
              placeholder="00000-000"
              maxLength={9}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="endereco_detail" sm={2}>Endereço</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="endereco_detail"
              id="endereco_detail"
              value={formData.endereco_detail}
              onChange={handleChange}
              disabled={!isAdmin}
              placeholder="Rua, número, complemento"
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="uf" sm={2}>UF</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="uf"
              id="uf"
              value={formData.uf}
              onChange={handleChange}
              disabled={!isAdmin}
              placeholder="Ex: SP, RJ, PR"
              maxLength={2}
            />
          </Col>
        </FormGroup>

        {/* Novo campo Email */}
        

        <FormGroup row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button color="primary" disabled={!isAdmin} onClick={handleConfirmSave}>
              Salvar alterações
            </Button>
            {!isAdmin && (
              <p style={{ marginTop: "0.5rem", color: "#888" }}>
                Você não tem permissão para editar essas informações.
              </p>
            )}
          </Col>
        </FormGroup>
      </Form>
    </section>
  );
};

export default Content;
