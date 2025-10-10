import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  featuredProperties: [],
  filteredProperties: [],
  currentProperty: null,
  loading: false,
  error: null,
  filters: {
    propertyType: '',
    location: '',
    tags: [],
  }
};

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    fetchPropertiesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPropertiesSuccess: (state, action) => {
      state.loading = false;
      state.properties = action.payload;
      state.error = null;
    },
    fetchFeaturedPropertiesSuccess: (state, action) => {
      state.loading = false;
      state.featuredProperties = action.payload;
      state.error = null;
    },
    fetchPropertyByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentProperty = action.payload;
      state.error = null;
    },
    fetchPropertiesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    filterProperties: (state) => {
      const { propertyType, location, tags } = state.filters;
      
      state.filteredProperties = state.properties.filter(property => {
        const matchesType = !propertyType || property.propertyType === propertyType;
        const matchesLocation = !location || 
          property.address?.city?.toLowerCase().includes(location.toLowerCase()) || 
          property.address?.area?.toLowerCase().includes(location.toLowerCase());
        
        const matchesTags = tags.length === 0 || 
          tags.some(tag => property.tags?.includes(tag));
        
        return matchesType && matchesLocation && (tags.length === 0 || matchesTags);
      });
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProperties = [];
    },
  },
});

export const { 
  fetchPropertiesStart, 
  fetchPropertiesSuccess, 
  fetchFeaturedPropertiesSuccess,
  fetchPropertyByIdSuccess,
  fetchPropertiesFailure,
  setFilters,
  filterProperties,
  clearFilters
} = propertySlice.actions;

export default propertySlice.reducer;