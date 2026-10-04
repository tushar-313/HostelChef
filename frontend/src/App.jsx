import React, { useState } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import PreferencesInput from './components/PreferencesInput';

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('15 minutes');
  const [selectedEquipment, setSelectedEquipment] = useState(['Electric Kettle', 'Induction Cooktop']);
  const [dietaryPreference, setDietaryPreference] = useState('Any / No restriction');
  const [inputError, setInputError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCook = () => {
    if (!ingredients.trim()) {
      setInputError('Please enter at least 1 or 2 ingredients you have in your room!');
      return;
    }
    setInputError('');
    // Placeholder trigger for backend connection
    console.log({
      ingredients,
      cookingTime,
      selectedEquipment,
      dietaryPreference,
    });
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between">
      <div className="container mx-auto px-4 max-w-2xl pb-16">
        <Header />
        <main className="mt-4">
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
        </main>
      </div>
      <footer className="py-6 text-center text-sm text-gray-400">
        HostelChef &bull; Practical AI meal assistant for students
      </footer>
    </div>
  );
}
