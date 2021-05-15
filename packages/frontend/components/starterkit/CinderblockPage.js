import Page from 'components/Page';
import CinderblockHeader from './CinderblockHeader';

const CinderblockPage = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	return (
		<Page>
			<CinderblockHeader />
			{props.children}
		</Page>
	)
}

export default CinderblockPage;