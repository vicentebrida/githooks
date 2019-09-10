import React, { useState, useEffect } from 'react';

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(handlePositionReceived);

    return () => navigator.geolocation.clearWatch(watchId);
  }, [])

  useEffect(async () => {
    const response = await fetch('https://api.github.com/users/vicentebrida/repos');
    const data = await response.json();

    setRepositories(data);
  }, []);

  useEffect(() => {
    const filtered = repositories.filter(repo => repo.favorite);

    document.title = `Você tem ${filtered.length} favoritos`
  }, [repositories]);

  function handleFavorite(id) {
    const newRepositories = repositories.map(repo => {
      return repo.id === id ? { ...repo, favorite: !repo.favorite } : repo
    });

    setRepositories(newRepositories);
  }

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords;
    setLocation({ latitude, longitude });
  }

  return (
    <>
      Latitude: {location.latitude} <br />
      Longitude: {location.longitude}<br /><br />
    
    <ul>
      { repositories.map(repo => (
      <li key={repo.id}>
        {repo.name}
        {repo.favorite && <span>(Favorito)</span>}
        <button onClick={() => handleFavorite(repo.id)}>Favoritar</button>
      </li>
      ))}
    </ul>
    </>
  )
}