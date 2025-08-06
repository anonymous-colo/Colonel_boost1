import { Link } from "wouter";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAccessButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href="/admin-kbs-access">
        <Button
          variant="outline"
          size="sm"
          className="bg-card/90 backdrop-blur-md border-primary/20 hover:bg-primary/10 shadow-lg"
          data-testid="button-admin-access"
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </Link>
    </div>
  );
}