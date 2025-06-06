"use client"
import { RegisterForm } from "@/components/register-form"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* Left side: logo + quote */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-muted px-12 py-10">
        <div>
          <span className="font-semibold text-lg tracking-tight flex items-center gap-2">
            Pluton
          </span>
        </div>
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Pluton" className="h-70 w-90" />
        </div>
        <div className="mb-8">
          <blockquote className="text-lg font-medium">“Optimisez la gestion de vos biens immobiliers avec Pluton. Suivi des locations, automatisation, et bien plus en un seul endroit.”</blockquote>
          <span className="block mt-2 text-sm text-muted-foreground">Ethan Delalande</span>
        </div>
      </div>
      {/* Right side: form */}
      <div className="flex flex-1 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
        {/* Register/Login switcher en haut à droite du bloc form, avec ThemeSwitcher aligné */}
        <div className="absolute top-6 right-6 md:right-8 lg:right-12 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Déjà un compte ? </span>
          <a href="/login" className="text-sm font-medium text-primary hover:underline">Se connecter</a>
          {/* Switcher thème en haut à droite, bien séparé */}
          {/* <div>
            <ThemeSwitcher />
          </div> */}
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="bg-card rounded-2xl shadow p-8 border border-border">
            <div className="flex flex-col items-center mb-6">
              <img src="/logo.png" alt="Pluton" className="h-10 w-10 mb-2" />
              <h2 className="text-center text-2xl font-bold tracking-tight mb-1">Créer un compte Pluton</h2>
              <p className="text-center text-sm text-muted-foreground">Entrez votre email pour créer votre compte</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
