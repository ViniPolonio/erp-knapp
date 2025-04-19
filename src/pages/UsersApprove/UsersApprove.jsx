import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nome", headerName: "Nome", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  {
    field: "acoes",
    headerName: "Ações",
    width: 200,
    renderCell: (params) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="contained" color="success" size="small">
          Aceitar
        </Button>
        <Button variant="contained" color="error" size="small">
          Recusar
        </Button>
      </div>
    ),
  },
];

const rows = [
  {
    id: 1,
    nome: "João da Silva",
    email: "joao.silva@email.com",
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
  },
];

const UsersApprove = () => {
  return (
    <div style={{ height: 400, width: "100%", padding: 20 }}>
      <h2>Solicitações de Acesso</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default UsersApprove;
