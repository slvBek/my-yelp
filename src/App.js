import './App.css';
import { listRestaurants } from './graphql/queries'
import { withAuthenticator, Button, Flex, Heading } from "@aws-amplify/ui-react";
import { useCallback, useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import React from 'react';
import View from "./components/View"

function App({ signOut }) {
  const getDatafromLS=()=>{
    const data = localStorage.getItem('restaurants');
    if(data){
      return JSON.parse(data);
    }
    else{
      return []
    }
  }

  const [restaurants, setRestaurants] = useState(getDatafromLS());
  const [ setNotes ] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const handleAddRestaurantSubmit=(e)=>{
    e.preventDefault();
    let restaurant={
      name,
      description,
      city
    }
    setRestaurants([...restaurants, restaurant]);
    setName('');
    setDescription('');
    setCity('');
  }

  useEffect(()=>{
    localStorage.setItem('restaurants',JSON.stringify(restaurants));
  },[restaurants])

  const fetchNotes = useCallback(async () => {
    const result = await API.graphql({
      query: listRestaurants,
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
    setNotes(result.data.listRestaurants.items)
  }, [setNotes])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return (
    <>
    <div class="bg-img">
    <Flex direction={"column"}>
      <Flex justifyContent={'space-between'}>
        <nav class="navbar navbar-dark bg-dark">
        <Heading style={{ color: 'white', marginLeft: "25px" }}level={1}>My Yelp</Heading>
        <Button class="btn btn-primary" onClick={signOut}>Sign Out</Button>
    </nav>
      </Flex>
    </Flex>
    <div className='wrapper'>
      <div className='main'>
            <div className='form-container'>
                <form autoComplete="off" className='form-group'
                onSubmit={handleAddRestaurantSubmit}>
                  <label>Name</label>
                  <input type="text" placeholder='name' className='form-control' required
                  onChange={(e)=>setName(e.target.value)} value={name}></input>
                  <br></br>
                  <label>Description</label>
                  <input type="text" placeholder='description' className='form-control' required
                  onChange={(e)=>setDescription(e.target.value)} value={description}></input>
                  <br></br>
                  <label>City</label>
                  <input type="text" placeholder='city' className='form-control' required
                  onChange={(e)=>setCity(e.target.value)} value={city}></input>
                  <br></br>
                  <button type="submit" className='btn btn-success btn-md'>Add New Restaurant</button>
                </form>
            </div>
            <div className='view-container'>
                {restaurants.length>0&&<>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>City</th>
                        </tr>
                      </thead>
                      <tbody>
                        <View restaurants={restaurants}/>
                      </tbody>
                    </table>
                  </div>
                </>}
                {restaurants.length < 1 && <div>No information are added yet</div>}
            </div>
        </div>
    </div>
    </div>
    </>
    
  );
}

export default withAuthenticator(App);