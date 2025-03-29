import { useState, useEffect } from "react";

const App = () => {
  const [messages, SetMessages] = useState(null);
  const [value, SetValue] = useState("");
  const [previousChat, SetPreviousChat] = useState([]);
  const [currentTitle, SetCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  const createNewChat = () => {
    SetMessages(null);
    SetValue("");
    SetCurrentTitle(null);
  };

  const clickHandler = (title) => {
    SetCurrentTitle(title);
    SetMessages(null);
    SetValue("");
  };

  const getMessages = async () => {
    setLoading(true); // Show loader
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: value,
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 50 },
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/generate-content",
        options
      );
      const data = await response.json();
      SetMessages(data);
    } catch (err) {
      console.log("Error in fetching data in frontend", err);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    if (!currentTitle && value && messages) {
      SetCurrentTitle(value);
    }
    if (currentTitle && value && messages) {
      SetPreviousChat((prev) => [
        ...prev,
        { title: currentTitle, role: "You", chat: value },
        { title: currentTitle, role: "assistance", chat: messages },
      ]);
    }
  }, [messages, currentTitle]);

  const currentChats = previousChat.filter(
    (chat) => chat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChat.map((chat) => chat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles.map((title, ind) => (
            <li key={ind} onClick={() => clickHandler(title)}>
              {title}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made By DeepMind</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>DeepMind</h1>}
        <ul className="feed">
          {currentChats?.map((chat, ind) => (
            <li key={ind}>
              <p className="role">{chat.role}</p>
              <p>{chat.chat}</p>
            </li>
          ))}
        </ul>
        {loading && <p className="loader"></p>} 
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => SetValue(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && getMessages()} />
            <div
              className={`submit ${loading ? "loading" : ""}`}
              onClick={getMessages}
            >
              {loading ? <div></div> : "➤"}
            </div>
          </div>
          <p className="info">
            DeepMind is an AI research company known for breakthroughs in deep
            learning, reinforcement learning, and AlphaGo, revolutionizing
            artificial intelligence advancements.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
