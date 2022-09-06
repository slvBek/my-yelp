import './App.css';
import { createRestaurant, deleteRestaurant} from './graphql/mutations'
import { listRestaurants } from './graphql/queries'
import { withAuthenticator, Button, Text, Flex, Heading } from "@aws-amplify/ui-react";
import { useCallback, useEffect, useState } from 'react';
import { API } from 'aws-amplify';

function App({ signOut }) {
  const [ notes, setNotes ] = useState([])

  const fetchNotes = useCallback(async () => {
    const result = await API.graphql({
      query: listRestaurants,
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    setNotes(result.data.listRestaurants.items)
  }, [setNotes])

  const handlecreateRestaurant = useCallback(async () => {
    await API.graphql({
      query: createRestaurant,
      variables: { input: { text: window.prompt("New restourant") } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    fetchNotes()
  }, [fetchNotes])

  const handledeleteRestaurant = useCallback(async (id) => {
    await API.graphql({
      query: deleteRestaurant,
      variables: { input: { id: id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    fetchNotes()
  }, [fetchNotes])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return (
    <Flex direction={"column"}>
      <Flex justifyContent={'space-between'}>
        <Heading level={1}>My notes</Heading>
        <Button onClick={signOut}>Sign Out</Button>
      </Flex>
      {notes.map(note => <Flex alignItems={'center'}>
        <Text>{note.text}</Text>
        <Button onClick={() => handledeleteRestaurant(note.id)}>Remove</Button>
      </Flex>)}
      <Button onClick={handlecreateRestaurant}>Add Note</Button>
    </Flex>
  );
}

export default withAuthenticator(App);