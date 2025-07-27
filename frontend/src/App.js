
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import TransactionList from './components/TransactionList';
import InventoryView from './components/InventoryView';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';


const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
});

function App() {
  return (
    <Router>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Warehouse Management
          </Typography>
          <Button color="inherit" component={StyledLink} to="/">Products</Button>
          <Button color="inherit" component={StyledLink} to="/transactions">Transactions</Button>
          <Button color="inherit" component={StyledLink} to="/inventory">Inventory</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/inventory" element={<InventoryView />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
