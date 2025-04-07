import React, { useState } from 'react';

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [veganOnly, setVeganOnly] = useState(false);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  const handleSearch = async () => {
    if (!ingredients) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("ingredients", ingredients);
      if (veganOnly) params.append("vegan", "true");
      if (vegetarianOnly) params.append("vegetarian", "true");

      const res = await fetch(`https://ai-chef-api.onrender.com/api/recipes?${params.toString()}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>AI Chef 🍳</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter ingredients (e.g. tomato, rice)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          <label>
            <input
              type="checkbox"
              checked={veganOnly}
              onChange={(e) => setVeganOnly(e.target.checked)}
            /> Vegan Only
          </label>
          <label>
            <input
              type="checkbox"
              checked={vegetarianOnly}
              onChange={(e) => setVegetarianOnly(e.target.checked)}
            /> Vegetarian Only
          </label>
        </div>
        <button onClick={handleSearch} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Searching...' : 'Find Recipes'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {recipes.map((recipe, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h2>{recipe.title} {recipe.flag}</h2>
            <p>⏱️ Time: {recipe.time}</p>
            <p>🔥 Difficulty: {recipe.difficulty}</p>
            <p>⚡ Calories: {recipe.calories}</p>
            <p>🌍 Country: {recipe.country}</p>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#999' }}>
        Developed by Max BRUNS
      </footer>
    </div>
  );
}
