import Page from './Page';
import CinderblockHeader from './CinderblockHeader';

const CinderblockPage = (props) => {
   return(
      <Page>
         <CinderblockHeader />
         {props.children}
      </Page>
   )
}

export default CinderblockPage;