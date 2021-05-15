const dropdowns = (state = [], action) => {
	let newDropdowns, index;
	switch (action.type) {
		case 'ADD_DROPDOWN':
			newDropdowns = [...state];
			newDropdowns.push(action.payload);
			return newDropdowns;
		case 'HIDE_DROPDOWN':
			newDropdowns = [...state];
			index = newDropdowns.findIndex(dropdown => dropdown.id == action.payload.id);
			if (index >= 0) {
				newDropdowns[index].visible = false;
			}
			return newDropdowns;
		case 'REMOVE_DROPDOWN':
			newDropdowns = [...state];
			index = newDropdowns.findIndex(dropdown => dropdown.id == action.payload.id);
			if (index >= 0) {
				newDropdowns.splice(index, 1);
			}
			return newDropdowns;
		case 'CLEAR_DROPDOWNS':
			return [];
		default:
			return state;
	}
}

export default dropdowns