

export const loadState = () => {
  try {
    const serialized = localStorage.getItem('state');
    if(serialized === null) {
      return undefined;
    }
    return JSON.parse(serialized);
  } catch(e) {
    console.log('Failed to get local storage', e);
  }
};


export const saveState = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem('state', serialized);
  } catch(e) {
    console.log('error saving state', e);
  }
};

