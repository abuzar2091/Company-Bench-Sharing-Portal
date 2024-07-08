import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();


export const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState('available');
    return (
        <FilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </FilterContext.Provider>
    );
};
export const useFilterContext = () => useContext(FilterContext);
