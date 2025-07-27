
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Stack, MenuItem, Select, InputLabel, FormControl, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    transaction_type: 'IN',
    reference: '',
    date: '',
    remarks: '',
    details: [{ product_id: '', quantity: 1 }],
  });
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    const res = await api.get('transactions/');
    setTransactions(res.data);
  };
  const fetchProducts = async () => {
    const res = await api.get('products/');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDetailChange = (idx, e) => {
    const details = [...form.details];
    details[idx][e.target.name] = e.target.value;
    setForm({ ...form, details });
  };
  const addDetail = () => {
    setForm({ ...form, details: [...form.details, { product_id: '', quantity: 1 }] });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('transactions/', form);
      setForm({ transaction_type: 'IN', reference: '', date: '', remarks: '', details: [{ product_id: '', quantity: 1 }] });
      fetchTransactions();
    } catch (err) {
      setError('Error adding transaction');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Stock Transactions</Typography>
      <form onSubmit={handleSubmit}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select name="transaction_type" value={form.transaction_type} label="Type" onChange={handleChange} required>
              <MenuItem value="IN">Stock In</MenuItem>
              <MenuItem value="OUT">Stock Out</MenuItem>
            </Select>
          </FormControl>
          <TextField name="reference" label="Reference" value={form.reference} onChange={handleChange} required size="small" />
          <TextField name="date" type="date" value={form.date} onChange={handleChange} required size="small" InputLabelProps={{ shrink: true }} />
          <TextField name="remarks" label="Remarks" value={form.remarks} onChange={handleChange} size="small" />
        </Stack>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Details:</Typography>
          {form.details.map((d, idx) => (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Product</InputLabel>
                <Select name="product_id" value={d.product_id} label="Product" onChange={e => handleDetailChange(idx, e)} required>
                  <MenuItem value="">Select Product</MenuItem>
                  {products.map(p => (
                    <MenuItem key={p.id} value={p.id}>{p.code} - {p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField name="quantity" type="number" label="Quantity" min="1" value={d.quantity} onChange={e => handleDetailChange(idx, e)} required size="small" sx={{ width: 100 }} />
            </Stack>
          ))}
          <IconButton color="primary" onClick={addDetail} size="small" sx={{ mt: 1 }}><AddIcon /></IconButton>
        </Box>
        <Button type="submit" variant="contained">Add Transaction</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </form>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.transaction_type}</TableCell>
                <TableCell>{t.reference}</TableCell>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.remarks}</TableCell>
                <TableCell>
                  {t.details.map(d => (
                    <div key={d.id}>{d.product.code} x {d.quantity}</div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TransactionList; 