// src/lib/n8n.ts

// 🚨 REPLACE with your actual Production URLs from n8n (Webhook Node -> Production URL tab)
const N8N_URLS = {
    ingest: "http://localhost:5678/webhook-test/ingest-book", 
    tutor: "http://localhost:5678/webhook-test/ai-tutor" 
  };
  
  export const ingestBook = async (bookId: string, fileUrl: string, userId: string) => {
    try {
      // "no-cors" mode is often needed for localhost to n8n direct calls
      // If this fails, we can try a standard POST.
      await fetch(N8N_URLS.ingest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, fileUrl, userId }),
      });
      return true;
    } catch (error) {
      console.error("Failed to trigger n8n ingestion:", error);
      return false;
    }
  };
  
  export const askAiTutor = async (bookId: string, query: string, userId: string) => {
    try {
      // Call our internal Next.js API route instead of n8n directly
      const response = await fetch("/api/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, query, userId }),
      });
  
      if (!response.ok) throw new Error("AI Tutor failed to respond");
      
      return await response.json();
    } catch (error) {
      console.error("AI Error:", error);
      return { reply: "I'm having trouble connecting. Please ensure n8n is running!" };
    }
  };