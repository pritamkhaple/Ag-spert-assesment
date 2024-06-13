import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  NumberInput,
  NumberInputField,
  Switch,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,

} from '@chakra-ui/react';
import { fetchProducts, fetchCustomerById, createSaleOrder } from '../../api';

function SKUItem({ productId, sku, onSkuChange }) {
  const handlePriceChange = (valueString) => {
    const value = valueString === '' ? '' : parseFloat(valueString);
    onSkuChange(productId, sku.id, 'price', value);
  };

  const handleQuantityChange = (valueString) => {
    const value = valueString === '' ? '' : parseInt(valueString, 10);
    onSkuChange(productId, sku.id, 'quantity', value);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      mb={4}
      key={sku.id}
    >
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>{`SKU ${sku.id} (${sku.quantity} Kg)`}</Box>
        <Box>{`Rate: ₹ ${sku.price}`}</Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl>
          <FormLabel>Selling Rate</FormLabel>
          <NumberInput
            value={sku.price === '' ? '' : sku.price}
            onChange={handlePriceChange}
            isInvalid={sku.price === ''}
          >
            <NumberInputField placeholder="Enter price" />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Total Items</FormLabel>
          <NumberInput
            value={sku.quantity === '' ? '' : sku.quantity}
            onChange={handleQuantityChange}
            isInvalid={sku.quantity === ''}
          >
            <NumberInputField placeholder="Enter quantity" />
          </NumberInput>
        </FormControl>
      </Box>
      <Box textAlign="right" color="green.500">
        {`${sku.quantity} Item(s) Remaining`}
      </Box>
    </Box>
  );
}

function SaleOrderForm({ isOpen, onClose, onAddSaleOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [customer, setCustomer] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [paid, setPaid] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: products } = useQuery('products', fetchProducts);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleProductSelect = (product) => {
    const { id, name, skus } = product;
    if (!selectedProducts.some(p => p.id === id)) {
      setSelectedProducts([...selectedProducts, { id, name, skus }]);
    }
    setSearchTerm('');
    setIsPopoverOpen(false);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(product => product.id !== productId));
  };

  const handleSkuChange = (productId, skuId, field, value) => {
    setSelectedProducts(selectedProducts.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          skus: product.skus.map(sku => {
            if (sku.id === skuId) {
              return { ...sku, [field]: value };
            }
            return sku;
          })
        };
      }
      return product;
    }));
  };

  const handleCustomerIdChange = async (e) => {
    const id = e.target.value;
    setCustomerId(id);
    if (id) {
      try {
        const customerData = await fetchCustomerById(id);
        setCustomer(customerData);
      } catch (error) {
        console.error('Error fetching customer:', error);
        setCustomer(null);
      }
    } else {
      setCustomer(null);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!customerId) formErrors.customerId = 'Customer ID is required';
    if (!invoiceNo) formErrors.invoiceNo = 'Invoice Number is required';
    if (!invoiceDate) formErrors.invoiceDate = 'Invoice Date is required';
    if (selectedProducts.length === 0) {
      formErrors.selectedProducts = 'At least one product must be selected';
    } else {
      selectedProducts.forEach(product => {
        product.skus.forEach(sku => {
          if (sku.price === '' || sku.quantity === '') {
            formErrors.sku = 'All SKU fields must be filled';
          }
        });
      });
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const saleOrderData = {
      id: Math.floor(100 + Math.random() * 900),
      customerName: customer ? customer.name : '',
      items: [],
      paid,
      invoiceNo,
      invoiceDate,
      lastModified: new Date().toLocaleString()
    };

    selectedProducts.forEach(product => {
      product.skus.forEach(sku => {
        if (sku.price !== '' && sku.quantity !== '') {
          saleOrderData.items.push({
            skuId: sku.id,
            price: sku.price,
            quantity: sku.quantity
          });
        }
      });
    });



    try {
      const response = await createSaleOrder(saleOrderData);
      if (response.success) {
        onAddSaleOrder(saleOrderData);
        onClose();
      }
    } catch (error) {
      console.error("Error creating sale order:", error);
    }
  };

  const calculateInputFlex = () => {
    if (selectedProducts.length === 0) {
      return '1';
    }
    return `calc(100% - ${selectedProducts.length * 120}px)`;
  };

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} width="100%">
            <FormControl isInvalid={errors.selectedProducts}>
              <FormLabel>Search for Products</FormLabel>
              <Box position="relative">
                <Flex alignItems="center" borderWidth={1} borderRadius="md" padding={2} wrap="wrap">
                  {selectedProducts.map(product => (
                    <Tag key={product.id} size="md" borderRadius="full" variant="subtle" colorScheme="blue" m={1}>
                      <TagLabel>{product.name}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveProduct(product.id)} />
                    </Tag>
                  ))}
                  <Popover
                    isOpen={isPopoverOpen}
                    onOpen={() => setIsPopoverOpen(true)}
                    onClose={() => setIsPopoverOpen(false)}
                  >
                    <PopoverTrigger>
                      <Input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search for Products"
                        borderColor={errors.selectedProducts ? 'red.500' : 'inherit'}
                        flex={calculateInputFlex()}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody>
                        {filteredProducts?.map(product => (
                          <Box
                            key={product.id}
                            padding={2}
                            borderBottomWidth={1}
                            cursor="pointer"
                            _hover={{ bg: 'gray.100' }}
                            onClick={() => handleProductSelect(product)}
                          >
                            {product.name}
                          </Box>
                        ))}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Flex>
              </Box>
            </FormControl>
            <FormControl isInvalid={errors.customerId}>
              <FormLabel>Customer ID</FormLabel>
              <Input
                type="text"
                value={customerId}
                onChange={handleCustomerIdChange}
                placeholder={errors.customerId || "Enter Customer ID"}
                borderColor={errors.customerId ? 'red.500' : 'inherit'}
              />
            </FormControl>

            {customer && (
              <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
                <Box fontWeight="bold" mb={2}>{customer.name}</Box>
                <Box mb={2}>{`Email: ${customer.email}`}</Box>
                <Box>{`Location: ${customer.location_name}`}</Box>
              </Box>
            )}

            <FormControl isInvalid={errors.invoiceNo}>
              <FormLabel>Invoice Number</FormLabel>
              <Input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder={errors.invoiceNo || "Enter Invoice Number"}
                borderColor={errors.invoiceNo ? 'red.500' : 'inherit'}
              />
            </FormControl>

            <FormControl isInvalid={errors.invoiceDate}>
              <FormLabel>Invoice Date</FormLabel>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                placeholder={errors.invoiceDate || "Enter Invoice Date"}
                borderColor={errors.invoiceDate ? 'red.500' : 'inherit'}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="paid" mb="0">
                Payment Status
              </FormLabel>
              <Switch id="paid" isChecked={paid} onChange={() => setPaid(!paid)} />
            </FormControl>



            {selectedProducts.map(product => (
              <Box key={product.id}>
                <Box fontWeight="bold">{product.name}</Box>
                {product.skus.map(sku => (
                  <SKUItem key={sku.id} productId={product.id} sku={sku} onSkuChange={handleSkuChange} />
                ))}
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Create Sale Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SaleOrderForm;
