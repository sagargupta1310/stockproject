
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Stack } from '@mui/material';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ code: '', name: '', description: '', unit: '' });
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    const res = await api.get('products/');
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('products/', form);
      setForm({ code: '', name: '', description: '', unit: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.code?.[0] || 'Error adding product');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Products</Typography>
      <form onSubmit={handleSubmit}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField name="code" label="Code" value={form.code} onChange={handleChange} required size="small" />
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} required size="small" />
          <TextField name="description" label="Description" value={form.description} onChange={handleChange} size="small" />
          <TextField name="unit" label="Unit" value={form.unit} onChange={handleChange} required size="small" />
          <Button type="submit" variant="contained">Add Product</Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </form>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.code}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{p.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ProductList; 