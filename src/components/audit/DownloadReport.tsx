"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EmailGateDialog } from "@/components/email/EmailGateDialog";

interface DownloadReportProps {
  auditId: string;
}

export function DownloadReport({ auditId }: DownloadReportProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowDialog(true)}>
        <Download className="mr-2 h-4 w-4" />
        Scarica report PDF
      </Button>
      <EmailGateDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        auditId={auditId}
      />
    </>
  );
}
