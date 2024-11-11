import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { ChevronDown, ChevronUp, Search, Hotel, Utensils, Camera } from 'lucide-react';
import '../styles/TurismPage.css'; // Asegúrate de incluir tus estilos CSS

const TourismPage = ({ municipio }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    Hoteles: false,
    Restaurantes: false,
    Atracciones: false
  });
  const [rol, setUserRole] = useState(null); 
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://buscarubicacionespormunicipio-jkomhrg5ba-uc.a.run.app/', {
          method: 'POST',
          body: JSON.stringify({ municipio }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Error al cargar lugares');

        const contentType = response.headers.get('content-type');
        let placesData = [];

        if (contentType.includes('application/json')) {
          placesData = await response.json();
        } else if (contentType.includes('multipart/form-data')) {
          const formData = await response.formData();
          const jsonFile = formData.get('documentos');

          if (!jsonFile) {
            setError("No se encontraron datos de lugares");
            return;
          }

          const jsonText = await jsonFile.text();
          placesData = JSON.parse(jsonText);
          placesData = placesData.map(place => {
            const imageFile = formData.get(place.URLImagen);
            if (imageFile) place.imageUrl = URL.createObjectURL(imageFile);
            return place;
          });
        } else {
          throw new Error('Formato de respuesta no soportado');
        }

        setPlaces(placesData);
      } catch (err) {
        console.error('Error al cargar los lugares:', err);
        setError("Error al cargar los lugares");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [municipio]);

  const filteredPlaces = places.filter(place =>
    place.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filters.Hoteles || place.Tipo === 'Hotel') &&
    (!filters.Restaurantes || place.Tipo === 'Restaurante') &&
    (!filters.Atracciones || place.Tipo === 'Atracción')
  );

  const handlePlaceClick = (place) => {
    navigate('/placedetails', { state: { place } });
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);

    if (token) {
      try {
        // Decodifica el JWT para extraer la información
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // Verifica si el token contiene el rol
        const userRole = decodedToken.rol;

        if (userRole) {
          setIsAuthenticated(true);
          setUserRole(userRole); // Establece el rol desde el token
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-6xl font-bold text-center mb-12 " style={{color:'rgb(1, 70, 1)', paddingTop:'40px', fontSize:'3rem'}}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        >
          Descubre {municipio}
        </motion.h1>

        {isAuthenticated && rol === 'anfitrion' || isAuthenticated && rol === 'admin' && (
          <button 
            onClick={() => navigate('/add-place')} 
            className=" text-white py-2 px-4 rounded-full mb-8"
            style={{backgroundColor:"rgba(1, 70, 1, 0.692)"}}
          >
            Agregar Lugar
          </button>
        )}

        <motion.div 
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="w-full md:w-auto px-6 py-3 bg-white rounded-full font-semibold text-lg flex items-center justify-center hover:bg-green-100 transition-colors duration-300 shadow-md"
            >
              Filtrar
              {filtersVisible ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
            </button>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar lugares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-50 backdrop-filter backdrop-blur-md rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
              />
            </div>
          </div>

          <AnimatePresence>
            {filtersVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 space-y-4"
              >
                {['Hoteles', 'Restaurantes', 'Atracciones'].map((filter) => (
                  <label key={filter} className="flex items-center space-x-3 cursor-pointer group" >
                    <input
                      type="checkbox"
                      checked={filters[filter]}
                      onChange={(e) => setFilters(prev => ({ ...prev, [filter]: e.target.checked }))}
                      className="form-checkbox h-6 w-6 rounded-md border-2 border-white focus:ring-0 focus:ring-offset-0 transition-all duration-300" 
                    />
                    <span className="text-lg font-medium  transition-colors duration-300" >
                      {filter === 'Hoteles' && <Hotel className="inline-block mr-2 h-5 w-5" />}
                      {filter === 'Restaurantes' && <Utensils className="inline-block mr-2 h-5 w-5" />}
                      {filter === 'Atracciones' && <Camera className="inline-block mr-2 h-5 w-5" />}
                      {filter}
                    </span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {loading ? (
          <p>Cargando lugares...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="places-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place, index) => (
                <div key={index} className="place-item border rounded-lg p-4 bg-white shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => handlePlaceClick(place)}>
                  {place.imageUrl ? (
                    <img src={place.imageUrl} alt={place.Nombre} className="place-image rounded-lg mb-2" />
                  ) : (
                    <p>Imagen no disponible</p>
                  )}
                  <h3 className="font-semibold" style={{fontSize:'1.2rem', padding:'15px'}}>{place.Nombre}</h3>
                  <p>{place.Descripcion}</p>
                </div>
              ))
            ) : (
              <p>No se encontraron lugares.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourismPage;

