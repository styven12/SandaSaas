import React, { createContext, useContext, useMemo, useState } from 'react';

const ZoneContext = createContext(null);

export function ZoneProvider({ children }) {
  const [selectedZone, setSelectedZone] = useState(null);

  const value = useMemo(() => ({ selectedZone, setSelectedZone }), [selectedZone]);

  return <ZoneContext.Provider value={value}>{children}</ZoneContext.Provider>;
}

export function useZoneContext() {
  const context = useContext(ZoneContext);

  if (!context) {
    throw new Error('useZoneContext must be used within a ZoneProvider');
  }

  return context;
}

export default ZoneContext;
