"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileForm } from "@/components/settings/profile-form";

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Log out and redirect would happen here
      logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Account Settings</h3>
        <p className="text-neutral-400">
          Manage your personal information and account security.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Settings - Extracted to Client Component */}
        <ProfileForm />

        {/* Connected Accounts */}
        <Card className="bg-neutral-900 border-neutral-800 md:col-span-1">
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Manage your linked login methods.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-xs text-neutral-400">Connected as {user?.email}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Connected</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-950 opacity-50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
                  <svg viewBox="0 0 384 512" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/></svg>
                </div>
                <div>
                  <p className="font-medium">Apple ID</p>
                  <p className="text-xs text-neutral-400">Not connected</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8">Connect</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account */}
      <Card className="border-red-900/50 bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription className="text-red-200/60">
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-50">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="confirm" className="mb-2 block text-sm">
                  Type <span className="font-mono font-bold text-red-500">DELETE</span> to confirm
                </Label>
                <Input
                  id="confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="bg-neutral-950 border-neutral-800"
                  placeholder="DELETE"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-neutral-800 hover:bg-neutral-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
