import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPlace = () => {
  const [placeData, setPlaceData] = useState({
    Nombre: '',
    Descripcion: '',
    Tipo: '',
    Latitud: '',
    Longitud: '',
    URLImagen: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPlaceData((prevData) => ({
      ...prevData,
      URLImagen: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Preparar datos para el envío
    const formData = new FormData();
    formData.append('Nombre', placeData.Nombre);
    formData.append('Descripcion', placeData.Descripcion);
    formData.append('Tipo', placeData.Tipo);
    formData.append('Latitud', placeData.Latitud);
    formData.append('Longitud', placeData.Longitud);
    if (placeData.URLImagen) {
      formData.append('URLImagen', placeData.URLImagen);
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('https://crearubicacion-jkomhrg5ba-uc.a.run.app', {
        method: 'POST',
        headers: {
            Authorization: `Bearer `+token,
            "Content-Type": "application/json",
          },
        body: formData,
      });

      if (!response.ok) throw new Error('Error al agregar el lugar');

      // Redirigir al usuario a la página de lugares después de agregar
      navigate('/tourism');
    } catch (err) {
      setError('Hubo un error al agregar el lugar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Agregar Lugar</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="Nombre"
              value={placeData.Nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción</label>
            <textarea
              name="Descripcion"
              value={placeData.Descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tipo</label>
            <select
              name="Tipo"
              value={placeData.Tipo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurante">Restaurante</option>
              <option value="Atracción">Atracción</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Latitud</label>
            <input
              type="text"
              name="Latitud"
              value={placeData.Latitud}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Longitud</label>
            <input
              type="text"
              name="Longitud"
              value={placeData.Longitud}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Imagen</label>
            <input
              type="file"
              name="URLImagen"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Agregando...' : 'Agregar Lugar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;
