// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(express.json());
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      app: "CropWaste2Value",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0"
    });
  });
  app.post("/api/matching/calculate", (req, res) => {
    const { listing, requirement, weights } = req.body;
    if (!listing || !requirement) {
      return res.status(400).json({ error: "listing and requirement objects are required" });
    }
    const defaultWeights = {
      material: 40,
      quantity: 20,
      location: 15,
      condition: 15,
      price: 5,
      timing: 5
    };
    const activeWeights = { ...defaultWeights, ...weights };
    let materialScore = listing.category === requirement.materialCategory ? 100 : 25;
    let quantityScore = 75;
    if (listing.availableQuantity >= requirement.minQuantity && listing.availableQuantity <= requirement.maxQuantity) {
      quantityScore = 100;
    } else if (listing.availableQuantity > requirement.maxQuantity) {
      quantityScore = 90;
    }
    let conditionScore = requirement.acceptableConditions?.includes(listing.condition) ? 100 : 40;
    let priceScore = listing.pricePerUnit <= requirement.targetPriceMax ? 100 : 60;
    let locationScore = 80;
    let timingScore = 95;
    const totalScore = Math.round(
      (materialScore * activeWeights.material + quantityScore * activeWeights.quantity + locationScore * activeWeights.location + conditionScore * activeWeights.condition + priceScore * activeWeights.price + timingScore * activeWeights.timing) / 100
    );
    res.json({
      listingId: listing.id,
      requirementId: requirement.id,
      totalScore,
      weights: activeWeights,
      factorBreakdown: {
        material: { weight: activeWeights.material, score: materialScore },
        quantity: { weight: activeWeights.quantity, score: quantityScore },
        location: { weight: activeWeights.location, score: locationScore },
        condition: { weight: activeWeights.condition, score: conditionScore },
        price: { weight: activeWeights.price, score: priceScore },
        timing: { weight: activeWeights.timing, score: timingScore }
      },
      isEligible: totalScore >= 40
    });
  });
  app.get("/api/categories", (req, res) => {
    res.json([
      { id: "cereal_straw", name: "Cereal Straw", examples: "Paddy / Rice Straw, Wheat Straw, Barley Straw" },
      { id: "sugarcane_bagasse", name: "Sugarcane Bagasse", examples: "Crushed Cane Fiber, Depithed Bagasse" },
      { id: "oilseed_residue", name: "Oilseed Residue", examples: "Groundnut Shells, Mustard Stover, Soybean Stalks" },
      { id: "fiber_cotton", name: "Cotton & Natural Fibers", examples: "Pulverized Cotton Stalks, Jute Fiber" },
      { id: "husk_shell", name: "Husks & Shells", examples: "Rice Husk, Coconut Coir, Coffee Husk" },
      { id: "horticulture_waste", name: "Horticulture Biomass", examples: "Banana Pseudo-stems, Pruned Orchard Branches" },
      { id: "agro_industrial", name: "Agro-Industrial Residues", examples: "Distillery Grain Byproducts, Spent Mushroom Compost" }
    ]);
  });
  app.get("/api/weather-recovery/guidelines", (req, res) => {
    res.json({
      disclaimer: "Farmer-reported observation \u2014 not an official crop insurance damage certification or laboratory moisture analysis. Buyers should inspect sample prior to combustion or processing.",
      approvedRecoveryPathways: [
        {
          name: "Thermophilic Windrow Composting",
          suitableConditions: ["damp_salvageable", "moderate_moisture"],
          idealMoisture: "30% - 45%",
          output: "Organic Humus Fertilizer"
        },
        {
          name: "Biochar Pyrolysis",
          suitableConditions: ["weather_damaged", "damp_salvageable"],
          idealMoisture: "< 25% post sun-drying",
          output: "Soil Carbon Sequestering Biochar"
        },
        {
          name: "Anaerobic Biomethanation (Biogas)",
          suitableConditions: ["damp_salvageable", "loose_dry"],
          idealMoisture: "High moisture acceptable",
          output: "Compressed Bio-Gas (CBG) & Liquid Fertilizer"
        }
      ]
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CropWaste2Value full-stack server running at http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
