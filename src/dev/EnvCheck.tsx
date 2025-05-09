import React from "react";

const EnvCheck = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Supabase Env Check</h1>

      <div className="bg-secondary p-6 rounded-lg space-y-4 text-sm">
        <div>
          <strong>VITE_SUPABASE_URL:</strong><br />
          <code>{supabaseUrl || "❌ Not Loaded"}</code>
        </div>

        <div>
          <strong>VITE_SUPABASE_ANON_KEY:</strong><br />
          <code>{supabaseKey ? "✅ Loaded (masked)" : "❌ Not Loaded"}</code>
        </div>

        <div className="text-muted-foreground pt-4 border-t border-border">
          If both values are visible or confirmed as loaded, your `.env` setup is correct.<br />
          You do NOT need `.env.local` unless you're overriding locally.
        </div>
      </div>
    </div>
  );
};

export default EnvCheck; 