import { Box, Grid, GridItem, Heading } from '@chakra-ui/react';
import MenuForm from './components/MenuForm';
import Sidenav from './components/SideNav';
import MenuContextProvider, { Menu } from './contextes/MenuContext';

const menus: Menu[] = [
  {
    name: 'Dashboard',
    iconSrc:
      'https://res.cloudinary.com/dxlc6foos/image/upload/v1641052343/home-house-interface-ui-ux-svgrepo-com_c84eji.svg',
  },
  {
    name: 'Analysis',
    iconSrc:
      'https://res.cloudinary.com/dxlc6foos/image/upload/v1641052343/interface-list-menu-ui-ux-svgrepo-com_evno2o.svg',
  },
];

const App = () => (
  <MenuContextProvider value={menus}>
    <Grid templateColumns="auto 1fr" height="100vh">
      <Sidenav zIndex={1} />

      <GridItem padding="1rem">
        <Box maxWidth="500px" width="100%">
          <Heading size="lg">Add Menu</Heading>
          <MenuForm />
        </Box>
      </GridItem>
    </Grid>
  </MenuContextProvider>
);

export default App;
