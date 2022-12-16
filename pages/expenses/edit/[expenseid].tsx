import {
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Container,
  VStack,
  Textarea,
  Center,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Navbar from '../../../components/Navbar';
import { Database } from '../../../utils/database.types';
import categories from '../../../components/Categories';

const Edit = () => {
  const supabaseClient = useSupabaseClient<Database>();
  const router = useRouter();

  const { query } = router;
  const idQuery: string = (query?.expenseid as string) ?? '';
  const detailsQuery: string = (query?.details as string) ?? '';
  const amountQuery: string = (query?.amount as string) ?? '';
  const categoryQuery: string = (query?.category as string) ?? '';
  const dateQuery: string = (query?.date as string) ?? '';

  const [details, setDetails] = useState(detailsQuery);
  const [isDetailsInvalid, setIsDetailsInvalid] = useState(false);

  const [amount, setAmount] = useState(amountQuery ?? '');
  const [isAmountInvalid, setIsAmountInvalid] = useState(false);

  const [category, setCategory] = useState(categoryQuery ?? '');
  const [isCategoryInvalid, setIsCategoryInvalid] = useState(false);

  const [date, setDate] = useState(dateQuery ?? '');

  const handleSubmit = async () => {
    const updatePayload: Database['public']['Tables']['expenses']['Update'] = {
      amount: Number(amount),
      category,
      details,
      date,
    };

    const { error, statusText } = await supabaseClient
      .from('expenses')
      .update(updatePayload)
      .eq('id', idQuery);

    if (error === null && statusText) {
      router.back();
    }
  };

  return (
    <>
      <Head>
        <title>Edit Expense</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1"
        />
      </Head>
      <Navbar />

      <Container maxW="md" mt="20px">
        <VStack spacing="20px">
          <FormControl isRequired isInvalid={isDetailsInvalid}>
            <FormLabel>Details</FormLabel>
            <Textarea
              fontSize="16px"
              size="sm"
              value={details}
              onChange={(event) => {
                setDetails(event.target.value);
              }}
              onBlur={() => {
                setIsDetailsInvalid(details.trim() === '');
              }}
            />
            <FormErrorMessage>Details are required.</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={isAmountInvalid}>
            <FormLabel>Amount</FormLabel>
            <Input
              size="sm"
              inputMode="numeric"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              onBlur={() => {
                setIsAmountInvalid(amount.trim() === '');
              }}
            />
            <FormErrorMessage>Amount is required.</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={isCategoryInvalid}>
            <FormLabel>Category</FormLabel>
            <Select
              size="sm"
              value={category}
              placeholder="Select Category"
              onChange={(event) => {
                setCategory(event.target.value);
              }}
              onBlur={() => {
                setIsCategoryInvalid(category.trim() === '');
              }}
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Category is required.</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              size="sm"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
              }}
            />
          </FormControl>
        </VStack>
        <Center>
          <Button
            textAlign="center"
            mt="30px"
            colorScheme="blue"
            size="sm"
            w="50%"
            onClick={handleSubmit}
            disabled={
              details.trim() === '' ||
              amount.trim() === '' ||
              category.trim() === ''
            }
          >
            Add
          </Button>
        </Center>
      </Container>
    </>
  );
};

export default Edit;
