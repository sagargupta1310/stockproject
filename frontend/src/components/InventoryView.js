
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Paper, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material';

function InventoryView() {
  const [inventory, setInventory] = useState([]);
  const [date, setDate] = useState('');

  const fetchInventory = async (dateParam = '') => {
    let url = dateParam ? `inventory-at-date/?date=${dateParam}` : 'inventory/';
    const res = await api.get(url);
    setInventory(res.data);
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleDateChange = e => {
    setDate(e.target.value);
    if (e.target.value) fetchInventory(e.target.value);
    else fetchInventory();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Inventory</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField type="date" label="Date" value={date} onChange={handleDateChange} size="small" InputLabelProps={{ shrink: true }} />
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Stock In</TableCell>
              <TableCell>Stock Out</TableCell>
              <TableCell>Current Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map(item => (
              <TableRow key={item.product.id}>
                <TableCell>{item.product.code}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.stock_in}</TableCell>
                <TableCell>{item.stock_out}</TableCell>
                <TableCell>{item.current_stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default InventoryView; 