import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form, Button, Row, Col } from "react-bootstrap";
import ViewBranch from "./Components/ViewBranch";
import EditBranch from "./Components/EditBranch";
import CreateBranch from "./Components/CreateBranch";
import axios from "axios";

const apiUrl = import.meta.env.VITE_KNAPP_API;

const Content = () => {
  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  const companyId = sessionUser?.company_id || sessionUser?.company?.id;
  const token = sessionStorage.getItem("token");

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [creatingBranch, setCreatingBranch] = useState(false);

  useEffect(() => {
    if (!companyId || !token) return;

    const fetchCompanyData = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/knapp/v1/company/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (data.success && data.data?.branches) {
          setBranches(data.data.branches);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
      }
    };

    fetchCompanyData();
  }, [companyId, token]);

  const handleBranchChange = (e) => {
    setSelectedBranchId(e.target.value);
    setCreatingBranch(false); 
  };

  const handleCreateClick = () => {
    setSelectedBranchId("");
    setCreatingBranch(true);
  };

  return (
    <div style={{ marginTop: "-20px" }}>
      <Row className="align-items-end mb-3">
        <Col md={8}>
          {!creatingBranch && (
            <Form.Group controlId="branchSelect">
              <Form.Label>Selecione uma Filial</Form.Label>
              <Form.Select value={selectedBranchId} onChange={handleBranchChange}>
                <option value="">-- Escolha uma filial --</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Col>
        <Col md={4}>
          {!creatingBranch && (
            <Button variant="success" onClick={handleCreateClick}>
              + Criar nova filial
            </Button>
          )}
        </Col>
      </Row>

      {creatingBranch && (
        <div className="mb-4">
          <h5>Criar Nova Filial</h5>
          <CreateBranch />
        </div>
      )}

      {selectedBranchId && !creatingBranch && (
        <Tabs defaultActiveKey="view" id="company-tabs" className="mb-3">
          <Tab eventKey="view" title="Usuários Vinculados">
            <ViewBranch branchId={selectedBranchId} branches={branches} />
          </Tab>
          <Tab eventKey="edit" title="Editar">
            <EditBranch branchId={selectedBranchId} />
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default Content;
