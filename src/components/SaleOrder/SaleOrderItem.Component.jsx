import React, { useState } from 'react';
import { Tr, Td, Button } from '@chakra-ui/react';
import EditSaleOrderModal from '../EditSaleOrderModal.Component';
import ViewSaleOrderModal from '../ViewSaleOrderModal.Component';

function SaleOrderItem({ order }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleView = () => {
    setIsViewModalOpen(true);
  };

  return (
    <Tr>
      <Td>{order.id}</Td>
      <Td>{order.customerName}</Td>
      <Td>{order.price}</Td>
      <Td>{order.lastModified}</Td>
      <Td>
        <Button size="sm" colorScheme="blue" onClick={handleEdit}>
          Edit
        </Button>
        <Button size="sm" colorScheme="green" onClick={handleView}>
          View
        </Button>
      </Td>
      <EditSaleOrderModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} saleOrder={order} />
      <ViewSaleOrderModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} saleOrder={order} />
    </Tr>
  );
}

export default SaleOrderItem;
