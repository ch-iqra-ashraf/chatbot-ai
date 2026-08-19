import React, { useState } from "react";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");

    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: updatedMessages
          }),
        },
      );

      const data = await response.json();
      const reply = data.choices[0].message.content;

      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Error getting response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f9] p-4 font-sans">
      {/* Chat Container Window */}
      <div className="flex h-137.5 w-87.5 flex-col overflow-hidden rounded-3xl border border-[#e1ecf7] bg-[#f4f8ff] shadow-xs">
        {/* Header Avatar Section */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="flex h-15 w-15 items-center justify-center rounded-full bg-linear-to-b from-[#e9f3ff] to-[#d3e7ff] shadow-inner">
            <svg viewBox="0 0 24 24" className="h-9 w-9 fill-[#1e88e5]">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>
        </div>

        {/* Message Feed Streams */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-white text-[#1a1a1a] shadow-xs"
                    : "rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-[#1e88e5] text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing Overlay Placeholder */}
          {isLoading && (
            <div className="flex w-full justify-end">
              <div className="max-w-[75%] rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-[#1e88e5] opacity-70 px-4 py-3 text-sm text-white animate-pulse">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Box Area Form */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 p-4 bg-[#f4f8ff]"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-full border border-[#e2eaf4] bg-white px-4 py-3 text-sm text-[#333] placeholder-[#a0abba] outline-hidden focus:border-[#1e88e5] disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e88e5] text-white transition-colors hover:bg-[#1565c0] disabled:bg-[#b0d4f5] disabled:cursor-not-allowed"
          >
            ➔
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
