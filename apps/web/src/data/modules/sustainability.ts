// Sustainability Module Data
// Carbon footprint, eco-living, and environmental impact

export const CARBON_FOOTPRINT = {
  categories: [
    {
      name: "Transportation",
      unit: "kg CO2e/day",
      factors: [
        { activity: "Car (gasoline, average)", emission: 0.21, per: "mile" },
        { activity: "Car (electric, avg grid)", emission: 0.05, per: "mile" },
        { activity: "Bus", emission: 0.10, per: "mile" },
        { activity: "Train", emission: 0.04, per: "mile" },
        { activity: "Bicycle", emission: 0.0, per: "mile" },
        { activity: "Flight (short haul)", emission: 0.255, per: "mile" },
        { activity: "Flight (long haul)", emission: 0.195, per: "mile" }
      ],
      tips: [
        "Walk or bike for short trips",
        "Use public transportation",
        "Carpool when possible",
        "Consider electric vehicle",
        "Work from home when possible",
        "Combine errands into one trip",
        "Keep vehicle maintained"
      ]
    },
    {
      name: "Energy",
      unit: "kg CO2e/day",
      factors: [
        { activity: "Electricity (US average)", emission: 0.42, per: "kWh" },
        { activity: "Natural gas heating", emission: 0.18, per: "therm" },
        { activity: "Heating oil", emission: 2.3, per: "gallon" },
        { activity: "Propane", emission: 1.5, per: "gallon" }
      ],
      tips: [
        "Switch to LED bulbs",
        "Use programmable thermostat",
        "Improve insulation",
        "Unplug electronics when not in use",
        "Use energy-efficient appliances",
        "Install solar panels if possible",
        "Choose renewable energy provider"
      ]
    },
    {
      name: "Food",
      unit: "kg CO2e/day",
      factors: [
        { activity: "Beef (conventional)", emission: 27.0, per: "lb" },
        { activity: "Lamb", emission: 22.0, per: "lb" },
        { activity: "Cheese", emission: 11.0, per: "lb" },
        { activity: "Pork", emission: 7.0, per: "lb" },
        { activity: "Poultry", emission: 4.0, per: "lb" },
        { activity: "Fish (farmed)", emission: 4.5, per: "lb" },
        { activity: "Eggs", emission: 3.0, per: "lb" },
        { activity: "Legumes", emission: 0.8, per: "lb" },
        { activity: "Vegetables", emission: 0.5, per: "lb" },
        { activity: "Fruits", emission: 0.4, per: "lb" }
      ],
      tips: [
        "Eat more plant-based meals",
        "Choose local and seasonal",
        "Reduce food waste",
        "Compost organic waste",
        "Grow own herbs/vegetables",
        "Buy in bulk to reduce packaging",
        "Choose sustainable seafood",
        "Bring reusable bags/containers"
      ]
    },
    {
      name: "Shopping",
      unit: "kg CO2e/item",
      factors: [
        { activity: "New clothing (synthetic)", emission: 14.0, per: "item" },
        { activity: "New clothing (cotton)", emission: 8.0, per: "item" },
        { activity: "Used clothing", emission: 0.5, per: "item" },
        { activity: "Electronics (phone)", emission: 60.0, per: "item" },
        { activity: "Electronics (laptop)", emission: 100.0, per: "item" },
        { activity: "Books (paperback)", emission: 2.0, per: "item" }
      ],
      tips: [
        "Buy secondhand when possible",
        "Choose quality over quantity",
        "Repair instead of replace",
        "Borrow or rent rarely used items",
        "Choose durable, repairable products",
        "Avoid fast fashion",
        "Recycle old electronics properly",
        "Gift experiences, not things"
      ]
    },
    {
      name: "Waste",
      unit: "kg CO2e/day",
      factors: [
        { activity: "Landfill waste", emission: 0.58, per: "lb" },
        { activity: "Recycled paper", emission: 0.02, per: "lb" },
        { activity: "Composted organics", emission: 0.01, per: "lb" },
        { activity: "Recycled metal", emission: 0.01, per: "lb" },
        { activity: "Recycled glass", emission: 0.03, per: "lb" }
      ],
      tips: [
        "Reduce single-use items",
        "Compost food scraps",
        "Recycle properly (follow local rules)",
        "Avoid excessive packaging",
        "Use reusable containers",
        "Buy concentrates to reduce packaging",
        "Choose products with minimal packaging",
        "Donate instead of discard"
      ]
    }
  ],
  targets: {
    excellent: { daily: 3, annual: 1.1, description: "Climate hero level" },
    good: { daily: 6, annual: 2.2, description: "Sustainable lifestyle" },
    average: { daily: 10, annual: 3.6, description: "Typical Western" },
    high: { daily: 16, annual: 6.0, description: "High consumption" },
    very_high: { daily: 25, annual: 9.0, description: "Very high consumption" }
  }
}

export const ECO_TIPS = {
  home: [
    { tip: "LED bulbs use 75% less energy", impact: "High" },
    { tip: "Smart thermostat can save 10%", impact: "Medium" },
    { tip: "Draft-proof windows and doors", impact: "Medium" },
    { tip: "Solar panels ROI in 5-10 years", impact: "High" },
    { tip: "Rainwater harvesting for garden", impact: "Low" },
    { tip: "Greywater system for plants", impact: "Medium" },
    { tip: "Energy audit identifies savings", impact: "Medium" }
  ],
  transport: [
    { tip: "One less flight per year saves 1.6 tons", impact: "High" },
    { tip: "Public transit pass benefits", impact: "Medium" },
    { tip: "Electric bike for short trips", impact: "High" },
    { tip: "Car sharing reduces impact", impact: "Medium" },
    { tip: "Work from home 2x/week = 1 ton saved", impact: "Medium" },
    { tip: "Combine errands into one trip", impact: "Low" }
  ],
  food: [
    { tip: "One vegetarian meal/day = 0.8 tons/year", impact: "High" },
    { tip: "Reduce food waste 50% = 0.25 tons/year", impact: "Medium" },
    { tip: "Seasonal eating reduces transport emissions", impact: "Low" },
    { tip: "Local farmers market support", impact: "Low" },
    { tip: "Grow own herbs reduces packaging", impact: "Low" },
    { tip: "Meal planning reduces waste", impact: "Medium" }
  ],
  shopping: [
    { tip: "Buy nothing month challenge", impact: "High" },
    { tip: "Secondhand first policy", impact: "Medium" },
    { tip: "Quality over quantity mindset", impact: "Medium" },
    { tip: "Repair cafe community skills", impact: "Low" },
    { tip: "Library instead of buying books", impact: "Low" },
    { tip: "Digital over physical media", impact: "Low" }
  ]
}

export const SUSTAINABLE_GOALS = {
  daily: [
    { goal: "Use reusable water bottle", tip: "Saves 150 plastic bottles/year" },
    { goal: "Bring reusable bags", tip: "Plastic bag ban impact" },
    { goal: "Meat-free meal", tip: "Reduces footprint significantly" },
    { goal: "Walk/bike/use transit", tip: "Transportation emissions" },
    { goal: "Turn off unused electronics", tip: "Phantom load awareness" },
    { goal: "Compost food scraps", tip: "Methane reduction" },
    { goal: "Open blinds for natural light", tip: "Reduce lighting energy" }
  ],
  weekly: [
    { goal: "Zero waste shopping trip", tip: "Bring all containers/bags" },
    { goal: "Local farmers market visit", tip: "Support local, reduce transport" },
    { goal: "Clothing swap with friends", tip: "Extend garment life" },
    { goal: "Nature cleanup activity", tip: "Give back to environment" },
    { goal: "Meal prep to reduce waste", tip: "Plan, prep, preserve" },
    { goal: "Repair something broken", tip: "Skill building, less waste" },
    { goal: "Plant something", tip: "Connect with nature" }
  ],
  monthly: [
    { goal: "Zero-spend challenge", tip: "Only essentials, no extras" },
    { goal: "Energy audit of home", tip: "Identify savings opportunities" },
    { goal: "Declutter and donate", tip: "Extend product life cycles" },
    { goal: "Learn one sustainability skill", tip: "Repair, gardening, preserving" },
    { goal: "Support environmental org", tip: "Amplify impact" },
    { goal: "Carbon footprint calculation", tip: "Track and improve" }
  ]
}

export const GREEN_PRODUCTS = {
  alternatives: [
    { conventional: "Plastic water bottle", sustainable: "Stainless steel bottle", savings: "150+ plastics/year" },
    { conventional: "Plastic bags", sustainable: "Reusable bags", savings: "500+ plastics/year" },
    { conventional: "Paper towels", sustainable: "Cloth napkins", savings: "3+ rolls/month" },
    { conventional: "Disposable coffee cups", sustainable: "Travel mug", savings: "500+ cups/year" },
    { conventional: "Plastic straws", sustainable: "Metal/silicone straw", savings: "500+ straws/year" },
    { conventional: "Dryer sheets", sustainable: "Wool dryer balls", savings: "200+ sheets/year" },
    { conventional: "Cleaning chemicals", sustainable: "Vinegar/baking soda", savings: "Multiple bottles" },
    { conventional: "Shampoo bottles", sustainable: "Shampoo bars", savings: "5+ bottles/year" }
  ],
  certifications: [
    { name: "Energy Star", description: "Energy-efficient appliances" },
    { name: "USDA Organic", description: "Organic food products" },
    { name: "Fair Trade", description: "Ethical sourcing practices" },
    { name: "B Corp", description: "Verified sustainable business" },
    { name: "Forest Stewardship Council", description: "Responsible forestry" },
    { name: "LEED", description: "Green building certification" },
    { name: "EWG Verified", description: "Safe consumer products" },
    { name: "Climate Positive", description: "Net negative emissions" }
  ]
}

export const CLIMATE_ANXIETY = {
  coping_strategies: [
    {
      strategy: "Take action",
      actions: [
        "Vote for climate-conscious leaders",
        "Support environmental policies",
        "Reduce personal footprint",
        "Join community action groups",
        "Educate others",
        "Support climate organizations"
      ]
    },
    {
      strategy: "Find community",
      actions: [
        "Connect with like-minded people",
        "Join environmental groups",
        "Share feelings with friends",
        "Seek therapy if needed",
        "Practice active hope"
      ]
    },
    {
      strategy: "Focus on what you control",
      actions: [
        "Personal lifestyle changes",
        "Local community impact",
        "Workplace initiatives",
        "Family influence",
        "Consumer choices"
      ]
    },
    {
      strategy: "Practice acceptance",
      actions: [
        "Acknowledge emotions without judgment",
        "Distinguish facts from fears",
        "Focus on agency, not helplessness",
        "Celebrate wins, however small",
        "Practice gratitude for what we have"
      ]
    }
  ],
  resources: [
    "Climate Psychology Alliance",
    "Good Grief Network",
    "Climate Anxiety Counseling",
    "Project Drawdown",
    "Sierra Club"
  ]
}
