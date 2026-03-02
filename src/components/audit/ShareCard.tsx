"use client";

import { Link2, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { toast } from "sonner";

interface ShareCardProps {
  auditId: string;
  score: number;
  url: string;
}

export function ShareCard({ auditId, score, url }: ShareCardProps) {
  const { copy } = useCopy();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const auditUrl = `${siteUrl}/audit/${auditId}`;
  const shareText = `Il sito ${url} ha ottenuto un GEO Score di ${score}/100. Scopri la visibilità AI del tuo sito:`;

  function handleCopy() {
    copy(auditUrl);
    toast.success("Link copiato!");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Link2 className="mr-2 h-4 w-4" />
        Copia link
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(auditUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(auditUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </a>
      </Button>
    </div>
  );
}
