"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Video, Mic, AlertCircle } from "lucide-react";

interface Scene {
  voiceover: string;
  visual_prompt: string;
}

interface ShortData {
  title?: string;
  script?: string;
  scenes?: Scene[];
  error?: string; // To handle API-side errors gracefully
}

export default function CreatorApp() {
  const [topic, setTopic] = useState("");
  const [data, setData] = useState<ShortData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setData(null); // Clear old data
    try {
      const res = await fetch("/api/short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || "Failed to generate");
      
      setData(result);
    } catch (err: any) {
      setData({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tighter">Faceless Short Architect</h1>
        <p className="text-muted-foreground">Global content creation, powered by Gemini.</p>
      </div>

      <div className="flex gap-3 bg-card p-4 rounded-xl shadow-sm border">
        <Input 
          placeholder="e.g., The mystery of the Sahara desert..." 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          className="text-lg"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading || !topic} size="lg">
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          {loading ? "Architecting..." : "Generate Concept"}
        </Button>
      </div>

      {/* Error State */}
      {data?.error && (
        <div className="flex items-center gap-2 p-4 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          <AlertCircle className="w-5 h-5" />
          <p>{data.error}</p>
        </div>
      )}

      {/* Success State */}
      {data && !data.error && (
        <div className="grid gap-6 animate-in fade-in duration-500">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" /> Full Script: {data.title || "Untitled"}
              </CardTitle>
            </CardHeader>
            <CardContent className="italic text-lg">
              "{data.script || "No script content generated."}"
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Using Optional Chaining ?. to prevent crashes */}
            {data.scenes?.map((scene, idx) => (
              <Card key={idx} className="overflow-hidden border-muted-foreground/20">
                <CardHeader className="bg-muted/50 py-3 border-b">
                  <CardTitle className="text-sm font-bold uppercase text-muted-foreground">
                    Scene {idx + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p className="text-sm font-medium leading-relaxed">
                    <span className="text-primary mr-2">🔊</span>
                    {scene.voiceover}
                  </p>
                  <div className="p-3 bg-secondary/30 rounded-md border border-dashed border-secondary">
                    <p className="text-xs text-secondary-foreground/80 font-mono">
                      <span className="font-bold block mb-1">🎬 Visual Prompt:</span> 
                      {scene.visual_prompt}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full group">
                    <Video className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" /> 
                    Generate Video Clip
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}