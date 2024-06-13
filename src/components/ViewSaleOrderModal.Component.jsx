import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
} from '@chakra-ui/react';

function ViewSaleOrderModal({ isOpen, onClose, saleOrder }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>View Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text fontWeight="bold">Order ID:</Text> {saleOrder.id}
          </Box>
          <Box>
            <Text fontWeight="bold">Customer Name:</Text> {saleOrder.customerName}
          </Box>
          <Box>
            <Text fontWeight="bold">Price:</Text> ₹{saleOrder.items.map(item => item.price).join(', ')}
          </Box>
          <Box>
            <Text fontWeight="bold">Last Modified:</Text> {saleOrder.lastModified}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ViewSaleOrderModal;