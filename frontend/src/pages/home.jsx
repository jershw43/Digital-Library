import React from 'react';

const Home = () => {
  return (
    <>
      <form action="/search-results" method='get'> 
        <input type="text" id="query" name="query" placeholder="Search for a book" />
        <button type="submit">Search</button>
      </form> 
    </>
  );
};

export default Home;