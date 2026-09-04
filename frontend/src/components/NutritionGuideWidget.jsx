import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  Apple, 
  Fish, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Coffee,
  HeartPulse,
  Leaf
} from 'lucide-react';

const SUPERFOODS = [
  {
    name: 'Organic Spearmint',
    type: 'Anti-Androgen',
    color: '#0D9488',
    benefit: 'Clinically shown in randomized trials to significantly reduce free testosterone and mild hirsutism in women with PCOS.',
    tip: 'Brew 1–2 fresh cups daily after meals.'
  },
  {
    name: 'Ceylon Cinnamon',
    type: 'Insulin Sensitizer',
    color: '#D97706',
    benefit: 'Mimics insulin action and facilitates glucose uptake into cells, smoothing postprandial glucose curves.',
    tip: 'Add 1/2 tsp to morning chia pudding or oatmeal.'
  },
  {
    name: 'Wild Salmon & Mackerel',
    type: 'Anti-Inflammatory',
    color: '#E11D48',
    benefit: 'High in EPA & DHA Omega-3s that calm chronic low-grade ovarian inflammation and lower triglycerides.',
    tip: 'Aim for 2–3 servings weekly.'
  },
  {
    name: 'Ground Flaxseeds',
    type: 'Estrogen Clearance',
    color: '#8B5CF6',
    benefit: 'Rich in dietary lignans that increase Sex Hormone Binding Globulin (SHBG), lowering unbound circulating androgens.',
    tip: 'Consume 1–2 tablespoons freshly ground daily.'
  },
  {
    name: 'Pumpkin & Sesame Seeds',
    type: 'Zinc & Progesterone',
    color: '#059669',
    benefit: 'High in bioavailable zinc, which naturally inhibits the 5-alpha reductase enzyme responsible for DHT acne and hair loss.',
    tip: 'Great for seed cycling during follicular & luteal phases.'
  },
  {
    name: 'Cruciferous Greens (Broccoli, Kale)',
    type: 'Liver Detoxification',
    color: '#16A34A',
    benefit: 'Contain Indole-3-Carbinol (I3C) and Diindolylmethane (DIM) that assist Phase 2 liver metabolism of estrogens.',
    tip: 'Lightly steam or saute with olive oil for optimal nutrient absorption.'
  }
];

const SMART_SWAPS = [
  {
    insteadOf: 'White Bagel / Sugary Cereal',
    swapTo: 'Eggs with Avocado & Sourdough / Chia Seed Bowl',
    reason: 'Prevents the morning 8:00 AM insulin spike that triggers ovarian androgen release all day long.'
  },
  {
    insteadOf: 'Regular White Pasta',
    swapTo: 'Chickpea / Edamame / Lentil Pasta',
    reason: 'Provides 22g protein & 14g prebiotic fiber per serving with less than half the glycemic response.'
  },
  {
    insteadOf: 'Sugary Vanilla Latte / Energy Drink',
    swapTo: 'Iced Spearmint Tea or Matcha with Almond Milk',
    reason: 'Zero sugar crash, powerful polyphenols, and proven testosterone-lowering properties.'
  },
  {
    insteadOf: 'Milk Chocolate / Candy Bars',
    swapTo: '85% Dark Chocolate with Almonds or Pumpkin Seeds',
    reason: 'Rich in magnesium and polyphenol antioxidants without precipitating an insulin spike.'
  },
  {
    insteadOf: 'Industrial Seed Oils (Soybean/Corn/Canola)',
    swapTo: 'Extra Virgin Olive Oil / Avocado Oil / Ghee',
    reason: 'Avoids excessive omega-6 pro-inflammatory pathways that exacerbate PCOS ovarian cysts.'
  }
];

const SAMPLE_DAY = [
  {
    meal: 'Nourishing Breakfast',
    time: '8:00 AM',
    title: 'Savory High-Protein Omelet',
    items: '2 pasture-raised eggs, baby spinach, avocado slices, side of fermented kimchi, and 1 cup hot spearmint tea.',
    protein: '24g protein',
    fiber: '8g fiber'
  },
  {
    meal: 'Balanced Lunch',
    time: '12:30 PM',
    title: 'Mediterranean Salmon & Quinoa Bowl',
    items: 'Grilled wild salmon, fluffy quinoa, cucumbers, kalamata olives, arugula, and extra virgin olive oil vinaigrette.',
    protein: '32g protein',
    fiber: '9g fiber'
  },
  {
    meal: 'Hormone-Smart Snack',
    time: '4:00 PM',
    title: 'Blood-Sugar Balancing Crunch',
    items: 'Handful of raw walnuts, 1 tbsp roasted pumpkin seeds, and 1/2 cup fresh raspberries or blackberries.',
    protein: '7g protein',
    fiber: '6g fiber'
  },
  {
    meal: 'Anti-Inflammatory Dinner',
    time: '7:00 PM',
    title: 'Turmeric Ginger Chicken & Roasted Veggies',
    items: 'Baked turmeric herb chicken breast, roasted broccoli florets, zucchini noodles, and small sweet potato wedge.',
    protein: '35g protein',
    fiber: '10g fiber'
  }
];

export default function NutritionGuideWidget() {
  const [activeTab, setActiveTab] = useState('plate'); // 'plate' | 'superfoods' | 'swaps' | 'mealplan'
  const [selectedSuperfoodFilter, setSelectedSuperfoodFilter] = useState('ALL');

  const filteredSuperfoods = selectedSuperfoodFilter === 'ALL'
    ? SUPERFOODS
    : SUPERFOODS.filter(s => s.type.toLowerCase().includes(selectedSuperfoodFilter.toLowerCase()));

  return (
    <div className="nutrition-guide-container">
      {/* Top Banner */}
      <div className="nutrition-top-header">
        <div className="nutri-title-wrap">
          <div className="nutri-icon-badge">
            <Utensils size={24} color="#059669" />
          </div>
          <div>
            <h3 className="widget-title">Anti-Inflammatory & Low-GI Nutrition Guide</h3>
            <p className="widget-subtitle">
              PCOS nutrition is not about restriction—it's about fueling insulin sensitivity, stabilizing blood sugar, and clearing excess androgens.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="nutri-nav-tabs">
          <button 
            type="button" 
            className={`nutri-nav-btn ${activeTab === 'plate' ? 'active' : ''}`}
            onClick={() => setActiveTab('plate')}
          >
            🍽️ Balanced Plate
          </button>
          <button 
            type="button" 
            className={`nutri-nav-btn ${activeTab === 'superfoods' ? 'active' : ''}`}
            onClick={() => setActiveTab('superfoods')}
          >
            🌿 Superfoods Matrix
          </button>
          <button 
            type="button" 
            className={`nutri-nav-btn ${activeTab === 'swaps' ? 'active' : ''}`}
            onClick={() => setActiveTab('swaps')}
          >
            🔄 Smart Swaps
          </button>
          <button 
            type="button" 
            className={`nutri-nav-btn ${activeTab === 'mealplan' ? 'active' : ''}`}
            onClick={() => setActiveTab('mealplan')}
          >
            📋 Daily Hormone Plan
          </button>
        </div>
      </div>

      {/* TAB 1: Balanced Plate Visualizer */}
      {activeTab === 'plate' && (
        <div className="plate-tab-view">
          <div className="plate-hero-card">
            <div className="plate-graphic-wrap">
              {/* Circular SVG Plate */}
              <svg viewBox="0 0 300 300" className="plate-svg">
                {/* Plate outer rim */}
                <circle cx="150" cy="150" r="140" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="8" />
                <circle cx="150" cy="150" r="130" fill="#F8FAFC" />

                {/* 50% Left Side: Veggies & Fiber (Green) */}
                <path d="M 150 20 A 130 130 0 0 0 150 280 Z" fill="rgba(16, 185, 129, 0.22)" stroke="#10B981" strokeWidth="3" />

                {/* 25% Top Right: Clean Protein (Rose) */}
                <path d="M 150 20 A 130 130 0 0 1 280 150 L 150 150 Z" fill="rgba(244, 63, 94, 0.22)" stroke="#F43F5E" strokeWidth="3" />

                {/* 25% Bottom Right: Low-GI Slow Carbs (Amber) */}
                <path d="M 280 150 A 130 130 0 0 1 150 280 L 150 150 Z" fill="rgba(245, 158, 11, 0.22)" stroke="#F59E0B" strokeWidth="3" />

                {/* Center Core: Healthy Fats (Teal) */}
                <circle cx="150" cy="150" r="32" fill="#FFFFFF" stroke="#0D9488" strokeWidth="3" />
                <text x="150" y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F766E">HEALTHY</text>
                <text x="150" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F766E">FATS</text>

                {/* Section labels */}
                <text x="85" y="155" textAnchor="middle" fontSize="13" fontWeight="800" fill="#065F46">50% FIBER</text>
                <text x="85" y="172" textAnchor="middle" fontSize="10" fill="#047857">&amp; Greens</text>

                <text x="210" y="90" textAnchor="middle" fontSize="12" fontWeight="800" fill="#9F1239">25% PROTEIN</text>
                <text x="210" y="105" textAnchor="middle" fontSize="10" fill="#BE123C">Clean &amp; Lean</text>

                <text x="210" y="210" textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400E">25% CARBS</text>
                <text x="210" y="225" textAnchor="middle" fontSize="10" fill="#B45309">Low-GI &amp; Whole</text>
              </svg>
            </div>

            <div className="plate-guidance-content">
              <h4 className="guidance-heading">The PCOS Blood Sugar Balancing Formula</h4>
              <p className="guidance-intro">
                Insulin spikes are the primary driver of excess ovarian testosterone synthesis in women with PCOS. Building your plate in this exact ratio prevents glucose spikes while nourishing your hormones.
              </p>

              <div className="plate-breakdown-list">
                <div className="plate-item-row" style={{ borderLeftColor: '#10B981' }}>
                  <strong>50% High-Fiber Vegetables:</strong>
                  <span>Broccoli, cauliflower, spinach, asparagus, peppers, cucumbers, and fermented cabbage. Slows stomach emptying.</span>
                </div>
                <div className="plate-item-row" style={{ borderLeftColor: '#F43F5E' }}>
                  <strong>25% High-Quality Clean Protein (25–35g per meal):</strong>
                  <span>Wild salmon, organic chicken, pasture-raised eggs, organic tofu, tempeh, lentils. Promotes satiety hormone PYY.</span>
                </div>
                <div className="plate-item-row" style={{ borderLeftColor: '#F59E0B' }}>
                  <strong>25% Low-GI Complex Carbs:</strong>
                  <span>Quinoa, sweet potatoes, chickpeas, berries, steel-cut oats. Provides continuous cellular energy without insulin peaks.</span>
                </div>
                <div className="plate-item-row" style={{ borderLeftColor: '#0D9488' }}>
                  <strong>Essential Healthy Fats:</strong>
                  <span>Avocado, extra virgin olive oil, chia seeds, pumpkin seeds. Essential building blocks for progesterone production.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Superfoods Matrix */}
      {activeTab === 'superfoods' && (
        <div className="superfoods-tab-view">
          <div className="superfoods-filter-pills">
            {['ALL', 'Androgen', 'Insulin', 'Inflammatory', 'Estrogen', 'Zinc'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`filter-pill-btn ${selectedSuperfoodFilter === cat ? 'active' : ''}`}
                onClick={() => setSelectedSuperfoodFilter(cat)}
              >
                {cat === 'ALL' ? 'All PCOS Superfoods' : `${cat} Focus`}
              </button>
            ))}
          </div>

          <div className="superfoods-grid">
            {filteredSuperfoods.map((food, i) => (
              <div key={i} className="superfood-card">
                <div className="superfood-top">
                  <span className="superfood-pill" style={{ color: food.color, borderColor: food.color }}>
                    {food.type}
                  </span>
                  <Leaf size={18} color={food.color} />
                </div>
                <h4 className="superfood-name">{food.name}</h4>
                <p className="superfood-desc">{food.benefit}</p>
                <div className="superfood-tip">
                  <strong>How to use:</strong> {food.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Smart Swaps */}
      {activeTab === 'swaps' && (
        <div className="swaps-tab-view">
          <div className="swaps-list">
            {SMART_SWAPS.map((swap, idx) => (
              <div key={idx} className="swap-card">
                <div className="swap-sides-container">
                  <div className="swap-before">
                    <span className="swap-badge alert">Avoid / Limit</span>
                    <h5 className="swap-item-title">{swap.insteadOf}</h5>
                  </div>
                  <div className="swap-arrow-wrap">
                    <ArrowRight size={20} color="var(--primary)" />
                  </div>
                  <div className="swap-after">
                    <span className="swap-badge good">Hormone-Smart Choice</span>
                    <h5 className="swap-item-title">{swap.swapTo}</h5>
                  </div>
                </div>
                <div className="swap-reason-box">
                  <Sparkles size={16} color="var(--primary)" />
                  <span><strong>Clinical Rationale:</strong> {swap.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Daily Meal Plan */}
      {activeTab === 'mealplan' && (
        <div className="mealplan-tab-view">
          <div className="mealplan-timeline">
            {SAMPLE_DAY.map((item, idx) => (
              <div key={idx} className="meal-timeline-node">
                <div className="meal-time-indicator">
                  <span className="meal-time-badge">{item.time}</span>
                  <span className="meal-name-tag">{item.meal}</span>
                </div>
                <div className="meal-content-box">
                  <h4 className="meal-dish-title">{item.title}</h4>
                  <p className="meal-ingredients">{item.items}</p>
                  <div className="meal-macros-row">
                    <span className="macro-tag protein">{item.protein}</span>
                    <span className="macro-tag fiber">{item.fiber}</span>
                    <span className="macro-tag low-gi">Low Glycemic Index</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
