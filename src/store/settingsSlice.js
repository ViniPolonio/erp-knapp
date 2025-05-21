// src/store/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  breadcrumbs_presets: {
    '/dashboard': 'Dashboard',
    '/usuarios': 'Usuários',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // aqui você pode colocar reducers se precisar atualizar esse estado no futuro
  },
});

export default settingsSlice.reducer;
