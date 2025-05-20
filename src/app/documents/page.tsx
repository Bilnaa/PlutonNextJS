"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PdfPreviewModal } from "@/components/pdf-preview-modal";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [docTypes, setDocTypes] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchDocs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        // Récupère tous les documents
        const res = await fetch(`${apiUrl}/api/documents`, { credentials: "include" });
        if (!res.ok) throw new Error("Erreur lors du chargement des documents");
        const data = await res.json();
        // On suppose que data.documents est un tableau
        setDocuments(data.documents || []);
      } catch (e: any) {
        setError(e.message || "Erreur lors du chargement des documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    // Récupère les types de documents pour le filtre
    const fetchTypes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/documents/types`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          // On suppose que data.types est un tableau de types
          setDocTypes(data.types || []);
        }
      } catch {}
    };
    fetchTypes();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.title?.toLowerCase().includes(search.toLowerCase()) ||
        doc.name?.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filter ? (doc.type?.toLowerCase() === filter) : true;
    return matchesSearch && matchesType;
  });

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
      className="bg-background text-foreground min-h-screen"
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Mes documents" />
        {/* === HEADER & ACTIONS === */}
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mes documents</h1>
            </div>
          </div>
          {/* === FILTRES === */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
            <Input
              placeholder="Rechercher un document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Select value={filter ?? "all"} onValueChange={v => setFilter(v === "all" ? null : v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {docTypes.length > 0 ? docTypes.map((type: any) => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                )) : null}
              </SelectContent>
            </Select>
          </div>
          {/* === GRILLE DE DOCUMENTS === */}
          <div className="grid gap-x-4 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-40">Chargement...</div>
            ) : error ? (
              <div className="col-span-full text-red-500 text-center">{error}</div>
            ) : filteredDocuments.length === 0 ? (
              <div className="col-span-full text-muted-foreground text-sm">Aucun document trouvé.</div>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="group flex flex-col h-full w-full bg-card border border-border shadow-sm hover:shadow-lg transition-shadow rounded-2xl overflow-hidden p-0 relative">
                  <div className="bg-muted flex items-center justify-center h-32 border-b border-border">
                    <span className="text-4xl text-primary/80 group-hover:scale-110 transition-transform">📄</span>
                  </div>
                  <div className="flex flex-col gap-1 px-7 pt-5 pb-2">
                    <div className="font-semibold truncate text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{doc.title || doc.name || `Document #${doc.id}`}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize font-medium bg-muted/60 px-2 py-0.5 rounded">{doc.type || doc.documentType || "-"}</span>
                      <span className="ml-auto">{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("fr-FR") : "-"}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 px-7 pb-6 pt-5 mt-auto">
                    <Button size="sm" variant="default" className="w-1/2 rounded-md font-medium" onClick={() => { setPreviewDoc(doc); setShowPreview(true); }}>
                      Prévisualiser
                    </Button>
                    <Button asChild size="sm" variant="outline" className="w-1/2 rounded-md font-medium">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">Télécharger</a>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </SidebarInset>
      <PdfPreviewModal open={showPreview} onClose={() => setShowPreview(false)} doc={previewDoc} />
    </SidebarProvider>
  );
}
