// src/services/Consults.jsx
import axios from 'axios';

const apiUrl = import.meta.env.VITE_KNAPP_API;

export const getCompaniesWithBranches = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/knapp/view-company`);
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    throw error;
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/knapp/view-departament`);
    // Filtra apenas departamentos com status 1
    const activeDepartments = response.data.data.filter(dept => dept.status === 1);
    return activeDepartments;
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
    throw error;
  }
};

export const getCompanyDepartments = async (companyId, branchId) => {
    try {
      const companiesResponse = await axios.get(`${apiUrl}/api/knapp/view-company`);
      const company = companiesResponse.data.data.find(c => c.id === companyId);
      
      if (!company) return [];
      
      const branch = company.branches.find(b => b.id === branchId);
  
      // Se branch existir e tiver departaments_json válido, parseia e retorna os ativos
      if (branch?.departaments_json) {
        try {
          const branchDepartments = JSON.parse(branch.departaments_json);
          return branchDepartments.filter(dept => dept.status === 1);
        } catch (e) {
          console.error('Erro ao parsear departaments_json:', e);
          return [];
        }
      }
  
      // Se não tiver departaments_json, retorna lista vazia
      return [];
  
    } catch (error) {
      console.error('Erro ao buscar departamentos da empresa:', error);
      throw error;
    }
  };

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/user-create`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};