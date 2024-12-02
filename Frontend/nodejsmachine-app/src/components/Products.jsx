import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
    Pagination,
    Box
} from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [name, setName] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [openAlert, setOpenAlert] = useState(false);
  const [showTable, setShowTable] = useState(false); // State to control table visibility

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?page=${page}&size=${pageSize}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/categories', {
        categoryName: newCategoryName,
      });
      setAlertMessage(response.data.message);
      setAlertSeverity('success');
      setOpenAlert(true);
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      setAlertMessage('Error adding category.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const response = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, {
          productName: name,
          categoryID,
        });
        setAlertMessage(response.data.message);
      } else {
        const response = await axios.post('http://localhost:5000/api/products', {
          productName: name,
          categoryID,
        });
        setAlertMessage(response.data.message);
      }
      setAlertSeverity('success');
      setOpenAlert(true);
      setName('');
      setCategoryID('');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      setAlertMessage('Error processing request.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleEdit = (product) => {
    setName(product.productName);
    setCategoryID(product.categoryID._id);
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${id}`);
      setAlertMessage(response.data.message);
      setAlertSeverity('success');
      setOpenAlert(true);
      fetchProducts();
    } catch (error) {
      setAlertMessage('Error deleting product.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  // Toggle table visibility
  const toggleTable = () => setShowTable(!showTable);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Nodejs Machine
      </Typography>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Add Category */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Add New Category</Typography>
        <form onSubmit={handleAddCategory}>
          <TextField
            label="Category Name"
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
            required
            sx={{ my: 2 }}
          />
          <Button type="submit" variant="contained">
            Add Category
          </Button>
        </form>
      </Box>

      {/* Add/Edit Product */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">{editingProduct ? 'Edit Product' : 'Add Product'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Product Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            sx={{ my: 2 }}
          />
          <Select
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
            displayEmpty
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
          <Button type="submit" variant="contained">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </form>
      </Box>

      {/* Toggle Table Button */}
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" onClick={toggleTable}>
          {showTable ? 'Hide Table' : 'View Table'}
        </Button>
      </Box>

      {/* Conditionally Render Product Table */}
      {showTable && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product._id}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.categoryID.categoryName}</TableCell>
                  <TableCell>{product.categoryID._id}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(product)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Products;
