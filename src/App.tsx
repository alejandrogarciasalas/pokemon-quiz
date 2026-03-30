import { useState, useEffect } from 'react';
import { gen1Pokemon, type Pokemon } from './pokemon';
import './App.css';

function App() {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Get a random Pokemon
  const getRandomPokemon = () => {
    const randomIndex = Math.floor(Math.random() * gen1Pokemon.length);
    return gen1Pokemon[randomIndex];
  };

  // Start with a random Pokemon
  useEffect(() => {
    setCurrentPokemon(getRandomPokemon());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPokemon || !guess.trim()) return;

    const normalizedGuess = guess.trim().toLowerCase().replace(/[^a-z]/g, '');
    const normalizedName = currentPokemon.name.toLowerCase().replace(/[^a-z]/g, '');

    if (normalizedGuess === normalizedName) {
      setFeedback('correct');
      setScore(score + 1);
      setTotal(total + 1);
      
      // Auto-advance to next Pokemon after 1 second
      setTimeout(() => {
        nextPokemon();
      }, 1000);
    } else {
      setFeedback('wrong');
      setTotal(total + 1);
      setShowAnswer(true);
    }
  };

  const nextPokemon = () => {
    setCurrentPokemon(getRandomPokemon());
    setGuess('');
    setFeedback(null);
    setShowAnswer(false);
  };

  const resetGame = () => {
    setScore(0);
    setTotal(0);
    setGuess('');
    setFeedback(null);
    setShowAnswer(false);
    setCurrentPokemon(getRandomPokemon());
  };

  if (!currentPokemon) return <div>Loading...</div>;

  return (
    <div className="app">
      <header>
        <h1>🎮 Pokémon Quiz</h1>
        <div className="score">
          Score: {score} / {total}
          {total > 0 && (
            <span className="percentage">
              {' '}({Math.round((score / total) * 100)}%)
            </span>
          )}
        </div>
      </header>

      <main>
        <div className={`pokemon-card ${feedback || ''}`}>
          <div className="pokemon-image">
            <img 
              src={currentPokemon.imageUrl} 
              alt="Who's that Pokémon?" 
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-size="16" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          <div className="pokemon-number">#{currentPokemon.id.toString().padStart(3, '0')}</div>

          {showAnswer && (
            <div className="answer-reveal">
              <p className="answer-label">The answer was:</p>
              <p className="answer-name">{currentPokemon.name}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="guess-form">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type the Pokémon's name..."
            disabled={feedback === 'correct' || showAnswer}
            autoFocus
            autoComplete="off"
          />
          
          <div className="button-group">
            {!showAnswer && feedback !== 'correct' && (
              <button type="submit" disabled={!guess.trim()}>
                Submit
              </button>
            )}
            
            {(showAnswer || feedback === 'correct') && (
              <button type="button" onClick={nextPokemon} className="next-btn">
                Next Pokémon →
              </button>
            )}
          </div>
        </form>

        {feedback === 'correct' && (
          <div className="feedback correct">✓ Correct!</div>
        )}
        {feedback === 'wrong' && (
          <div className="feedback wrong">✗ Wrong!</div>
        )}

        <button className="reset-btn" onClick={resetGame}>
          Reset Game
        </button>
      </main>

      <footer>
        <p>Gen 1 Pokémon (1-151) • Images from Bulbapedia</p>
      </footer>
    </div>
  );
}

export default App;
