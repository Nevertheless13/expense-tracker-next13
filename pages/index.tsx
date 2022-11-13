import { useEffect } from 'react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Flex,
  Button,
  useDisclosure,
  Container,
} from '@chakra-ui/react';
import AddTransactionModal from '../components/AddTransactionModal';
import Navbar from '../components/Navbar';
import expenses from '../mocks/expenses.json';

interface Expense {
  date: string;
  amount: number;
  account: string;
  category: string;
  remarks: string;
}

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const allExpenses: Expense[] = expenses;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return !session ? (
    <Container>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
      />
    </Container>
  ) : (
    <>
      <Navbar />
      <Flex mt={'50px'} direction="column" alignItems={'center'}>
        <Heading mb={'10px'}>November</Heading>
        <Button onClick={onOpen}>Open Modal</Button>
        <TableContainer border="1px solid white" maxWidth={'90%'}>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>date</Th>
                <Th isNumeric>amount</Th>
                <Th>account</Th>
                <Th>category</Th>
                <Th>remarks</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allExpenses.map((expense) => (
                <Tr key={expense.remarks}>
                  <Td>{expense.date}</Td>
                  <Td isNumeric>{expense.amount}</Td>
                  <Td>{expense.account}</Td>
                  <Td>{expense.category}</Td>
                  <Td whiteSpace="initial">{expense.remarks}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <AddTransactionModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
