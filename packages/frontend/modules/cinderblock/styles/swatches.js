const swatches = {
	textPrimary: 'rgba(0,0,0,.87)',
	textSecondary: 'rgba(0,0,0,.57)',
	textHint: 'rgba(0,0,0,.33)',
	textPrimaryInverted: '#ffffff',
	textSecondaryInverted: 'rgba(255,255,255,0.7)',
	textHintInverted: 'rgba(255,255,255,0.5)',
	shade: 'rgba(0,0,0,.06)',
	shadeInverted: 'rgba(255,255,255,0.5)',
	notwhite: 'rgba(0,0,0,.015)',
	tint: '#4353ff',
	focus: 'rgba(0,122,255,.25)',
	error: 'red',
	border: 'rgba(0,0,0,.15)',
	backgroundWhite: '#fff',
	backgroundDark: '#222',
	backgroundShade: '#fafafa',
	get buttonPrimaryBackground() {
		return this.tint
	},
	get buttonSecondaryBackground() {
		return this.shade
	},
	get buttonPrimaryInvertedBackground() {
		return this.textPrimaryInverted
	},
	get buttonSecondaryInvertedBackground() {
		return this.shadeInverted
	},
	get buttonPrimaryInk() {
		return this.textPrimaryInverted
	},
	get buttonSecondaryInk() {
		return this.tint
	},
	get buttonPrimaryInvertedInk() {
		return this.textPrimary
	},
	get buttonSecondaryInvertedInk() {
		return this.textPrimaryInverted
	}
}
export default swatches;