import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // 1. Importar o SweetAlert
import './style.css'; 

// --- Configuração da API ---
const API_URL = import.meta.env.VITE_KNAPP_API;

if (!API_URL) {
  throw new Error("A variável de ambiente VITE_KNAPP_API não está definida.");
}

const UserManagementDashboard = () => {
  // --- Estados de Dados ---
  const [statsData, setStatsData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // --- Estados de Controle de UI ---
  const [selectedStatView, setSelectedStatView] = useState('total'); 
  const [isLoading, setIsLoading] = useState(true);
  const [isIntegrating, setIsIntegrating] = useState(false); // Estado para o loading do botão
  const [error, setError] = useState(null);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);

  // --- Funções Auxiliares ---
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token'); 
    if (!token) {
      setError("Token de autenticação não encontrado. Por favor, faça login novamente.");
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // 2. useEffect para buscar TODOS os dados iniciais (Estatísticas e Usuários)
  useEffect(() => {
    // Verifica permissão do usuário logado
    try {
      const userData = JSON.parse(sessionStorage.getItem('user'));
      if (userData && userData.is_admin === true) {
        setCurrentUserIsAdmin(true);
      }
    } catch (e) {
      console.error("Erro ao ler dados do usuário da sessão:", e);
    }

    const fetchAllData = async () => {
      const headers = getAuthHeaders();
      if (!headers) {
        setIsLoading(false);
        return;
      }

      // Usando Promise.all para fazer as duas requisições em paralelo
      try {
        const [statsResponse, usersResponse] = await Promise.all([
          axios.get(`${API_URL}/api/knapp/v1/estatistics`, headers),
          axios.get(`${API_URL}/api/knapp/v1/user`, headers)
        ]);

        setStatsData(statsResponse.data);
        setAllUsers(usersResponse.data.data || []); // Guarda a lista completa de usuários
        setError(null);
      } catch (err) {
        setError("Falha ao carregar os dados iniciais. Verifique sua conexão ou permissões.");
        console.error("Erro ao buscar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Lógica de Exibição e Ações ---

  // 3. Filtra usuários para o select (apenas status === 1)
  const activeUsers = allUsers.filter(user => user.status === 1);

  // 4. Encontra o objeto do usuário selecionado na lista completa
  const selectedUser = allUsers.find(user => user.id.toString() === selectedUserId);

  // 5. Função para o botão "Integrar Usuário"
  const handleIntegrateUser = () => {
    setIsIntegrating(true);
    
    // Simula uma operação de 2 segundos
    setTimeout(() => {
      setIsIntegrating(false);
      Swal.fire({
        title: 'Sucesso!',
        text: `Usuário ${selectedUser?.name || ''} integrado com sucesso.`,
        icon: 'success',
        confirmButtonColor: 'var(--primary-yellow)',
        confirmButtonText: 'OK'
      });
    }, 2000);
  };

  // Derivando dados de estatísticas
  const branches = statsData?.branches || [];
  let statsToDisplay = statsData?.total;
  let statTitle = "Estatísticas Gerais (Total)";

  if (selectedStatView !== 'total') {
    const selectedBranch = branches.find(branch => branch.branch_id.toString() === selectedStatView);
    if (selectedBranch) {
      statsToDisplay = {
        total: selectedBranch.total,
        users_active: selectedBranch.users_active,
        users_pending: selectedBranch.users_pending,
      };
      statTitle = `Estatísticas: ${selectedBranch.branch_name}`;
    }
  }

  if (isLoading) return <div className="loading-container">Carregando dados...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="grid">

        {/* --- CARD DA ESQUERDA: Consulta de Usuário --- */}
        <div className="card square-element">
          <h2 className="sub-header">Consultar Usuário</h2>
          <p className="description">Selecione um usuário ativo para ver seus detalhes e realizar ações.</p>

          <label htmlFor="user-select" className="select-label">Usuário Ativo</label>
          <select 
            id="user-select"
            className="select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Selecione um usuário --</option>
            {activeUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          
          <div className="json-box">
            {selectedUser ? (
              // 6. Monta um JSON "amigável" com informações pertinentes
              <pre>
                {JSON.stringify({
                  dadosPessoais: {
                    id: selectedUser.id,
                    nome: selectedUser.name,
                    email: selectedUser.email,
                    cpf: selectedUser.cpf,
                    telefone: selectedUser.phone_number,
                    status: selectedUser.status === 1 ? 'Ativo' : 'Inativo',
                    admin: selectedUser.is_admin ? 'Sim' : 'Não',
                  },
                  localizacao: {
                    empresa: selectedUser.company?.name,
                    filial: selectedUser.branch?.name,
                    departamento: selectedUser.departament?.title,
                    endereco: `${selectedUser.endereco_detail}, ${selectedUser.uf}`
                  }
                }, null, 2)}
              </pre>
            ) : (
              <div className="placeholder-box">
                <p>Detalhes do usuário aparecerão aqui.</p>
              </div>
            )}
          </div>
          
          {/* 7. Botão de Integração com lógica de permissão */}
          {selectedUser && (
            <button
              className="button button-integrate"
              onClick={handleIntegrateUser}
              disabled={!currentUserIsAdmin || isIntegrating}
            >
              {isIntegrating ? 'Integrando...' : 'Integrar Usuário'}
            </button>
          )}

        </div>

        {/* --- PAINEL LATERAL (DIREITA): Estatísticas Dinâmicas (sem alteração) --- */}
        <div className="side-panel">
          <div className="card">
            <label htmlFor="stats-filter-select" className="select-label">Filtrar Estatísticas por Filial</label>
            <select
              id="stats-filter-select"
              className="select"
              value={selectedStatView}
              onChange={(e) => setSelectedStatView(e.target.value)}
            >
              <option value="total">Visão Geral (Todas as Filiais)</option>
              {branches.map(branch => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          </div>
          
          {statsToDisplay && (
            <div className="card stats-card">
              <h2 className="sub-header">{statTitle}</h2>
              <div className="stats-grid">
                  <div className="stat-item">
                      <span className="stat-value">{statsToDisplay.total}</span>
                      <span className="stat-label">Total</span>
                  </div>
                  <div className="stat-item">
                      <span className="stat-value active-stat">{statsToDisplay.users_active}</span>
                      <span className="stat-label">Ativos</span>
                  </div>
                  <div className="stat-item">
                      <span className="stat-value">{statsToDisplay.users_pending}</span>
                      <span className="stat-label">Pendentes</span>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;