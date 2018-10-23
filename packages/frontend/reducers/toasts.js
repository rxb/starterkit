const toasts = (state = [], action) => {
  let newToasts, index;
  switch (action.type) {
    case 'ADD_TOAST':
      newToasts = [...state];
      newToasts.push(action.payload);
      return newToasts;
    case 'HIDE_TOAST':
      newToasts = [...state];
      index = newToasts.findIndex( toast => toast.id == action.payload.id );
      if(index >= 0){
        newToasts[index].visible = false;
      }
      return newToasts;
    case 'REMOVE_TOAST':
      newToasts = [...state];
      index = newToasts.findIndex( toast => toast.id == action.payload.id );
      if(index >= 0){
        newToasts.splice(index, 1);
      }
      return newToasts;
    default:
      return state;
  }
}

export default toasts