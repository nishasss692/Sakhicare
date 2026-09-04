import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  MessageSquare, 
  RotateCcw, 
  Heart, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['craving', 'sugar', 'sweets', 'afternoon', 'hunger', 'snack'],
    question: 'Why do I crave sugar in the afternoon (3–4 PM)?',
    answer: `Afternoon sugar cravings in women with PCOS are usually not a lack of willpower—they are a physiological symptom of reactive hypoglycemia caused by hyperinsulinemia.
    
When a high-glycemic breakfast or lunch is consumed, the pancreas overproduces insulin. A few hours later, circulating blood glucose plummets rapidly, triggering your brain to demand fast sugar (sweets/pastries) for survival.

💡 **Actionable Strategy:**
1. Ensure your lunch contains at least 30g of protein (chicken, salmon, tofu, eggs) and 10g of fiber.
2. Add 1 tablespoon of apple cider vinegar in water before meals to slow glucose absorption.
3. If cravings hit, consume a handful of raw walnuts with 85% dark chocolate or hot spearmint tea with cinnamon.`
  },
  {
    keywords: ['workout', 'exercise', 'cortisol', 'hiit', 'weights', 'gym', 'cardio'],
    question: 'What workouts are best for PCOS, and does HIIT spike cortisol?',
    answer: `For PCOS, the golden standard is progressive resistance (strength) training combined with low-intensity steady-state (LISS) cardio, such as brisk walking.

Excessive high-intensity interval training (HIIT) or prolonged intense endurance cardio can elevate adrenal cortisol. In women with adrenal or inflammatory PCOS, high cortisol signals the ovaries and adrenals to produce additional androgens (testosterone and DHEA-S).

💡 **Best Exercise Protocol:**
• **Strength Training (3–4x weekly):** Builds lean muscle mass, directly activating GLUT4 glucose transporters and clearing blood sugar without relying heavily on insulin.
• **Zone 2 Walking (7,000–10,000 steps daily):** Ideal for metabolic health and nervous system calming.
• **Pilates & Yoga:** Excellent for pelvic blood flow and parasympathetic nervous system tone.`
  },
  {
    keywords: ['inositol', 'supplement', 'myo', 'd-chiro', 'ovulation', 'supplementation'],
    question: 'How does Myo-Inositol work and what is the optimal 40:1 ratio?',
    answer: `Myo-Inositol and D-Chiro-Inositol are vitamin-like secondary messengers that mediate cellular insulin signaling and Follicle-Stimulating Hormone (FSH) pathways in the ovaries.

In women with PCOS, intracellular inositol metabolism is frequently defective. Clinical studies have shown that supplementing with a **40:1 ratio of Myo-Inositol to D-Chiro-Inositol** (typically 2,000mg Myo + 50mg D-Chiro twice daily) yields remarkable benefits:
• Restores spontaneous ovulation in up to 65% of anovulatory women.
• Improves oocyte (egg) quality and reduces miscarriage rates.
• Decreases LH/FSH ratio and serum testosterone levels.
• Regulates menstrual cycle length within 3 to 6 months.`
  },
  {
    keywords: ['spearmint', 'tea', 'hair', 'hirsutism', 'facial', 'beard', 'chin'],
    question: 'Is spearmint tea scientifically proven for facial hair (hirsutism)?',
    answer: `Yes! Two published randomized clinical trials demonstrated that drinking **organic spearmint tea (Mentha spicata)** twice daily significantly reduced circulating free testosterone levels and subjective hirsutism in women with PCOS.

💡 **How to brew for maximum potency:**
• Steep 1 organic spearmint tea bag or 1 tsp dried loose leaves in boiling water for 8–10 minutes with a lid (to prevent essential oils from evaporating).
• Consume 2 cups daily for at least 30 consecutive days. Many women notice reduced hair coarseness and slower regrowth within 6–12 weeks.`
  },
  {
    keywords: ['lean', 'thin', 'skinny', 'phenotype', 'lean pcos'],
    question: 'Can I have PCOS if my BMI is normal or low (Lean PCOS)?',
    answer: `Yes, absolutely. Approximately 20–30% of women diagnosed with PCOS have normal or low body mass index (BMI < 23). This is termed **Lean PCOS** or often **Adrenal/Inflammatory PCOS**.

Key characteristics of Lean PCOS:
• Often driven by elevated **DHEA-S** from the adrenal glands (stress response) rather than pancreatic insulin resistance alone.
• May still exhibit visceral insulin resistance (normal weight but fatty infiltration around liver/organs).
• Prone to gut permeability (dysbiosis) and systemic low-grade inflammation.

💡 **Targeted Approach:** Focus on nervous system regulation, adaptogens (Ashwagandha/Rhodiola under medical guidance), nutrient-dense whole foods, and sleep hygiene rather than caloric restriction.`
  },
  {
    keywords: ['acne', 'pimples', 'skin', 'breakouts', 'jawline', 'cystic'],
    question: 'Why does PCOS cause persistent jawline and cystic acne?',
    answer: `PCOS-related acne is primarily driven by elevated androgens (especially Dihydrotestosterone or DHT) stimulating sebaceous glands in the lower third of the face (jawline, chin, and neck) to produce thick, sticky sebum.

Furthermore, hyperinsulinemia raises **IGF-1 (Insulin-like Growth Factor 1)**, which hyperkeratinizes pore linings, trapping bacteria.

💡 **Proven Interventions:**
• Eliminate dairy milk for 30 days (dairy contains bovine IGF-1 and hormonal precursors).
• Supplement with Zinc Picolinate (30mg daily) to inhibit 5-alpha reductase.
• Balance blood sugar so insulin surges don't activate sebum production.`
  }
];

export default function AskSakhiWidget() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello, I'm **Sakhi**, your dedicated PCOS & reproductive health companion! 🌸\n\nHow can I help you today? You can ask me about nutrition, hormonal phases, supplements (like inositol or spearmint), workouts, or click any of the frequent questions below.`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const findAnswer = (query) => {
    const q = query.toLowerCase();
    
    // Look for best keyword match
    let bestMatch = null;
    let maxHits = 0;

    for (const item of KNOWLEDGE_BASE) {
      let hits = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) hits++;
      }
      if (hits > maxHits) {
        maxHits = hits;
        bestMatch = item;
      }
    }

    if (bestMatch && maxHits > 0) {
      return bestMatch.answer;
    }

    return `Thank you for asking about "${query}". 

While each person's hormonal biochemistry is unique, general clinical guidelines for PCOS emphasize:
1. **Insulin Balance:** Combining every carbohydrate with high-fiber greens and clean protein.
2. **Anti-Androgenic Support:** Drinking spearmint tea and evaluating Inositol (40:1 ratio) with your healthcare provider.
3. **Restorative Movement:** Prioritizing resistance training and daily walking over exhausting high-intensity cardio.

Would you like to explore specific guidance on **diet**, **supplements**, **exercise**, or **acne**?`;
  };

  const handleSend = (textToSend = null) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate conversational response delay
    setTimeout(() => {
      const botAnswer = findAnswer(query);
      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }]);
      setIsTyping(false);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: `Chat reset. Ask me anything regarding your symptoms, cycle, or PCOS wellness strategies! 🌸`
      }
    ]);
  };

  return (
    <div className="ask-sakhi-container">
      {/* Header */}
      <div className="ask-sakhi-header">
        <div className="ask-title-wrap">
          <div className="ask-icon-badge">
            <Bot size={24} color="#D94676" />
          </div>
          <div>
            <h3 className="widget-title">Ask Sakhi • AI Hormone Health Companion</h3>
            <p className="widget-subtitle">
              Get grounded, evidence-based answers to your questions about PCOS symptoms, lab tests, supplements, and lifestyle.
            </p>
          </div>
        </div>

        <button className="chat-reset-btn" onClick={handleResetChat} title="Reset chat history">
          <RotateCcw size={15} />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="suggested-prompts-bar">
        <span className="prompts-label">
          <Lightbulb size={15} color="var(--primary)" />
          Popular Questions:
        </span>
        <div className="prompts-list">
          {KNOWLEDGE_BASE.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="prompt-pill-btn"
              onClick={() => handleSend(item.question)}
            >
              {item.question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="chat-messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
            <div className={`chat-avatar ${msg.sender === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={18} color="white" />}
            </div>
            <div className={`chat-bubble-content ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble-row bot-row">
            <div className="chat-avatar bot-avatar">
              <Bot size={18} color="white" />
            </div>
            <div className="chat-bubble-content bot-bubble typing-bubble">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form 
        className="chat-input-form" 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="chat-text-input"
          placeholder="Ask Sakhi anything (e.g. 'Can I eat fruits with PCOS?', 'How to lower DHEA-S?')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="chat-send-btn" 
          disabled={!inputQuery.trim() || isTyping}
        >
          <Send size={16} />
          <span>Ask</span>
        </button>
      </form>

      {/* Medical Disclaimer Note */}
      <div className="chat-disclaimer">
        <AlertCircle size={14} color="var(--text-subtle)" />
        <span>
          Sakhi is an informational AI health companion. For prescription changes or medical diagnoses, always consult your physician.
        </span>
      </div>
    </div>
  );
}
