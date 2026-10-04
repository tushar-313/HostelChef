import React, { useState } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import PreferencesInput from './components/PreferencesInput';
import RecipeCard from './components/RecipeCard';
import LoadingState from './components/LoadingState';
import ErrorAlert from './components/ErrorAlert';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('15 minutes');
  const [selectedEquipment, setSelectedEquipment] = useState(['Electric Kettle', 'Induction Cooktop']);
  const [dietaryPreference, setDietaryPreference] = useState('Any / No restriction');
  
  const [inputError, setInputError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipe, setRecipe] = useState(null);

  const handleCook = async () => {
    if (!ingredients.trim()) {
      setInputError('Please enter at least 1 or 2 ingredients you have in your room!');
      return;
    }
    setInputError('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          time_limit: cookingTime,
          equipment: selectedEquipment,
          dietary_preference: dietaryPreference,
        }),
      });

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errData = await response.json();
          errorDetail = errData.detail;
        } catch {
          // ignore parsing error
        }

        if (response.status === 503 || !errorDetail) {
          throw new Error("Couldn't reach the local AI. Make sure Ollama and Gemma 4 are running.");
        }
        throw new Error(errorDetail);
      }

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMessage("Couldn't reach the local AI. Make sure Ollama and Gemma 4 are running.");
      } else {
        setErrorMessage(err.message || "Couldn't reach the local AI. Make sure Ollama and Gemma 4 are running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRecipe(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between">
      <div className="container mx-auto px-4 max-w-2xl pb-16">
        <Header />

        <main className="mt-4 space-y-4">
          {errorMessage && (
            <ErrorAlert
              message={errorMessage}
              onDismiss={() => setErrorMessage('')}
              onRetry={handleCook}
            />
          )}

          {isLoading ? (
            <LoadingState />
          ) : recipe ? (
            <RecipeCard recipe={recipe} onReset={handleReset} />
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100/80">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">What's in your kitchen?</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Tell us what you found in your drawer, fridge, or bag.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCook(); }} className="space-y-6">
                <IngredientInput
                  ingredients={ingredients}
                  setIngredients={(val) => {
                    setIngredients(val);
                    if (inputError) setInputError('');
                  }}
                  error={inputError}
                />

                <PreferencesInput
                  cookingTime={cookingTime}
                  setCookingTime={setCookingTime}
                  selectedEquipment={selectedEquipment}
                  setSelectedEquipment={setSelectedEquipment}
                  dietaryPreference={dietaryPreference}
                  setDietaryPreference={setDietaryPreference}
                  onSubmit={handleCook}
                  isLoading={isLoading}
                />
              </form>
            </div>
          )}
        </main>
      </div>

      <footer className="py-6 text-center text-sm text-gray-400">
        HostelChef &bull; Powered by Gemma 4 12B &amp; FastAPI
      </footer>
    </div>
  );
}
