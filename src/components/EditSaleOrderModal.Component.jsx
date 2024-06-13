import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
} from '@chakra-ui/react';

function EditSaleOrderModal({ isOpen, onClose, saleOrder }) {
  const [editedItems, setEditedItems] = useState([...saleOrder.items]);
  const [paid, setPaid] = useState(saleOrder.paid);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editedItems];
    updatedItems[index][field] = value;
    setEditedItems(updatedItems);
  };

  const handlePaymentStatusChange = () => {
    setPaid(!paid);
  };

  const handleSaveChanges = () => {
    console.log("Edited Sale Order Items:", editedItems);
    console.log("Updated Payment Status:", paid);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {editedItems.map((item, index) => (
            <FormControl key={index}>
              <FormLabel>{`Item ${index + 1} Price`}</FormLabel>
              <Input
                defaultValue={item.price}
                placeholder="Enter price"
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              />
            </FormControl>
          ))}
          <FormControl display="flex" alignItems="center" mt={4}>
            <FormLabel htmlFor="paid" mb="0">
              Payment Status
            </FormLabel>
            <Switch id="paid" isChecked={paid} onChange={handlePaymentStatusChange} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="green" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditSaleOrderModal;
