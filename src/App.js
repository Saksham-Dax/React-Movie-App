import React, { useState } from 'react';
import styled from 'styled-components';
import Axios from 'axios';

// components
import MovieComponent from './Components/MovieComponent';
import MovieInfoComponent from './Components/MovieInfoComponent';

export const API_KEY = "958f8f03";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;

const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;

const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 5px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;

const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;

const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;
`;

const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");
  const [timeoutId, updateTimeoutId] = useState();
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState(null);

  const fetchData = async (searchString) => {
    try {
      const response = await Axios.get(
        `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`
      );
      if (response.data.Search) {
        updateMovieList(response.data.Search);
      } else {
        updateMovieList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onTextChange = (e) => {
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };

  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src="/movie-icon.svg" />
          YourMovies.com
        </AppName>
        <SearchBox>
          <SearchIcon src="/search-icon.svg" />
          <SearchInput
            placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>

      {selectedMovie && (
        <MovieInfoComponent
          selectedMovie={selectedMovie}
          onMovieSelect={() => onMovieSelect(null)} // Clear selected movie
        />
      )}

      <MovieListContainer>
        {movieList.length > 0 ? (
          movieList.map((movie) => (
            <MovieComponent
              key={movie.imdbID} // Use imdbID as key instead of index
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src="/movie-icon.svg" alt="placeholder" />
        )}
      </MovieListContainer>
    </Container>
  );
}

export default App;