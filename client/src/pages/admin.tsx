import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ModernDashboard from "@/components/admin/modern-dashboard";
import AdminLogin from "@/components/admin/admin-login";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const { data: admin, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/profile"],
    retry: false,
    enabled: shouldRefetch,
  });

  const handleLoginSuccess = () => {
    setShouldRefetch(true);
    refetch();
  };

  if (shouldRefetch && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin || error) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return <ModernDashboard admin={admin} />;
}
