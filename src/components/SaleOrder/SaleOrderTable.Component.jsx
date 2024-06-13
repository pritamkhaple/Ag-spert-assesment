import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import EditSaleOrderModal from '../EditSaleOrderModal.Component';
import ViewSaleOrderModal from '../ViewSaleOrderModal.Component';

function SaleOrderTable({ orders, type }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const renderActionButtons = (order) => {
    if (type === 'active') {
      return (
        <Button size="sm" colorScheme="blue" onClick={() => handleEdit(order)}>
          Edit
        </Button>
      );
    } else if (type === 'complete') {
      return (
        <Button size="sm" colorScheme="green" onClick={() => handleView(order)}>
          View
        </Button>
      );
    }
  };

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Customer Name</Th>
            <Th>Price</Th>
            <Th>Last Modified</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders && orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.customerName}</Td>
              <Td>
                {order.items.map(item => (
                  <div key={item.skuId}>₹ {item.price}</div>
                ))}
              </Td>
              <Td>{order.lastModified}</Td>
              <Td>{renderActionButtons(order)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedOrder && (
        <>
          <EditSaleOrderModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            saleOrder={selectedOrder}
          />
          <ViewSaleOrderModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            saleOrder={selectedOrder}
          />
        </>
      )}
    </>
  );
}

export default SaleOrderTable;
