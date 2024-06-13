import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';

function SaleOrderDetailsForm({ order }) {
  return (
    <VStack spacing={4} align="start">
      <Box>
        <Text fontWeight="bold">Order ID:</Text> {order.id}
      </Box>
      <Box>
        <Text fontWeight="bold">Customer Name:</Text> {order.customerName}
      </Box>
      <Box>
        <Text fontWeight="bold">Price:</Text> ₹{order.price}
      </Box>
      <Box>
        <Text fontWeight="bold">Last Modified:</Text> {order.lastModified}
      </Box>
      <Box>
        <Text fontWeight="bold">Items:</Text>
        {order.items.map((item) => (
          <Box key={item.skuId} pl={4}>
            <Text>SKU: {item.skuId}</Text>
            <Text>Price: ₹{item.price}</Text>
            <Text>Quantity: {item.quantity}</Text>
          </Box>
        ))}
      </Box>
    </VStack>
  );
}

export default SaleOrderDetailsForm;
