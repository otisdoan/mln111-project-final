const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyAzkAy6lpJbobXGvjyTpbMrjwHGlPuYF18";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    console.log("🔍 Listing available models...\n");

    // Try to list models
    const models = await genAI.listModels();

    console.log("✅ Available models:");
    for (const model of models) {
      console.log(`  - ${model.name}`);
      console.log(
        `    Supported methods: ${model.supportedGenerationMethods?.join(", ")}`
      );
    }
  } catch (error) {
    console.error("❌ Error listing models:", error.message);

    // Try common model names directly
    console.log("\n🔧 Testing common model names:\n");

    const modelsToTest = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "models/gemini-pro",
      "models/gemini-1.5-flash",
    ];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKS`);
      } catch (err) {
        console.log(`❌ ${modelName} - ${err.message.substring(0, 100)}`);
      }
    }
  }
}

listModels();
