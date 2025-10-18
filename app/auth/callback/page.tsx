"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function handleAuthCallback() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
        router.push("/masuk");
        return;
      }

      if (data.session) {
        router.push("/dashboard");
      } else {
        router.push("/masuk");
      }
    }

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-iark-red via-red-600 to-iark-blue opacity-10"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-iark-red/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-iark-blue/10 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-14 h-14 mb-6 text-iark-red"
        >
          <Loader2 className="w-full h-full" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Menyelesaikan proses masuk...
        </h1>
        <p className="text-gray-600 max-w-md">Mohon tunggu sebentar</p>

        <motion.div
          className="mt-8 w-40 h-2 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-iark-red"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
