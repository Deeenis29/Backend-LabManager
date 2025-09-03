import app from "@/server";
import { connectDB } from "@/db";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/api/v1`);
  });
})();
