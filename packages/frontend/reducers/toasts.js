const toasts = (state = [], action) => {
	let newToasts, index;
	switch (action.type) {
		case 'ADD_TOAST':
		case 'ADD_DELAYED_TOAST':
			newToasts = [...state];
			newToasts.push(action.payload);
			return newToasts;
		case 'SHOW_DELAYED_TOASTS':
			newToasts = [...state];
			newToasts.forEach((toast, index) => {
				if (newToasts[index].delayed) {
					newToasts[index].visible = true;
					newToasts[index].delayed = false;
				}
			});
			return newToasts;
		case 'HIDE_TOAST':
			newToasts = [...state];
			index = newToasts.findIndex(toast => toast.id == action.payload.id);
			if (index >= 0) {
				newToasts[index].visible = false;
			}
			return newToasts;
		case 'REMOVE_TOAST':
			newToasts = [...state];
			index = newToasts.findIndex(toast => toast.id == action.payload.id);
			if (index >= 0) {
				newToasts.splice(index, 1);
			}
			return newToasts;
		default:
			return state;
	}
}

export default toasts