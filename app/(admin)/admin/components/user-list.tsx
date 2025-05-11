"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/providers/auth-context";
import { supabase } from "@/lib/supabase-client";

interface Profile {
  id: string;
  email: string;
  role: "admin" | "customer";
  user_id: string;
}

const UserList = ({ profiles: initialProfiles, search }: { profiles: Profile[], search: string }) => {
  const { user } = useAuth();
  const [visibleUsersCount, setVisibleUsersCount] = useState(10);
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);

  const filteredProfiles = profiles
  .filter(profile =>
    profile.email.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (a.user_id === user?.id) return -1;
    if (b.user_id === user?.id) return 1;
    return 0;
  });

  const visibleProfiles = filteredProfiles.slice(0, visibleUsersCount);

  const handleShowMore = () => {
    setVisibleUsersCount((prevCount) => prevCount + 10);
  };

  const handleRoleToggle = async (profile: Profile) => {
    const newRole = profile.role === "admin" ? "customer" : "admin";

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profile.id);

    if (error) {
      console.error("Erro ao atualizar papel:", error);
      return;
    }

    const updatedProfiles = profiles.map((p) =>
      p.id === profile.id ? { ...p, role: newRole } : p
    );
    setProfiles(updatedProfiles);
  };

  return (
    <div className="space-y-2 mt-4">
      {visibleProfiles.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
      ) : (
        visibleProfiles.map((profile) => (
          <div key={profile.id} className="flex flex-wrap justify-between border rounded p-4 gap-4 sm:items-center">
            <div>
              <p className="font-medium break-all">
                {profile.user_id === user?.id && (
                  <span className="text-blue-600 hover:text-blue-400 mr-1">(Eu)</span>
                )}
                {profile.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.role === "admin" ? "Administrador" : "Usuário comum"}
              </p>
            </div>
            <div className="flex flex-row gap-2 sm:gap-0 items-end justify-end sm:items-center sm:space-x-2 space-y-1 sm:space-y-0 text-right">
              <Label htmlFor={`role-switch-${profile.id}`}>Administrador</Label>
              <Switch
                id={`role-switch-${profile.id}`}
                checked={profile.role === "admin"}
                onCheckedChange={() => handleRoleToggle(profile)}
                disabled={profile.user_id === user?.id}
                className="cursor-pointer"
              />
            </div>
          </div>
        ))
      )}

      {visibleUsersCount < filteredProfiles.length && filteredProfiles.length >= 10 && (
        <Button onClick={handleShowMore} className="mt-4">Ver mais</Button>
      )}
    </div>
  );
};

export default UserList;
