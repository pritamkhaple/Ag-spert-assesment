import React, { useState } from 'react';
import { Box, Button, Tabs, TabList, TabPanels, Tab, TabPanel, useColorMode, useDisclosure, Flex } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import SaleOrderForm from './components/SaleOrder/SaleOrderForm.Component';
import SaleOrderTable from './components/SaleOrder/SaleOrderTable.Component';
const HomePage = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleAddSaleOrder = (newOrder) => {
    if (newOrder.paid) {
      setCompleteOrders([...completeOrders, newOrder]);
    } else {
      setActiveOrders([...activeOrders, newOrder]);
    }
  };

  return (
    <Box width="100%" p={4} bgSize="cover" bgPosition="center" minHeight="100vh">
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Button onClick={toggleColorMode} colorScheme="teal" variant="ghost">
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Button colorScheme={colorMode === 'light' ? 'blue' : 'teal'} onClick={onOpen}>
          + Sale Order
        </Button>
      </Box>
      <Tabs>
        <TabList>
          <Tab _selected={{ color: 'teal.500', fontWeight: 'bold' }}>Active Orders</Tab>
          <Tab _selected={{ color: 'teal.500', fontWeight: 'bold' }}>Complete Orders</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex overflowX="auto">
              <SaleOrderTable orders={activeOrders} type="active" />
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex overflowX="auto">
              <SaleOrderTable orders={completeOrders} type="complete" />
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      {isOpen && (
        <SaleOrderForm isOpen={isOpen} onClose={onClose} onAddSaleOrder={handleAddSaleOrder} />
      )}
    </Box>
  );
};

export default HomePage;