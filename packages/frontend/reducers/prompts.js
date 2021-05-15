const prompts = (state = [], action) => {
	let newPrompts, index;
	switch (action.type) {
		case 'ADD_PROMPT':
			newPrompts = [...state];
			newPrompts.push(action.payload);
			return newPrompts;
		case 'HIDE_PROMPT':
			newPrompts = [...state];
			index = newPrompts.findIndex(prompt => prompt.id == action.payload.id);
			if (index >= 0) {
				newPrompts[index].showable = false;
			}
			return newPrompts;
		case 'REMOVE_PROMPT':
			newPrompts = [...state];
			index = newPrompts.findIndex(prompt => prompt.id == action.payload.id);
			if (index >= 0) {
				newPrompts.splice(index, 1);
			}
			return newPrompts;
		default:
			return state;
	}
}

export default prompts