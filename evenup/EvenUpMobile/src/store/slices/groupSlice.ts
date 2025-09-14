import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '../../types/order.types';

interface GroupState {
  currentGroup: Group | null;
  userGroups: Group[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  currentGroup: null,
  userGroups: [],
  isLoading: false,
  error: null,
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentGroup: (state, action: PayloadAction<Group | null>) => {
      state.currentGroup = action.payload;
    },
    setUserGroups: (state, action: PayloadAction<Group[]>) => {
      state.userGroups = action.payload;
    },
    addUserGroup: (state, action: PayloadAction<Group>) => {
      state.userGroups.push(action.payload);
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      if (state.currentGroup?.id === action.payload.id) {
        state.currentGroup = action.payload;
      }
      const index = state.userGroups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.userGroups[index] = action.payload;
      }
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
    clearUserGroups: (state) => {
      state.userGroups = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentGroup,
  setUserGroups,
  addUserGroup,
  updateGroup,
  clearCurrentGroup,
  clearUserGroups,
} = groupSlice.actions;

export default groupSlice.reducer;