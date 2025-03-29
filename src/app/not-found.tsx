import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function NotFound() {
  const { t } = useTranslation()
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">{t("not-found.404")}</h1>
          <h2 className="text-2xl font-semibold tracking-tight">{t("not-found.Page not found")}</h2>
          <p className="text-muted-foreground">
            {t("not-found.Sorry message")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("not-found.Back to Home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

