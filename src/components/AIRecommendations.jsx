import { useState } from "react";
import axios from "axios";

function AIRecommendations() {
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!prompt.trim()) {
      setRecommendations("Please enter your movie mood or genre.");
      return;
    }

    try {
      setLoading(true);
      setRecommendations("");

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        setRecommendations("Gemini API key missing. Check your .env file.");
        return;
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Recommend 5 movies for this mood/genre: ${prompt}. 
Give answer like:
1. Movie Name — one short reason
2. Movie Name — one short reason
3. Movie Name — one short reason
4. Movie Name — one short reason
5. Movie Name — one short reason`,
                },
              ],
            },
          ],
        }
      );

      const text =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No recommendations found.";

      setRecommendations(text);
    } catch (error) {
      console.log("Gemini Full Error:", error.response?.data || error.message);

      setRecommendations(
        error.response?.data?.error?.message ||
          "Something went wrong. Please check Gemini key."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-section">
      <h2>AI Movie Recommendations 🤖</h2>
      <p>Tell StreamFlix your mood and get movie suggestions instantly.</p>

      <div className="ai-box">
        <input
          type="text"
          placeholder="Example: emotional sci-fi, romantic comedy, action thriller..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") getRecommendations();
          }}
        />

        <button onClick={getRecommendations} disabled={loading}>
          {loading ? "Thinking..." : "Recommend"}
        </button>
      </div>

      {recommendations && (
        <div className="ai-results">
          <pre>{recommendations}</pre>
        </div>
      )}
    </section>
  );
}

export default AIRecommendations;