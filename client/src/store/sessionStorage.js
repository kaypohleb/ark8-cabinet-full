export const loadState = () => {
    try {
      const serializedState = sessionStorage.getItem('ark8SessionState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  }; 

  

  export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem('ark8SessionState', serializedState);
    } catch {
      // ignore write errors
    }
  };